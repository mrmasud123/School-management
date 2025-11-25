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
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    LayoutGrid,
    ShoppingBasket,
    Wallet,
    Boxes,
    FileText,
    Users,
    UserCog,
    BarChart2,
    CreditCard,
    Store,
    Table2
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Products',
        href: '/products',
        icon: ShoppingBasket,
    },
    {
        title: 'Sales & Billing',
        href: '/sales-billing',
        icon: Wallet,
    },
    {
        title: 'Inventory Management',
        href: '/inventory-management',
        icon: Boxes,
    },
    {
        title: 'Invoice & Receipt Generation',
        href: '/invoice-receipt',
        icon: FileText,
    },
    {
        title: 'Customer Management (CRM)',
        href: '/customer-management',
        icon: Users,
    },
    {
        title: 'Employee / Staff Management',
        href: '/employee-management',
        icon: UserCog,
    },
    {
        title: 'Reports & Analytics',
        href: '/reports-analytics',
        icon: BarChart2,
    },
    {
        title: 'Payment Integrations',
        href: '/payment-integrations',
        icon: CreditCard,
    },
    {
        title: 'Multi-Store / Multi-Branch',
        href: '/multi-store',
        icon: Store,
    },
    {
        title: 'Table Management (Dine-in)',
        href: '/table-management',
        icon: Table2,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()}>
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
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
