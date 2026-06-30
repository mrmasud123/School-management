import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Bell, Check } from 'lucide-react';
import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';

interface Notification {
    id: number;
    title: string;
    message: string;
    created_at: string;
    read_at: string | null;
}

interface AppSidebarHeaderProps {
    breadcrumbs?: BreadcrumbItemType[];
}

export function AppSidebarHeader({ breadcrumbs = [] }: AppSidebarHeaderProps) {
    const { notifications = [] } = usePage<{ notifications: Notification[] }>().props;
    const [open, setOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.read_at).length;

    const markAsRead = (id: number) => {
        router.post(`/notifications/${id}/read`, {}, { preserveScroll: true });
    };

    const markAllAsRead = () => {
        router.post(`/notifications/read-all`, {}, { preserveScroll: true });
    };

    return (
        <header className="flex h-16 shrink-0 items-center border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">

            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="relative ms-auto">

                <button
                    onClick={() => setOpen(prev => !prev)}
                    className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition cursor-pointer"
                >
                    <Bell className="w-5 h-5 text-gray-700" />

                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </button>

                {open && (
                    <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">

                        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                            <h3 className="text-sm font-semibold text-gray-800">
                                Notifications
                            </h3>

                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 hover:underline cursor-pointer"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <p className="p-4 text-sm text-gray-500 text-center">
                                    No notifications
                                </p>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`px-4 py-3 border-b last:border-none transition hover:bg-gray-50 ${
                                            !notification.read_at ? 'bg-blue-50' : ''
                                        }`}
                                    >
                                        <div className="flex justify-between items-start gap-3">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-800">
                                                    {notification.title}
                                                </h4>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {notification.message}
                                                </p>
                                                <span className="text-[10px] text-gray-400">
                                                    {notification.created_at}
                                                </span>
                                            </div>

                                            {!notification.read_at && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}