"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Eye, Mail, User, Phone, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    service?: string;
    createdAt: string;
    viewed?: boolean;
}

export default function AdminMessagesPage() {
    const { t } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    async function fetchMessages() {
        setLoading(true);
        try {
            const res = await fetch("/api/messages");
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error("Failed to fetch messages");
        } finally {
            setLoading(false);
        }
    }

    async function markAsViewed(messageId: string) {
        try {
            const res = await fetch("/api/messages", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: messageId }),
            });
            if (res.ok) {
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg._id === messageId ? { ...msg, viewed: true } : msg
                    )
                );
            }
        } catch (error) {
            console.error("Failed to mark message as viewed");
        }
    }

    const handleViewMessage = (msg: Message) => {
        setSelectedMessage(msg);
        if (!msg.viewed) {
            markAsViewed(msg._id);
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full max-w-full overflow-hidden">
            <div className="flex items-center justify-between w-full">
                <h1 className="text-lg font-semibold md:text-2xl">{t('admin.messages')}</h1>
                <Button variant="outline" size="sm" onClick={fetchMessages} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>
            <Card className="w-full max-w-full overflow-hidden">
                <CardHeader className="px-3 py-3 sm:px-4 w-full max-w-full overflow-hidden">
                    <CardTitle className="text-base sm:text-lg break-words">{t('admin.contactInquiries')}</CardTitle>
                    <CardDescription className="text-xs break-words">{t('admin.messagesDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="px-0 sm:px-4 w-full max-w-full overflow-hidden pb-2">
                    {loading ? (
                        <div className="px-4 sm:px-0">Loading...</div>
                    ) : messages.length === 0 ? (
                        <div className="px-4 sm:px-0 text-muted-foreground">No messages found.</div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block w-full max-w-full overflow-y-auto max-h-[60vh] border rounded-md relative scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                                <Table className="w-full text-xs">
                                    <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                                        <TableRow className="h-8 hover:bg-background">
                                            <TableHead className="w-[40px] px-1 h-8">{t('admin.status')}</TableHead>
                                            <TableHead className="w-[80px] px-1 whitespace-nowrap h-8">{t('admin.date')}</TableHead>
                                            <TableHead className="w-[100px] px-1 h-8">{t('admin.messageName')}</TableHead>
                                            <TableHead className="w-[100px] px-1 h-8">{t('admin.service')}</TableHead>
                                            <TableHead className="w-[130px] px-1 h-8">{t('admin.email')}</TableHead>
                                            <TableHead className="w-[90px] px-1 h-8">{t('admin.phone')}</TableHead>
                                            <TableHead className="px-1 h-8">{t('admin.contactMessage')}</TableHead>
                                            <TableHead className="w-[80px] px-1 text-right h-8">{t('admin.action')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {messages.map((msg) => (
                                            <TableRow
                                                key={msg._id}
                                                className={`cursor-pointer hover:bg-muted/50 transition-colors h-8 ${!msg.viewed ? "bg-blue-50/50 dark:bg-blue-950/20 border-l-2 border-l-blue-500" : ""
                                                    }`}
                                            >
                                                <TableCell className="w-[40px] px-1 py-1">
                                                    {!msg.viewed && (
                                                        <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-[10px] px-1 py-0 h-4 whitespace-nowrap">
                                                            New
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="w-[80px] px-1 py-1 whitespace-nowrap">
                                                    {format(new Date(msg.createdAt), "MMM d, yy")}
                                                </TableCell>
                                                <TableCell className={`w-[100px] px-1 py-1 truncate max-w-[100px] ${!msg.viewed ? "font-semibold" : ""}`} title={msg.name}>{msg.name}</TableCell>
                                                <TableCell className="w-[100px] px-1 py-1 truncate max-w-[100px] font-medium text-primary">
                                                    {msg.service || "-"}
                                                </TableCell>
                                                <TableCell className="w-[130px] px-1 py-1 truncate max-w-[130px]" title={msg.email}>{msg.email}</TableCell>
                                                <TableCell className="w-[90px] px-1 py-1 truncate max-w-[90px]">{msg.phone}</TableCell>
                                                <TableCell className="px-1 py-1 truncate max-w-[150px]" title={msg.message}>{msg.message}</TableCell>
                                                <TableCell className="w-[80px] px-1 py-1 text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => handleViewMessage(msg)} className="h-6 px-2 text-xs">
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        <span>{t('admin.view')}</span>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile/Tablet Card View */}
                            <div className="lg:hidden space-y-4 px-4 w-full max-w-full overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                                {messages.map((msg) => (
                                    <Card
                                        key={msg._id}
                                        className={`cursor-pointer transition-colors w-full max-w-full ${!msg.viewed ? "bg-blue-50/50 dark:bg-blue-950/20 border-l-4 border-l-blue-500" : ""
                                            }`}
                                        onClick={() => handleViewMessage(msg)}
                                    >
                                        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6 w-full max-w-full">
                                            <div className="space-y-3 w-full">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        {!msg.viewed && (
                                                            <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs flex-shrink-0">
                                                                New
                                                            </Badge>
                                                        )}
                                                        <span className={`text-xs sm:text-sm text-muted-foreground truncate ${!msg.viewed ? "font-semibold" : ""}`}>
                                                            {format(new Date(msg.createdAt), "MMM d, yyyy")}
                                                        </span>
                                                        {msg.service && (
                                                            <Badge variant="outline" className="text-[10px] h-5 truncate max-w-[100px] hidden sm:flex">
                                                                {msg.service}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <Button variant="ghost" size="sm" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewMessage(msg);
                                                    }} className="flex-shrink-0">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <div className="w-full">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <p className={`text-sm sm:text-base font-medium truncate ${!msg.viewed ? "font-semibold" : ""}`}>
                                                            {msg.name}
                                                        </p>
                                                        {msg.service && (
                                                            <span className="text-xs font-medium text-primary sm:hidden truncate max-w-[100px]">
                                                                {msg.service}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-muted-foreground break-all">{msg.email}</p>
                                                    <p className="text-xs sm:text-sm text-muted-foreground">{msg.phone}</p>
                                                </div>
                                                <div className="pt-2 border-t">
                                                    <p className="text-xs sm:text-sm line-clamp-2 break-words">{msg.message}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
                <DialogContent className="sm:max-w-[600px] max-w-[95vw]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Message Details</DialogTitle>
                        <DialogDescription className="break-words">
                            Sent on {selectedMessage && format(new Date(selectedMessage.createdAt), "PPP 'at' p")}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedMessage && (
                        <div className="grid gap-6 py-4">
                            {selectedMessage.service && (
                                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                                    <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">Service Inquiry</p>
                                    <p className="text-lg font-bold">{selectedMessage.service}</p>
                                </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center text-sm font-medium text-muted-foreground">
                                        <User className="w-4 h-4 mr-2 flex-shrink-0" /> Sender Name
                                    </div>
                                    <p className="font-medium text-base break-words">{selectedMessage.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center text-sm font-medium text-muted-foreground">
                                        <Mail className="w-4 h-4 mr-2 flex-shrink-0" /> Sender Email
                                    </div>
                                    <p className="font-medium text-base break-all">{selectedMessage.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center text-sm font-medium text-muted-foreground">
                                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" /> Phone Number
                                    </div>
                                    <p className="font-medium text-base break-words">{selectedMessage.phone}</p>
                                </div>
                            </div>

                            <div className="space-y-2 pt-4 border-t">
                                <h4 className="font-semibold text-lg">Message Content</h4>
                                <div className="p-4 bg-muted/50 rounded-lg whitespace-pre-wrap break-words text-sm leading-relaxed max-h-[50vh] overflow-y-auto">
                                    {selectedMessage.message}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
