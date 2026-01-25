"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Loader2, Upload, Pencil, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

interface Service {
    _id: string;
    title: string;
    description: string;
    image: string;
    price?: number;
}

export default function AdminServicesPage() {
    const { t } = useLanguage();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [keepExistingImage, setKeepExistingImage] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    async function fetchServices() {
        try {
            const res = await fetch("/api/services");
            if (res.ok) {
                const data = await res.json();
                setServices(data);
            }
        } catch (error) {
            console.error("Failed to fetch services");
        } finally {
            setLoading(false);
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setKeepExistingImage(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    function openEditDialog(service: Service) {
        setEditingService(service);
        setTitle(service.title);
        setDescription(service.description);
        setPrice(service.price?.toString() || "");
        setImagePreview(service.image);
        setKeepExistingImage(true);
        setImageFile(null);
        setIsDialogOpen(true);
    }

    function resetForm() {
        setEditingService(null);
        setTitle("");
        setDescription("");
        setPrice("");
        setImageFile(null);
        setImagePreview("");
        setKeepExistingImage(false);
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // If editing and no new file, keep existing image
        if (editingService && !imageFile && !keepExistingImage) {
            toast.error("Please select an image");
            return;
        }

        // If creating new, must have file
        if (!editingService && !imageFile) {
            toast.error("Please select an image");
            return;
        }

        setIsLoadingSubmit(true);
        let imageUrl = editingService?.image || "";

        try {
            // Upload new image if file selected
            if (imageFile) {
                setUploading(true);
                const formData = new FormData();
                formData.append('file', imageFile);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadRes.ok) {
                    const error = await uploadRes.json();
                    toast.error(error.message || "Failed to upload image");
                    setIsLoadingSubmit(false);
                    setUploading(false);
                    return;
                }

                const { url } = await uploadRes.json();
                imageUrl = url;
                setUploading(false);
            }

            const serviceData = {
                title,
                description,
                image: imageUrl,
                price: price ? parseFloat(price) : undefined,
            };

            // Update or Create
            if (editingService) {
                const res = await fetch("/api/services", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...serviceData, _id: editingService._id }),
                });

                if (!res.ok) throw new Error("Failed to update service");
                toast.success("Service updated successfully");
            } else {
                const res = await fetch("/api/services", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(serviceData),
                });

                if (!res.ok) throw new Error("Failed to create service");
                toast.success("Service created successfully");
            }

            setIsDialogOpen(false);
            fetchServices();
            resetForm();
        } catch (error) {
            toast.error(editingService ? "Error updating service" : "Error creating service");
        } finally {
            setIsLoadingSubmit(false);
            setUploading(false);
        }
    }

    async function deleteService(id: string) {
        if (!confirm("Are you sure you want to delete this service?")) return;

        try {
            const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success("Service deleted");
                fetchServices();
            } else {
                toast.error("Failed to delete");
            }
        } catch (e) {
            toast.error("Error deleting service");
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">{t('admin.servicesManagement')}</h1>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> {t('admin.addService')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={onSubmit}>
                            <DialogHeader>
                                <DialogTitle>{editingService ? t('admin.editService') : t('admin.addService')}</DialogTitle>
                                <DialogDescription>
                                    {editingService ? "Update service details." : "Create a new service offering for the website."}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">{t('admin.serviceTitle')}</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">{t('admin.serviceDesc')}</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="price">{t('admin.price')} (Optional)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="image">{t('admin.selectImage')} {editingService && "(Leave empty to keep current)"}</Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required={!editingService}
                                    />
                                    {imagePreview && (
                                        <div className="mt-2 relative w-full h-40 border rounded overflow-hidden">
                                            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isLoadingSubmit}>
                                    {uploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : isLoadingSubmit ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            {editingService ? "Update Service" : "Save Service"}
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="bg-transparent border-none shadow-none">
                <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl">{t('admin.servicesManagement')}</CardTitle>
                    <CardDescription>
                        {t('admin.servicesAdminDesc')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : services.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/10">
                            <div className="p-4 bg-muted rounded-full mb-4">
                                <Plus className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">No services yet</h3>
                            <p className="text-muted-foreground text-sm text-center max-w-sm mt-2">
                                Get started by adding your first service offering to the platform.
                            </p>
                            <Button className="mt-6" onClick={() => {
                                resetForm();
                                setIsDialogOpen(true);
                            }}>
                                <Plus className="mr-2 h-4 w-4" /> {t('admin.addService')}
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {services.map((service) => (
                                <div
                                    key={service._id}
                                    className="group relative bg-card hover:bg-muted/30 border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col"
                                >
                                    {/* Image Area */}
                                    <div className="aspect-[16/10] relative overflow-hidden bg-muted">
                                        {service.image ? (
                                            <Image
                                                src={service.image}
                                                alt={service.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <ImageIcon className="h-10 w-10 opacity-20" />
                                            </div>
                                        )}
                                        {/* Price Badge */}
                                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                                            {service.price ? `$${service.price}` : 'Custom'}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="font-semibold text-lg leading-tight line-clamp-1" title={service.title}>
                                                {service.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                            {service.description}
                                        </p>

                                        {/* Actions Footer */}
                                        <div className="flex items-center justify-between pt-3 mt-auto border-t border-border/50">
                                            <div className="text-xs text-muted-foreground font-medium">
                                                ID: <span className="font-mono opacity-70">{service._id.slice(-4)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                                                    onClick={() => openEditDialog(service)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                    onClick={() => deleteService(service._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </div>
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

