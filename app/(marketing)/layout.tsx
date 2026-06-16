import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grain min-h-screen bg-ivory-100">
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
