import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    ClipboardList,
    FileText,
    FlaskConical,
    LayoutGrid,
    PackageSearch,
    Pill,
    Repeat,
    ShoppingCart,
    Syringe,
    UserCheck,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

interface NavItemComponentProps {
    item: NavItem;
}

function NavItemComponent({ item }: NavItemComponentProps) {
    if (item.items && item.items.length > 0 && !item.href) {
        return (
            <div className="pt-2 pb-1">
                <span className="text-muted-foreground text-xs font-semibold uppercase">{item.title}</span>
            </div>
        );
    }

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
    }

    interface PageProps {
        auth?: {
            user?: AuthUser;
        };
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
        { title: 'Stock', href: '/customer/stock', icon: PackageSearch },
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
            href: '/pharmacist/prescriptions',
            icon: FileText,
        },
        {
            title: 'Dispense Queue',
            href: '/pharmacist/repeats',
            icon: PackageSearch,
        },
        {
            title: 'Stock',
            href: '/pharmacist/stock',
            icon: PackageSearch,
        },
        {
            title: 'Reports',
            href: '/pharmacist/reports',
            icon: FileText,
        },
    ];

    const managerNav: NavItem[] = [
        {
            title: 'Pharmacies', // Changed title to plural for clarity
            href: route('manager.pharmacies.index'), // Points to the new index page
            icon: ClipboardList,
        },
        {
            title: 'Active Ingredients', // NEW: Add this item
            href: route('manager.activeIngredients.index'), // NEW: Link to the index page
            icon: FlaskConical, // NEW: Use FlaskConical icon, or choose another that fits
        },
        {
            title: 'Dosage Forms', // NEW: Add this item
            href: route('manager.dosageForms.index'), // NEW: Link to the index page
            icon: Syringe, // NEW: Using Syringe icon, or choose another
        },
        {
            title: 'Pharmacists', // New or updated link
            href: route('manager.pharmacists.index'),
            icon: Users, // Using Users icon
        },
        {
            title: 'Catalogue',
            href: '/manager/catalogue/medications',
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
                </div>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
