import React from 'react';
import { WalletButton } from './WalletButton';

function Header({ connected, account, onConnect }) {
    return (
        <header className="header" data-testid="app-header">
            <h1 data-testid="app-title">Decentralized Blog</h1>
            <WalletButton
                connected={connected}
                account={account}
                onConnect={onConnect}
                data-testid="wallet-button"
            />
        </header>
    );
}

export default Header;
