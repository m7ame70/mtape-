"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2, UserPlus } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Registration failed");
            }

            toast.success("Account created successfully", {
                description: "Please login with your new account.",
            });
            router.push("/login");
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-muted/30">
            <Card className="w-full max-w-md shadow-xl border-muted">
                <CardHeader className="space-y-2 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <UserPlus className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Create an Account</CardTitle>
                    <CardDescription>Enter your details to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <label htmlFor="name">Full Name</label>
                            <Input id="name" name="name" type="text" placeholder="John Doe" required />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="email">Email</label>
                            <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="password">Password</label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full h-10" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-6 mt-2">
                    <p className="text-sm text-muted-foreground">
                        Already have an account? <Link href="/login" className="text-primary hover:underline font-medium">Login</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
