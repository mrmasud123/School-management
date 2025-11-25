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
import { NavItemWithSubMenu, type NavItem } from '@/types';
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
    Table2,
    RollerCoaster
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItemWithSubMenu[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Products',
        href: '/products',
        icon: ShoppingBasket,
        submenu: [
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
        ]
    },
    
    {
        title: 'Roles',
        href: '/roles',
        icon: RollerCoaster,
    },
    {
        title: 'Permissions',
        href: '/permissions',
        icon: Users,
    },
    {
        title: 'Student Admission',
        href: '/student-admission',
        icon: FileText,
    },
    {
        title: 'Student Management',
        href: '/student-management',
        icon: Users,
    },
    {
        title: 'Parent Accounts',
        href: '/parent-accounts',
        icon: UserCog,
    },
    {
        title: 'Staff Management',
        href: '/staff-management',
        icon: BarChart2,
    },
    {
        title: 'ID Card Printing',
        href: '/id-card-printing',
        icon: CreditCard,
    },
    {
        title: 'Accountants',
        href: '/accountants',
        icon: Wallet,
    },
    {
        title: 'Parent Complaints',
        href: '/parent-complaints',
        icon: FileText,
    },
    {
        title: 'Classes & Sections',
        href: '/classes-sections',
        icon: Table2,
    },
    {
        title: 'Manage Subjects',
        href: '/manage-subjects',
        icon: BookOpen,
    },
    {
        title: 'Manage Attendance',
        href: '/manage-attendance',
        icon: BarChart2,
    },
    {
        title: 'Online Classes',
        href: '/online-classes',
        icon: Store,
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
