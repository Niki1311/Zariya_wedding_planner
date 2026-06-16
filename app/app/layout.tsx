import { redirect } from "next/navigation";
import { currentUserId } from "@/lib/auth";
import { getWeddingForUser } from "@/lib/wedding-service";
import { WorkspaceProvider } from "@/components/workspace/WorkspaceProvider";
import { Sidebar, MobileNav } from "@/components/workspace/Sidebar";
import { WeddingHeader } from "@/components/workspace/WeddingHeader";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userId = await currentUserId();
  if (!userId) redirect("/signin");
  const wedding = await getWeddingForUser(userId);
  if (!wedding) redirect("/signin");
  if (!wedding.onboardingDone) redirect("/onboarding");

  return (
    <WorkspaceProvider initial={wedding}>
      <div className="grain flex min-h-screen bg-ivory-100">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <WeddingHeader />
          <main className="flex-1 px-4 pb-24 pt-5 md:px-6 lg:pb-8">{children}</main>
          <MobileNav />
        </div>
      </div>
    </WorkspaceProvider>
  );
}
