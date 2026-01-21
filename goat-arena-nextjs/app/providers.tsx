"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useState, useEffect } from "react";
import { useAppStore } from "@/stores/app-store";
import { PageLoader } from "@/components/loaders/PageLoader";
import { RouteLoader } from "@/components/loaders/RouteLoader";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    const checkAuth = useAppStore((state) => state.checkAuth);
    const isInitializing = useAppStore((state) => state.isInitializing);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isInitializing) {
        return <PageLoader />;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <RouteLoader />
                {children}
                <Toaster />
                <Sonner />
            </TooltipProvider>
        </QueryClientProvider>
    );
}
