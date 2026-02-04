"use client";

import { motion } from 'framer-motion';
import { Bell, Lock, Eye, Moon, Sun, Monitor, Shield, Save, User, Zap, MessageSquare, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-12">
                <h1 className="text-4xl font-serif font-bold mb-2">Account <span className="gold-text">Settings</span></h1>
                <p className="text-muted-foreground text-lg">Manage your profile, security, and preferences.</p>
            </div>

            <Tabs defaultValue="general" className="space-y-8">
                <TabsList className="bg-card/50 border border-border/50 p-1 rounded-2xl">
                    <TabsTrigger value="general" className="rounded-xl gap-2 px-6">
                        <User className="w-4 h-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-xl gap-2 px-6">
                        <Bell className="w-4 h-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-xl gap-2 px-6">
                        <Lock className="w-4 h-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="rounded-xl gap-2 px-6">
                        <Eye className="w-4 h-4" />
                        Appearance
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-8 rounded-3xl border border-border/50 space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Display Name</label>
                                <Input defaultValue="John Champion" className="bg-background/50 border-border/50 h-12" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                                <Input defaultValue="john@example.com" className="bg-background/50 border-border/50 h-12" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Bio</label>
                                <textarea
                                    className="w-full bg-background/50 border border-border/50 rounded-xl p-4 min-h-[120px] text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                                    defaultValue="Passionate sports and music historian. I've been following the GOAT debates for over a decade."
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gold-glow px-8">
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </motion.div>
                </TabsContent>

                <TabsContent value="notifications">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-8 rounded-3xl border border-border/50 space-y-6"
                    >
                        {[
                            { title: 'New Debate Alerts', desc: 'Get notified when a new debate starts in your favorite categories.', icon: Bell },
                            { title: 'Vote Milestones', desc: 'Receive updates when a GOAT you voted for reaches a new rank.', icon: Zap },
                            { title: 'Community Replies', desc: 'Notifications when someone replies to your arguments.', icon: MessageSquare },
                            { title: 'Pro Member Updates', desc: 'Exclusive insights and early access to new features.', icon: Crown },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                        <item.icon className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{item.title}</div>
                                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                                    </div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        ))}
                    </motion.div>
                </TabsContent>

                <TabsContent value="security">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-8 rounded-3xl border border-border/50 space-y-8"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">Two-Factor Authentication</div>
                                        <div className="text-xs text-muted-foreground">Add an extra layer of security to your account.</div>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="border-accent/50 text-accent">Enable</Button>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h4 className="text-sm font-bold uppercase tracking-widest">Change Password</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <Input type="password" placeholder="Current Password" className="bg-background/50 border-border/50 h-12" />
                                    <Input type="password" placeholder="New Password" className="bg-background/50 border-border/50 h-12" />
                                    <Input type="password" placeholder="Confirm New Password" className="bg-background/50 border-border/50 h-12" />
                                </div>
                                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Update Password</Button>
                            </div>
                        </div>
                    </motion.div>
                </TabsContent>

                <TabsContent value="appearance">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-8 rounded-3xl border border-border/50"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: 'Light', icon: Sun, id: 'light' },
                                { label: 'Dark', icon: Moon, id: 'dark' },
                                { label: 'System', icon: Monitor, id: 'system' },
                            ].map((theme) => (
                                <button
                                    key={theme.id}
                                    className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-secondary/30 border-2 border-transparent hover:border-accent/30 transition-all focus:border-accent"
                                >
                                    <theme.icon className="w-8 h-8 text-accent" />
                                    <span className="font-bold text-sm">{theme.label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
