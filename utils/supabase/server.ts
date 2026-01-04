import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Support either passing `cookies()` result or the `cookies` getter itself.
type CookieStore = Awaited<ReturnType<typeof cookies>>;

function isFunction(v: unknown): v is (...args: any[]) => any {
    return typeof v === 'function';
}

export function createClient(cookieStoreOrGetter: CookieStore | (() => CookieStore)) {
    const cookieStore: any = isFunction(cookieStoreOrGetter) ? cookieStoreOrGetter() : cookieStoreOrGetter;

    // Prefer getAll/setAll API if available (recommended for createServerClient)
    if (cookieStore && typeof cookieStore.getAll === 'function') {
        const getAll = async () => cookieStore.getAll();
        const setAll = async (setCookies: Array<{ name: string; value: string; options?: CookieOptions }>) => {
            // Attempt to use provided setAll if available, otherwise call set repeatedly
            if (typeof cookieStore.setAll === 'function') return cookieStore.setAll(setCookies);
            for (const c of setCookies) {
                try {
                    if (typeof cookieStore.set === 'function') cookieStore.set(c as any);
                } catch (e) {
                    // ignore
                }
            }
        };

        return createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { getAll, setAll } as any }
        );
    }

    // Fallback to get/set/remove shape
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore?.get ? cookieStore.get(name)?.value : undefined;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        if (typeof cookieStore?.set === 'function') {
                            // Some runtimes accept ({ name, value, ...opts })
                            try {
                                cookieStore.set({ name, value, ...options });
                            } catch (e) {
                                // fallback to positional args if supported
                                (cookieStore.set as Function)(name, value);
                            }
                        }
                    } catch (error) {
                        // ignore in server components where set may be unavailable
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        if (typeof cookieStore?.set === 'function') {
                            // emulate remove by setting empty value
                            cookieStore.set({ name, value: '', ...options });
                        } else if (typeof cookieStore?.delete === 'function') {
                            cookieStore.delete(name);
                        }
                    } catch (error) {
                        // ignore
                    }
                },
            },
        }
    );
}
