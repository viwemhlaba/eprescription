import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, FileText, FilePlus2, Repeat, UserCheck, PackageSearch } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const role = auth?.user?.role;

    const sharedNav: NavItem[] = [
        {
            title: 'Dashboard',
            href: `/${role}/dashboard`,
            icon: LayoutGrid,
        },
    ];

    const customerNav: NavItem[] = [
        { title: 'Profile', href: '/customer/profile', icon: UserCheck },
        { title: 'Prescriptions', href: '/customer/prescriptions', icon: FileText },
        // { title: 'Upload Prescription', href: '/customer/prescriptions/create', icon: FilePlus2 },
        { title: 'Repeats', href: '/customer/repeats', icon: Repeat },
        { title: 'Reports', href: '/customer/reports', icon: FileText },
        { title: 'Orders', href: '/customer/orders', icon: FileText },
        { title: 'Stock', href: '/customer/stock', icon: PackageSearch },
    ];

    const pharmacistNav: NavItem[] = [
        { title: 'Prescriptions', href: '/pharmacist/prescriptions', icon: FileText },
        { title: 'Dispense Queue', href: '/pharmacist/dispense', icon: PackageSearch },
        { title: 'Reports', href: '/pharmacist/reports', icon: FileText },
    ];

    const managerNav: NavItem[] = [
        { title: 'Manage Stock', href: '/manager/stock', icon: PackageSearch },
        { title: 'Manage Users', href: '/manager/users', icon: UserCheck },
        { title: 'Reports', href: '/manager/reports', icon: FileText },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits',
            icon: BookOpen,
        },
    ];

    const roleNavMap: Record<string, NavItem[]> = {
        customer: customerNav,
        pharmacist: pharmacistNav,
        manager: managerNav,
    };

    const mainNavItems = [...sharedNav, ...(roleNavMap[role] ?? [])];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={`/${role}/dashboard`} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
