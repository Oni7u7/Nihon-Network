'use client';

import { PrivyProvider } from "@privy-io/react-auth";

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cm9x9cb4v00cflb0o09s0560u'}
            config={{
                loginMethods: ['wallet'],
                appearance: {
                    theme: 'dark',
                    accentColor: '#3B82F6',
                    showWalletLoginFirst: true,
                },
            }}
        >
            {children}
        </PrivyProvider>
    );
} 