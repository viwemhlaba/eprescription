import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types'; // Make sure this type is defined
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, ClipboardList, FileText, LayoutGrid, PackageSearch, Pill, Repeat, ShoppingCart, UserCheck, Users } from 'lucide-react';
import AppLogo from './app-logo';

interface NavItemComponentProps {
    // Define props for NavItemComponent
    item: NavItem;
}

function NavItemComponent({ item }: NavItemComponentProps) {
    if (item.items && item.items.length > 0 && !item.href) {
        // Render a heading for parent items with children
        return (
            <div className="pt-2 pb-1">
                <span className="text-muted-foreground text-xs font-semibold uppercase">{item.title}</span>
            </div>
        );
    }

    // Render a regular link item
    return (
        <Link
            href={item.href!}
            className="group hover:bg-accent hover:text-accent-foreground text-muted-foreground flex w-full items-center rounded-md px-2 py-1.5 text-sm font-medium"
        >
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            {item.title}
        </Link>
    );
}

export function AppSidebar() {
    interface AuthUser {
        role: string;
        // Add other user properties if needed
    }

    interface PageProps {
        auth?: {
            user?: AuthUser;
            // Add other auth properties if needed
        };
        // Add other page props if needed
    }

    const { auth } = usePage<PageProps>().props;
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
        { title: 'Repeats', href: '/customer/repeats', icon: Repeat },
        { title: 'Orders', href: '/customer/orders', icon: PackageSearch },
        { title: 'Stock', href: '/customer/stock', icon: PackageSearch }, // Potentially not needed for customer, but kept as per previous
        { title: 'Reports', href: '/customer/reports', icon: FileText },
    ];

    const pharmacistNav: NavItem[] = [
        {
            title: 'Profile',
            href: '/pharmacist/profile',
            icon: Users,
        },
        {
            title: 'Prescriptions',
            href: '/pharmacist/prescriptions', // This will be the "View Prescriptions" page
            icon: FileText,
        },
        {
            title: 'Dispense Queue',
            href: '/pharmacist/dispense', // This will be the "Dispense Prescription" page
            icon: PackageSearch,
        },
        {
            title: 'Reports',
            href: '/pharmacist/reports', // This will be the "Generate Dispensed Medication Report" page
            icon: FileText,
        },
    ];

    const managerNav: NavItem[] = [
        {
            title: 'Pharmacy',
            href: '/manager/pharmacy/details', // Direct link to details
            icon: ClipboardList,
        },
        {
            title: 'Catalogue',
            href: '/manager/catalogue/medications', // Direct link to medications
            icon: Pill,
        },
        {
            title: 'Suppliers',
            href: '/manager/suppliers',
            icon: ShoppingCart,
        },
        {
            title: 'People',
            href: '/manager/people/pharmacists',
            icon: Users,
        },
        {
            title: 'Stock',
            href: '/manager/stock',
            icon: PackageSearch,
        },
        {
            title: 'Orders',
            href: '/manager/orders',
            icon: ShoppingCart,
        },
        {
            title: 'Reports',
            href: '/manager/reports',
            icon: FileText,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Home',
            href: '/',
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
                <div className="space-y-1">
                    {mainNavItems.map((item) => (
                        <NavItemComponent key={item.href || item.title} item={item} />
                    ))}
                    {/* Render headings for the former parent menu items */}
                    {managerNav.find((item) => item.title === 'Pharmacy')?.items && (
                        <div className="pt-2 pb-1">
                            <span className="text-muted-foreground text-xs font-semibold uppercase">Pharmacy</span>
                        </div>
                    )}
                    {managerNav.find((item) => item.title === 'Catalogue')?.items && (
                        <div className="pt-2 pb-1">
                            <span className="text-muted-foreground text-xs font-semibold uppercase">Catalogue</span>
                        </div>
                    )}
                    {managerNav.find((item) => item.title === 'People')?.items && (
                        <div className="pt-2 pb-1">
                            <span className="text-muted-foreground text-xs font-semibold uppercase">People</span>
                        </div>
                    )}
                </div>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
