"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2, Printer } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                toast.error("Invalid credentials");
            } else {
                toast.success("Logged in successfully");
                router.push("/admin");
                router.refresh();
            }
        } catch (error) {
            toast.error("Something went wrong");
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
                            <Printer className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <label htmlFor="email">Email</label>
                            <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password">Password</label>
                                <Link href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
                            </div>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full h-10" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-6 mt-2">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account? <Link href="/register" className="text-primary hover:underline font-medium">Register</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
