import { Layout } from "@/components/layout/Layout";

export default function WebsiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Layout>{children}</Layout>;
}
