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
    BarChart2,
    BookOpen,
    Boxes,
    ChevronsLeftRightEllipsis,
    CreditCard,
    FileText,
    Folder,
    LayoutGrid,
    RollerCoaster,
    ShoppingBasket,
    Store,
    Table2,
    UserCog,
    Users,
    Wallet,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItemWithSubMenu[] = [
    {
        title: 'Student Profile',
        href: '/student-profile',
        icon: LayoutGrid,
        roles: ['student'],
    },
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        roles: ['admin', 'super admin', 'accountant', 'teacher', 'student'],
    },
    {
        title: 'Institution',
        href: '',
        icon: ShoppingBasket,
        roles: ['admin', 'super admin', 'accountant', 'teacher'],
        submenu: [
            {
                title: 'Classes',
                href: '/classes',
                icon: Wallet,
                roles: ['admin', 'super admin', 'accountant', 'teacher'],
            },
            {
                title: 'Students',
                href: '/students',
                icon: Users,
                roles: ['admin', 'super admin', 'accountant', 'teacher'],
            },
            {
                title: 'Sections',
                href: '/sections',
                icon: Boxes,
                roles: ['admin', 'super admin', 'accountant', 'teacher'],
            },
            {
                title: 'Migrate Students',
                href: '/migrate',
                icon: ChevronsLeftRightEllipsis,
                roles: ['admin', 'super admin', 'teacher'],
            },
        ],
    },
    {
        title: 'Teachers',
        href: '/teachers',
        icon: BookOpen,
        roles: ['admin', 'super admin', 'accountant', 'teacher'],
    },
    {
        title: 'Subjects',
        href: '/subjects',
        icon: BookOpen,
        roles: ['admin', 'super admin', 'accountant', 'teacher'],
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: RollerCoaster,
        roles: ['admin', 'super admin', 'accountant', 'teacher'],
    },
    {
        title: 'Permissions',
        href: '/permissions',
        icon: Users,
        roles: ['admin', 'super admin', 'accountant', 'teacher'],
    },
    {
        title: 'Users',
        href: '/users',
        icon: Users,
        roles: ['admin', 'super admin', 'accountant', 'teacher'],
    },
    {
        title: 'Student Details',
        href: '/student-details',
        icon: CreditCard,
        roles: ['admin', 'super admin', 'accountant', 'teacher'],
    },
    {
        title: 'Parent Accounts',
        href: '/parent-accounts',
        icon: UserCog,
        roles: ['admin', 'super admin', 'accountant', 'teacher'],
    },
    {
        title: 'Staff Management',
        href: '/staff-management',
        icon: BarChart2,
        roles: ['admin', 'super admin', 'accountant', 'teacher'],
    },
    {
        title: 'Student Management',
        href: '/student-management',
        icon: Users,
        roles: ['admin', 'super admin', 'accountant', 'teacher'],
    },

    {
        title: 'Accountants',
        href: '/accountants',
        icon: Wallet,
        roles: ['admin', 'super admin', 'accountant', 'teacher'],
    },
    {
        title: 'Parent Complaints',
        href: '/parent-complaints',
        icon: FileText,
        roles: ['admin', 'super admin', 'accountant', 'teacher'],
    },
    {
        title: 'Classes & Sections',
        href: '/classes-sections',
        icon: Table2,
        roles: ['admin', 'super admin', 'accountant', 'teacher'],
    },

    {
        title: 'Manage Attendance',
        href: '/manage-attendance',
        icon: BarChart2,
        roles: ['admin', 'super admin', 'accountant', 'teacher'],
    },
    {
        title: 'Online Classes',
        href: '/online-classes',
        icon: Store,
        roles: ['admin', 'super admin', 'accountant', 'teacher'],
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
