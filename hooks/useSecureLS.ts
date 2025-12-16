'use client';

import { useRef, useEffect, useState } from 'react';
import SecureLS from 'secure-ls';

export default function useSecureLS() {
    const lsRef = useRef<SecureLS | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            lsRef.current = new SecureLS({ encodingType: 'aes' });
            setIsReady(true);
        }
    }, []);

    const set = (key: string, value: any) => {
        if (lsRef.current) {
            lsRef.current.set(key, value);
        }
    };

    const get = (key: string) => {
        if (lsRef.current) {
            try {
                return lsRef.current.get(key);
            } catch (err) {
                console.error('Failed to get from secure-ls:', err);
            }
        }
        return null;
    };

    const remove = (key: string) => {
        if (lsRef.current) {
            lsRef.current.remove(key);
        }
    };

    return { set, get, remove, isReady };
}
