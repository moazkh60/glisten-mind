/**
 * Hook to access the latest completed session data.
 * Auto-refreshes when the screen gains focus.
 */

import { getLatestSession, SessionRecord } from '@/utils/sessionStorage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

export function useSessionHistory() {
    const [latestSession, setLatestSession] = useState<SessionRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let cancelled = false;

            async function load() {
                setIsLoading(true);
                const session = await getLatestSession();
                if (!cancelled) {
                    setLatestSession(session);
                    setIsLoading(false);
                }
            }

            load();

            return () => {
                cancelled = true;
            };
        }, [])
    );

    return { latestSession, isLoading };
}
