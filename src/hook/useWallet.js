import { useState, useEffect, useCallback } from 'react';

export const useWallet = () => {
    const [connected, setConnected] = useState(false);
    const [account, setAccount] = useState(null);

    const connect = useCallback(async () => {
        if (window.aptos) {
            try {
                const response = await window.aptos.connect();
                setAccount(response);
                setConnected(true);
                localStorage.setItem('wallet-connected', 'true');
            } catch (error) {
                console.error('Connection failed:', error);
            }
        } else {
            alert('Please install Petra Wallet');
        }
    }, []);

    const disconnect = useCallback(() => {
        setAccount(null);
        setConnected(false);
        localStorage.removeItem('wallet-connected');
    }, []);

    useEffect(() => {
        const wasConnected = localStorage.getItem('wallet-connected');
        if (wasConnected && window.aptos) {
            connect();
        }
    }, [connect]);

    return { connected, account, connect, disconnect };
};
