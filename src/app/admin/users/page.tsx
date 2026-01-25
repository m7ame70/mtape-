"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Shield, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface User {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    createdAt: string;
}

export default function UsersPage() {
    const { t, locale } = useLanguage();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    async function fetchUsers() {
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    async function toggleRole(userId: string, currentRole: string) {
        setUpdatingId(userId);
        const newRole = currentRole === 'admin' ? 'user' : 'admin';

        try {
            const res = await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId, role: newRole }),
            });

            if (res.ok) {
                toast.success(`${t('admin.userRoleUpdated')} ${newRole}`);
                fetchUsers(); // Refresh list
            } else {
                toast.error("Failed to update role");
            }
        } catch (error) {
            toast.error("Error updating role");
        } finally {
            setUpdatingId(null);
        }
    }

    async function deleteUser(userId: string) {
        setUpdatingId(userId);
        try {
            const res = await fetch(`/api/users?id=${userId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success(t('admin.userDeleted'));
                fetchUsers();
            } else {
                toast.error("Failed to delete user");
            }
        } catch (error) {
            toast.error("Error deleting user");
        } finally {
            setUpdatingId(null);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('admin.users')}</h1>
                    <p className="text-muted-foreground">{t('admin.usersDesc')}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('admin.registeredUsers')}</CardTitle>
                    <CardDescription>
                        {t('admin.usersListDesc')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-start">{t('admin.messageName')}</TableHead>
                                    <TableHead className="text-start">{t('admin.email')}</TableHead>
                                    <TableHead className="text-start">{t('admin.role')}</TableHead>
                                    <TableHead className="text-start">{t('admin.joinedAt')}</TableHead>
                                    <TableHead className="text-end">{t('admin.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                {user.role === 'admin' && <ShieldCheck className="w-3 h-3 mr-1" />}
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(user.createdAt), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell className="text-end">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleRole(user._id, user.role)}
                                                disabled={updatingId === user._id}
                                            >
                                                {updatingId === user._id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : user.role === 'admin' ? (
                                                    <span className="text-destructive flex items-center">
                                                        <ShieldAlert className="w-4 h-4 mr-1" /> {t('admin.revokeAdmin')}
                                                    </span>
                                                ) : (
                                                    <span className="text-primary flex items-center">
                                                        <Shield className="w-4 h-4 mr-1" /> {t('admin.makeAdmin')}
                                                    </span>
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm(t('admin.confirmDeleteUser'))) {
                                                        deleteUser(user._id);
                                                    }
                                                }}
                                                className="ml-2 text-destructive hover:text-destructive/90"
                                                disabled={updatingId === user._id || user._id === "6752d5b8c2dfc11b854e4ac0"}
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" /> {t('admin.delete')}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
