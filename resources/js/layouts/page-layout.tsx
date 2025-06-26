import { AppSidebar } from '@/components/app-sidebar';
import { User } from '@/types';
import React from 'react';

interface PageLayoutProps {
    user: User;
    children: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
    return (
        <div className="bg-muted/40 flex min-h-screen w-full flex-col">
            <AppSidebar />
            <main className="flex flex-1 flex-col gap-4 p-4 sm:pl-14 md:gap-8 md:p-10">{children}</main>
        </div>
    );
};
