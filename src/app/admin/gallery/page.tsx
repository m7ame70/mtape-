"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

interface GalleryItem {
    _id: string;
    title: string;
    image: string;
    category: string;
}

export default function AdminGalleryPage() {
    const { t } = useLanguage();
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [category, setCategory] = useState("");

    async function fetchGallery() {
        try {
            const res = await fetch("/api/gallery");
            if (res.ok) setItems(await res.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchGallery();
    }, []);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!imageFile) {
            toast.error("Please select an image");
            return;
        }

        setSubmitting(true);
        setUploading(true);

        try {
            // Upload image first
            const formData = new FormData();
            formData.append('file', imageFile);

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadRes.ok) {
                const error = await uploadRes.json();
                toast.error(error.message || "Failed to upload image");
                setSubmitting(false);
                setUploading(false);
                return;
            }

            const { url } = await uploadRes.json();
            setUploading(false);

            // Create gallery item with uploaded image URL
            const res = await fetch("/api/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, image: url, category: category || "General" }),
            });

            if (res.ok) {
                toast.success("Image added to gallery");
                setTitle("");
                setImageFile(null);
                setImagePreview("");
                setCategory("");
                fetchGallery();
            } else {
                toast.error("Failed to add image");
            }
        } catch (error) {
            toast.error("Error adding image");
        } finally {
            setSubmitting(false);
            setUploading(false);
        }
    }

    async function deleteItem(id: string) {
        if (!confirm("Delete this image?")) return;

        try {
            const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Image deleted");
                fetchGallery();
            }
        } catch (error) {
            toast.error("Error deleting image");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('admin.galleryManagement')}</h1>
                    <p className="text-muted-foreground">{t('admin.galleryAdminDesc')}</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Add Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('admin.addImage')}</CardTitle>
                        <CardDescription>{t('admin.uploadImageDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">{t('admin.projectName')}</Label>
                                <Input
                                    id="title"
                                    placeholder={t('admin.projectName')}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">{t('admin.slideImage')}</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                />
                                {imagePreview && (
                                    <div className="mt-2 relative w-full h-40 border rounded overflow-hidden">
                                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">{t('admin.category')} (Optional)</Label>
                                <Input
                                    id="category"
                                    placeholder="e.g. Business Cards"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={submitting}>
                                {uploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t('admin.uploading')}
                                    </>
                                ) : submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t('admin.saving')}
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" />
                                        {t('admin.addToGallery')}
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Preview / List */}
                <Card className="md:col-span-1 border-none shadow-none bg-transparent">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">{t('admin.existingImages')} ({items.length})</h3>
                        {loading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                        ) : items.length === 0 ? (
                            <div className="text-center text-muted-foreground py-10 border rounded-lg bg-card">
                                {t('admin.noRecentActivity')}
                            </div>
                        ) : (
                            <div className="grid gap-4 max-h-[500px] overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <div key={item._id} className="flex gap-4 items-start p-3 border rounded-lg bg-card shadow-sm">
                                        <div className="relative w-20 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold truncate">{item.title}</h4>
                                            <p className="text-xs text-muted-foreground truncate">{item.category}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => deleteItem(item._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
