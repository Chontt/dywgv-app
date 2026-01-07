import { SupabaseClient } from '@supabase/supabase-js';

// Types for Auth Logs
type AuthEvent =
    | 'password_check'
    | 'password_leaked'
    | 'password_reset_forced'
    | 'login_failed'
    | 'admin_action';

interface LogAuthEventParams {
    supabase: SupabaseClient;
    userId?: string;
    event: AuthEvent;
    detail?: Record<string, unknown>;
    ip?: string;
}

/**
 * Logs an authentication or security event to the auth_logs table.
 * Uses a separate connection or the provided client to insert the log.
 * Fails silently to not block the main flow, but logs to console error.
 */
export async function logAuthEvent({ supabase, userId, event, detail, ip }: LogAuthEventParams) {
    try {
        const { error } = await supabase.from('auth_logs').insert({
            user_id: userId,
            event,
            detail,
            ip,
        });

        if (error) {
            console.error('Failed to log auth event:', error);
        }
    } catch (err) {
        console.error('Unexpected error logging auth event:', err);
    }
}

/**
 * Checks a password against the real HaveIBeenPwned API using k-anonymity.
 * 1. Hashes password with SHA-1.
 * 2. Sends first 5 chars to API.
 * 3. Checks if suffix exists in response.
 * Never sends the full password.
 */
export async function checkPasswordLeak(password: string): Promise<boolean> {
    try {
        // 1. Hash password with SHA-1
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

        // 2. K-Anonymity: API calls only use the first 5 chars
        const prefix = hashHex.substring(0, 5);
        const suffix = hashHex.substring(5);

        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        if (!response.ok) {
            console.warn('HIBP API Call failed:', response.status);
            return false; // Fail open (allow password) if API is down
        }

        const text = await response.text();

        // 3. Check if our suffix is in the response list
        // Response format: SUFFIX:COUNT\nSUFFIX:COUNT...
        const lines = text.split('\n');
        const isLeaked = lines.some(line => {
            const [lineSuffix] = line.split(':');
            return lineSuffix.trim() === suffix;
        });

        return isLeaked;

    } catch (error) {
        console.error('Error checking password leak:', error);
        return false; // Fail open
    }
}
