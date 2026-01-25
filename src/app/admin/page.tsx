"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, MessageSquare, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
    const { t } = useLanguage();
    const [stats, setStats] = useState({
        serviceCount: 0,
        messageCount: 0,
        userCount: 0,
        recentMessages: [],
        recentUsers: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/admin/dashboard-stats');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setStats(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return <div className="flex flex-col gap-4">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="flex flex-col gap-4 text-red-500">Error loading dashboard: {error}</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight">{t('admin.overview')}</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/admin/services">
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('admin.totalServices')}</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.serviceCount}</div>
                            <p className="text-xs text-muted-foreground">{t('admin.activeServices')}</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/messages">
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('admin.totalMessages')}</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.messageCount}</div>
                            <p className="text-xs text-muted-foreground">{t('admin.inquiriesReceived')}</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/users">
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('admin.totalUsers')}</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.userCount}</div>
                            <p className="text-xs text-muted-foreground">{t('admin.registeredAccounts')}</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader className="pb-3">
                        <CardTitle>{t('admin.recentMessages')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.recentMessages.length === 0 ? (
                            <p className="text-muted-foreground">{t('admin.noRecentActivity')}</p>
                        ) : (
                            <div className="space-y-4">
                                {stats.recentMessages.map((msg: any) => (
                                    <div key={msg._id} className="flex item-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{msg.name}</p>
                                            <p className="text-sm text-muted-foreground">{msg.email}</p>
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{msg.message}</p>
                                        </div>
                                        <div className="ml-auto font-medium text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader className="pb-3">
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                            <Link href="/admin/services">
                                <div className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                    <Package className="h-5 w-5 text-primary" />
                                    <span className="text-xs font-medium text-center">Services</span>
                                </div>
                            </Link>
                            <Link href="/admin/messages">
                                <div className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                    <span className="text-xs font-medium text-center">Messages</span>
                                </div>
                            </Link>
                            <Link href="/admin/gallery">
                                <div className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                    <Activity className="h-5 w-5 text-primary" />
                                    <span className="text-xs font-medium text-center">Gallery</span>
                                </div>
                            </Link>
                            <Link href="/admin/users">
                                <div className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                    <Users className="h-5 w-5 text-primary" />
                                    <span className="text-xs font-medium text-center">Users</span>
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Users Section */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.recentUsers.length === 0 ? (
                        <p className="text-muted-foreground">No users registered yet.</p>
                    ) : (
                        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
                            {stats.recentUsers.map((user: any) => (
                                <div key={user._id} className="flex items-center justify-between p-2 border rounded-lg">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                            {user.role}
                                        </span>
                                        <span className="text-xs text-muted-foreground hidden sm:block">
                                            {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
