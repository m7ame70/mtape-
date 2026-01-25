"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Testimonial {
    _id: string;
    name: string;
    position: string;
    company?: string;
    content: string;
    rating: number;
    image?: string;
}

export default function TestimonialsPage() {
    const { t } = useLanguage();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        company: '',
        content: '',
        rating: 5,
        image: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch('/api/testimonials');
            const data = await res.json();
            setTestimonials(data);
        } catch (error) {
            toast.error('Failed to fetch testimonials');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const url = '/api/testimonials';
            const method = editingTestimonial ? 'PUT' : 'POST';
            const body = editingTestimonial
                ? { ...formData, _id: editingTestimonial._id }
                : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                toast.success(editingTestimonial ? 'Testimonial updated!' : 'Testimonial added!');
                setDialogOpen(false);
                resetForm();
                fetchTestimonials();
            } else {
                toast.error('Failed to save testimonial');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        setFormData({
            name: testimonial.name,
            position: testimonial.position,
            company: testimonial.company || '',
            content: testimonial.content,
            rating: testimonial.rating,
            image: testimonial.image || '',
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            const res = await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Testimonial deleted!');
                fetchTestimonials();
            } else {
                toast.error('Failed to delete testimonial');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            position: '',
            company: '',
            content: '',
            rating: 5,
            image: '',
        });
        setEditingTestimonial(null);
    };

    const handleDialogClose = (open: boolean) => {
        setDialogOpen(open);
        if (!open) {
            resetForm();
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('admin.testimonialsManagement')}</h1>
                    <p className="text-muted-foreground">{t('admin.testimonialsAdminDesc')}</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('admin.addTestimonial')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingTestimonial ? t('admin.edit') : t('admin.add')} {t('admin.testimonialsManagement')}</DialogTitle>
                            <DialogDescription>
                                {editingTestimonial ? "Update testimonial details." : "Add a new customer testimonial."}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('admin.clientName')} *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="position">{t('admin.role')} *</Label>
                                    <Input
                                        id="position"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        placeholder="e.g., CEO, Marketing Manager"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="company">{t('admin.role')} 2</Label>
                                    <Input
                                        id="company"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        placeholder="Optional"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="content">{t('admin.review')} *</Label>
                                    <Textarea
                                        id="content"
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        rows={4}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="rating">{t('admin.rating')} *</Label>
                                    <Input
                                        id="rating"
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="image">{t('admin.selectImage')}</Label>
                                    <Input
                                        id="image"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="https://example.com/image.jpg (Optional)"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingTestimonial ? 'Update' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.length === 0 ? (
                    <Card className="col-span-full">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="text-muted-foreground">No testimonials yet. Add your first one!</p>
                        </CardContent>
                    </Card>
                ) : (
                    testimonials.map((testimonial) => (
                        <Card key={testimonial._id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        {testimonial.image ? (
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-lg font-semibold text-primary">
                                                    {testimonial.name.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <CardTitle className="text-base">{testimonial.name}</CardTitle>
                                            <CardDescription className="text-xs">
                                                {testimonial.position}
                                                {testimonial.company && ` at ${testimonial.company}`}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(testimonial)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(testimonial._id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-0.5 mb-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < testimonial.rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    "{testimonial.content}"
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
