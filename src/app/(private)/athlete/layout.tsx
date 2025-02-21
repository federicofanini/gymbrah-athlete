import { redirect } from "next/navigation";
import { Metadata } from "next";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/private/b2c/header";
import { Sidebar } from "@/components/private/b2c/sidebar";
import { Tester } from "@/components/private/tester/tester";
import { TesterEnd } from "@/components/private/tester/tester-end";
import { getTesters, getTesterCounts } from "@/actions/tester";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Athlete",
  description: "Athlete Dashboard",
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }

  const testersResponse = await getTesters();
  const testers =
    testersResponse.success && testersResponse.data
      ? testersResponse.data.filter((tester: any) => tester.role === "athlete")
      : [];
  const testerEmails = testers.map((tester: any) => tester.email);

  // Check available tester spots
  const countsResponse = await getTesterCounts();
  const hasAvailableSpots =
    countsResponse.success && countsResponse.data?.athlete?.spotsLeft > 0;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />

        <SidebarInset className="flex-1 bg-noise pb-8">
          <Header />

          <main className="pt-4">
            {children}

            {data?.user?.email &&
              !testerEmails.includes(data.user.email) &&
              (hasAvailableSpots ? <Tester /> : <TesterEnd />)}
            <Toaster />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
