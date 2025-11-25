import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from '@/components/ui/sidebar';

import { resolveUrl } from '@/lib/utils';
import { NavItemWithSubMenu } from '@/types';
import { Link, usePage } from '@inertiajs/react';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItemWithSubMenu[] }) {
    const page = usePage();
    const [open, setOpen] = useState<Record<string, boolean>>({});

    const toggle = (key: string) => {
        setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {items.map((item) => {
                    const isOpen = open[item.title] ?? false;
                    const hasSub = item.submenu && item.submenu.length > 0;

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild={hasSub ? false : true}
                                isActive={page.url.startsWith(resolveUrl(item.href))}
                                tooltip={{ children: item.title }}
                                onClick={
                                    hasSub
                                        ? () => toggle(item.title)
                                        : undefined
                                }
                            >
                                {hasSub ? (
                                    <div className="flex w-full items-center justify-between cursor-pointer select-none">
                                        <div className="flex items-center gap-2 text-sm font-medium ">
                                            {item.icon && <item.icon className='h-4 w-4'/>}
                                            <span>{item.title}</span>
                                        </div>
                                        

                                        <ChevronDown
                                            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </div>
                                ) : (
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon className='h-4 w-4'/>}
                                        <span>{item.title}</span>
                                    </Link>
                                )}
                            </SidebarMenuButton>


                            {hasSub && (
                                <SidebarMenuSub
                                    className={`overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    {item.submenu?.map((sub) => (
                                        <SidebarMenuSubItem key={sub.title}>
                                            <SidebarMenuSubButton asChild>
                                                <Link href={sub.href} prefetch>
                                                    {sub.icon && <sub.icon />}
                                                    <span>{sub.title}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
