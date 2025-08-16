import React from 'react';

export function WalletButton({ connected, account, onConnect }) {
    if (connected && account?.address) {
        return (
            <button
                className="wallet-button connected"
                data-testid="wallet-button-connected"
            >
                {`${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
            </button>
        );
    }

    return (
        <button
            className="wallet-button"
            onClick={onConnect}
            data-testid="wallet-button-connect"
        >
            Connect Wallet
        </button>
    );
}
