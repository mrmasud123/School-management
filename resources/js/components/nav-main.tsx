import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useAuthorization } from '@/hooks/use-authorization';
import { resolveUrl } from '@/lib/utils';
import { NavItemWithSubMenu } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItemWithSubMenu[] }) {
    const page = usePage();
    const [open, setOpen] = useState<Record<string, boolean>>({});
    const { can, canAny, hasRoles } = useAuthorization();

    const toggle = (key: string) => {
        setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const { auth } = usePage().props;
    console.log('auth');
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {items.map((item) => {
                    if (!hasRoles(item.roles)) return null;

                    const hasSub = item.submenu && item.submenu.length > 0;

                    const isSubActive = hasSub
                        ? item.submenu?.some((sub) =>
                              page.url.startsWith(resolveUrl(sub.href)),
                          )
                        : false;

                    const isOpen = open[item.title] ?? isSubActive;

                    const isActive =
                        !hasSub && page.url.startsWith(resolveUrl(item.href));

                    const parentClass =
                        isActive || isSubActive
                            ? '!bg-green-600 !text-white hover:!bg-green-700'
                            : '';

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild={!hasSub}
                                isActive={isActive || isSubActive}
                                className={parentClass}
                                tooltip={{ children: item.title }}
                                onClick={
                                    hasSub
                                        ? () => toggle(item.title)
                                        : undefined
                                }
                            >
                                {hasSub ? (
                                    <div className="flex w-full cursor-pointer items-center justify-between select-none">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            {item.icon && (
                                                <item.icon
                                                    className={
                                                        isActive || isSubActive
                                                            ? 'h-4 w-4 text-white'
                                                            : 'h-4 w-4'
                                                    }
                                                />
                                            )}
                                            <span>{item.title}</span>
                                        </div>

                                        <ChevronDown
                                            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                        />
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href}
                                        prefetch
                                        className="flex items-center gap-2"
                                    >
                                        {item.icon && (
                                            <item.icon
                                                className={
                                                    isActive
                                                        ? 'h-4 w-4 text-white'
                                                        : 'h-4 w-4'
                                                }
                                            />
                                        )}
                                        <span>{item.title}</span>
                                    </Link>
                                )}
                            </SidebarMenuButton>

                            {hasSub && (
                                <SidebarMenuSub
                                    className={`overflow-hidden transition-all duration-300 ${
                                        isOpen
                                            ? 'max-h-screen opacity-100'
                                            : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    {item.submenu
                                        ?.filter((sub) => hasRoles(sub.roles))
                                        .map((sub) => {
                                            const subActive =
                                                page.url.startsWith(
                                                    resolveUrl(sub.href),
                                                );
                                            return (
                                                <SidebarMenuSubItem
                                                    key={sub.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={subActive}
                                                        className={
                                                            subActive
                                                                ? '!bg-green-600 !text-white hover:!bg-green-700'
                                                                : ''
                                                        }
                                                    >
                                                        <Link
                                                            href={sub.href}
                                                            prefetch
                                                            className="flex items-center gap-2"
                                                        >
                                                            {sub.icon && (
                                                                <sub.icon
                                                                    className={
                                                                        subActive
                                                                            ? '!text-white'
                                                                            : '!text-black'
                                                                    }
                                                                />
                                                            )}
                                                            <span>
                                                                {sub.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
                                </SidebarMenuSub>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
