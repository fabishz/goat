"use client";

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, Layers } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    domain: string;
    slug: string;
    description?: string;
}

interface SubCategory {
    id: string;
    name: string;
    slug: string;
    category_id: string;
}

export function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [domain, setDomain] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories/');
            setCategories(res.data);
        } catch (error) {
            toast.error('Failed to fetch categories');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/categories/', { name, domain, slug, description });
            toast.success('Category created successfully');
            setIsDialogOpen(false);
            setName('');
            setDomain('');
            setSlug('');
            setDescription('');
            fetchCategories();
        } catch (error) {
            toast.error('Failed to create category');
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.delete(`/categories/${id}`);
            toast.success('Category deleted');
            fetchCategories();
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif font-bold flex items-center gap-2">
                    <Layers className="w-5 h-5 text-accent" />
                    Category Management
                </h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                            <Plus className="w-4 h-4 mr-2" />
                            New Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="glass border-border/50">
                        <DialogHeader>
                            <DialogTitle>Create New Category</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateCategory} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider">Name</label>
                                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Basketball" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider">Domain</label>
                                <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="e.g. Sports" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider">Slug</label>
                                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. basketball" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider">Description</label>
                                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description..." />
                            </div>
                            <Button type="submit" className="w-full bg-accent text-accent-foreground mt-4">Create Category</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="glass rounded-2xl border border-border/50 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border/50 hover:bg-transparent">
                            <TableHead>Name</TableHead>
                            <TableHead>Domain</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((cat) => (
                            <TableRow key={cat.id} className="border-border/50 hover:bg-accent/5">
                                <TableCell className="font-bold">{cat.name}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{cat.domain}</TableCell>
                                <TableCell className="text-sm font-mono">{cat.slug}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDeleteCategory(cat.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {categories.length === 0 && !isLoading && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No categories found. Create your first one above.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
