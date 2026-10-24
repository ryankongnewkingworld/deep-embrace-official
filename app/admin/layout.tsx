import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "业务预约管理 · 深拥智能",
  robots: { index: false, follow: false },
};
export default function AdminLayout({ children }: { children: React.ReactNode }) { return children; }
