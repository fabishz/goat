"use client";

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, Crown, Image as ImageIcon } from 'lucide-react';

interface Category {
    id: string;
    name: string;
}

interface SubCategory {
    id: string;
    name: string;
    category_id: string;
}

interface Entity {
    id: string;
    name: string;
    description?: string;
    slug: string;
    image_url: string;
    category_id: string;
    subcategory_id: string;
}

export function GoatManager() {
    const [entities, setEntities] = useState<Entity[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [subcategoryId, setSubCategoryId] = useState('');

    const fetchData = async () => {
        try {
            const [entRes, catRes, subRes] = await Promise.all([
                api.get('/entities/'),
                api.get('/categories/'),
                api.get('/subcategories/')
            ]);
            setEntities(entRes.data);
            setCategories(catRes.data);
            setSubCategories(subRes.data);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateGoat = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/entities/', {
                name,
                slug,
                description,
                image_url: imageUrl,
                category_id: categoryId,
                subcategory_id: subcategoryId
            });
            toast.success('GOAT created successfully');
            setIsDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error) {
            toast.error('Failed to create GOAT');
        }
    };

    const resetForm = () => {
        setName('');
        setSlug('');
        setDescription('');
        setImageUrl('');
        setCategoryId('');
        setSubCategoryId('');
    };

    const handleDeleteGoat = async (id: string) => {
        if (!confirm('Are you sure you want to delete this GOAT?')) return;
        try {
            await api.delete(`/entities/${id}`);
            toast.success('GOAT deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete GOAT');
        }
    };

    const filteredSubcategories = subcategories.filter(s => s.category_id === categoryId);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif font-bold flex items-center gap-2">
                    <Crown className="w-5 h-5 text-accent" />
                    GOAT Management
                </h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                            <Plus className="w-4 h-4 mr-2" />
                            Add New GOAT
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="glass border-border/50 max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New GOAT</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateGoat} className="grid grid-cols-2 gap-4 pt-4">
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <label className="text-xs font-bold uppercase tracking-wider">Name</label>
                                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Michael Jordan" required />
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <label className="text-xs font-bold uppercase tracking-wider">Slug</label>
                                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. michael-jordan" required />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-xs font-bold uppercase tracking-wider">Image URL</label>
                                <div className="flex gap-2">
                                    <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." required />
                                    {imageUrl && (
                                        <div className="w-10 h-10 rounded border border-border/50 overflow-hidden shrink-0">
                                            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <label className="text-xs font-bold uppercase tracking-wider">Category</label>
                                <Select value={categoryId} onValueChange={setCategoryId} required>
                                    <SelectTrigger className="bg-background/55 border-border/50">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent className="glass border-border/50">
                                        {categories.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <label className="text-xs font-bold uppercase tracking-wider">SubCategory</label>
                                <Select value={subcategoryId} onValueChange={setSubCategoryId} required disabled={!categoryId}>
                                    <SelectTrigger className="bg-background/55 border-border/50">
                                        <SelectValue placeholder="Select SubCategory" />
                                    </SelectTrigger>
                                    <SelectContent className="glass border-border/50">
                                        {filteredSubcategories.map(s => (
                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-xs font-bold uppercase tracking-wider">Description</label>
                                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description..." />
                            </div>
                            <Button type="submit" className="w-full bg-accent text-accent-foreground mt-4 col-span-2">Add GOAT</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="glass rounded-2xl border border-border/50 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border/50 hover:bg-transparent">
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entities.map((goat) => {
                            const category = categories.find(c => c.id === goat.category_id);
                            return (
                                <TableRow key={goat.id} className="border-border/50 hover:bg-accent/5">
                                    <TableCell>
                                        <div className="w-10 h-10 rounded-lg border border-border/50 overflow-hidden bg-secondary">
                                            {goat.image_url ? (
                                                <img src={goat.image_url} alt={goat.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-bold">{goat.name}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{category?.name || 'Unknown'}</TableCell>
                                    <TableCell className="text-sm font-mono">{goat.slug}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDeleteGoat(goat.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {entities.length === 0 && !isLoading && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No GOATs found. Add your first one above.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
