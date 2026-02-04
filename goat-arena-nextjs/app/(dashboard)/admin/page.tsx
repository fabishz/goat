import { Shield, Users, Layers, BarChart3, Plus, Search, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { GoatManager } from '@/components/admin/GoatManager';

export default function AdminDashboardPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-2">
                        <Shield className="w-4 h-4" />
                        System Administration
                    </div>
                    <h1 className="text-4xl font-serif font-bold mb-2">Admin <span className="gold-text">Panel</span></h1>
                    <p className="text-muted-foreground text-lg">Manage goats, categories, and system data.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Total Users', value: '1,250', icon: Users, color: 'text-blue-500' },
                    { label: 'Fan Votes', value: '8,420', icon: BarChart3, color: 'text-green-500' },
                    { label: 'Active GOATs', value: '42', icon: Crown, color: 'text-accent' },
                    { label: 'Categories', value: '8', icon: Layers, color: 'text-purple-500' },
                ].map((stat, i) => (
                    <div key={i} className="glass p-6 rounded-2xl border border-border/50">
                        <div className="flex items-center justify-between mb-4">
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live</span>
                        </div>
                        <div className="text-3xl font-serif font-bold mb-1">{stat.value}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{stat.label}</div>
                    </div>
                ))}
            </div>

            <Tabs defaultValue="categories" className="space-y-8">
                <TabsList className="bg-card/30 border border-border/50 p-1 rounded-xl glass h-12">
                    <TabsTrigger value="categories" className="px-8 rounded-lg data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all">
                        <Layers className="w-4 h-4 mr-2" />
                        Categories
                    </TabsTrigger>
                    <TabsTrigger value="goats" className="px-8 rounded-lg data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all">
                        <Crown className="w-4 h-4 mr-2" />
                        GOATs
                    </TabsTrigger>
                    <TabsTrigger value="users" className="px-8 rounded-lg data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all">
                        <Users className="w-4 h-4 mr-2" />
                        Users
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="mt-0 focus-visible:outline-none">
                    <div className="glass p-8 rounded-3xl border border-border/50">
                        <CategoryManager />
                    </div>
                </TabsContent>

                <TabsContent value="goats" className="mt-0 focus-visible:outline-none">
                    <div className="glass p-8 rounded-3xl border border-border/50">
                        <GoatManager />
                    </div>
                </TabsContent>

                <TabsContent value="users" className="mt-0 focus-visible:outline-none">
                    <div className="glass p-8 rounded-3xl border border-border/50 text-center py-20">
                        <p className="text-muted-foreground">User management coming soon.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
