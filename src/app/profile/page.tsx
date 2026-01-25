'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Loader2, Camera, User as UserIcon, Mail, Calendar, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
    createdAt: string;
}

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/profile');
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setName(data.name);
                setImageUrl(data.image || '');
            } else {
                toast.error('Failed to load profile');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleSave = async () => {
        setSaving(true);
        try {
            let finalImageUrl = imageUrl;

            // 1. Upload new image if selected
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadRes.ok) {
                    const error = await uploadRes.json();
                    throw new Error(error.message || 'Failed to upload image');
                }

                const { url } = await uploadRes.json();
                finalImageUrl = url;
            }

            // 2. Update profile with URL
            console.log('Saving profile with:', { name, image: finalImageUrl });

            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, image: finalImageUrl }),
            });

            if (res.ok) {
                const updatedProfile = await res.json();
                console.log('Profile updated:', updatedProfile);

                toast.success('Profile updated successfully! Refreshing...');

                // Clear file state
                setImageFile(null);

                // Reload page to update session
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                const error = await res.json();
                console.error('Failed to update:', error);
                toast.error('Failed to update profile: ' + (error.error || 'Unknown error'));
            }
        } catch (error: any) {
            console.error('Error saving profile:', error);
            toast.error(error.message || 'An error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Profile not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Picture Card */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Profile Picture</CardTitle>
                        <CardDescription>Update your profile photo</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <Avatar className="h-32 w-32 border-4 border-primary/10">
                                <AvatarImage src={imageUrl || profile.image} alt={profile.name} />
                                <AvatarFallback className="text-4xl bg-gradient-to-br from-primary/20 to-primary/10">
                                    {profile.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 bg-primary rounded-full p-2 border-4 border-background">
                                <Camera className="h-4 w-4 text-primary-foreground" />
                            </div>
                        </div>
                        <div className="w-full space-y-2">
                            <Label htmlFor="imageUpload">Upload Photo</Label>
                            <div className="flex flex-col gap-2">
                                <Input
                                    id="imageUpload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            // Check file size (max 5MB match API)
                                            if (file.size > 5 * 1024 * 1024) {
                                                toast.error('Image size must be less than 5MB');
                                                return;
                                            }

                                            setImageFile(file); // Store file for upload

                                            // Preview
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setImageUrl(reader.result as string);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="cursor-pointer"
                                />
                                {imageUrl && imageUrl !== profile.image && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setImageUrl(profile.image || '')}
                                    >
                                        Remove New Photo
                                    </Button>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Upload an image from your device (max 2MB)
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Information Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        value={profile.email}
                                        disabled
                                        className="pl-10 bg-muted"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Email cannot be changed
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label>Role</Label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                                        disabled
                                        className="pl-10 bg-muted"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Member Since</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={`${formatDistanceToNow(new Date(profile.createdAt))} ago`}
                                        disabled
                                        className="pl-10 bg-muted"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button onClick={handleSave} disabled={saving} className="flex-1">
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setName(profile.name);
                                    setImageUrl(profile.image || '');
                                }}
                                disabled={saving}
                            >
                                Reset
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Account Stats */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Statistics</CardTitle>
                    <CardDescription>Your account activity overview</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg">
                            <p className="text-3xl font-bold text-primary">{profile.role === 'admin' ? '∞' : '0'}</p>
                            <p className="text-sm text-muted-foreground">Total Orders</p>
                        </div>
                        <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg">
                            <p className="text-3xl font-bold text-primary">
                                {new Date(profile.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground">Join Date</p>
                        </div>
                        <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg">
                            <p className="text-3xl font-bold text-primary capitalize">{profile.role}</p>
                            <p className="text-sm text-muted-foreground">Account Type</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
