'use server';

import { createClient } from '@/utils/supabase/server';
import { checkPasswordLeak, logAuthEvent } from '@/lib/security';
import { cookies } from 'next/headers';

/**
 * Server Action to check if a password is valid and not leaked.
 * Returns an object with success/error details.
 */
export async function validatePasswordSecurity(password: string) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 1. Basic length check
    if (password.length < 8) {
        return {
            success: false,
            code: 'VALIDATION_ERROR',
            message: 'Password must be at least 8 characters long.'
        };
    }

    // 2. Check for leaks (HIBP via lib/security)
    const isLeaked = await checkPasswordLeak(password);

    if (isLeaked) {
        // Log the attempt (anonymously or attached to session if possible)
        const { data: { user } } = await supabase.auth.getUser();
        await logAuthEvent({
            supabase,
            userId: user?.id, // specific user or null
            event: 'password_leaked',
            detail: { origin: 'signup_or_reset' }
        });

        return {
            success: false,
            code: 'PASSWORD_LEAKED',
            message: 'This password was found in a data breach. Please choose a different one.'
        };
    }

    return { success: true };
}

/**
 * Server Action to securely reset the password and clear the force_reset flag.
 */
export async function resetPasswordAction(password: string) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 1. Validate security
    const validation = await validatePasswordSecurity(password);
    if (!validation.success) {
        return validation;
    }

    // 2. Update password and clear flag
    const { error } = await supabase.auth.updateUser({
        password: password,
        data: { force_password_reset: null } // Clear the flag
    });

    if (error) {
        return { success: false, code: 'UPDATE_FAILED', message: error.message };
    }

    // 3. Log event
    const { data: { user } } = await supabase.auth.getUser();
    await logAuthEvent({
        supabase,
        userId: user?.id,
        event: 'admin_action', // or 'password_reset'
        detail: { method: 'forced_reset_flow' }
    });

    return { success: true };
}
