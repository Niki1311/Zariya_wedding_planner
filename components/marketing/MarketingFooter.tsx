import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { CornerMotif } from "@/components/ui/Motifs";

export function MarketingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-gold-100 bg-ivory-200/60">
      <CornerMotif className="absolute -bottom-10 right-0 h-56 w-56 opacity-30" flip />
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo size="sm" showTagline />
          <p className="mt-3 max-w-xs text-sm text-ink-muted">
            A calmer, more connected way to plan Indian destination weddings.
          </p>
        </div>
        <FooterCol
          title="Product"
          links={[
            { href: "/features", label: "Features" },
            { href: "/pricing", label: "Pricing" },
            { href: "/early-access", label: "Early access" },
            { href: "/signup", label: "Get started" },
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            { href: "/#how", label: "How it works" },
            { href: "/contact", label: "Contact" },
            { href: "/#story", label: "Our story" },
          ]}
        />
        <FooterCol
          title="Support"
          links={[
            { href: "/contact", label: "Help centre" },
            { href: "/contact", label: "Email us" },
            { href: "/signin", label: "Sign in" },
          ]}
        />
      </div>
      <div className="border-t border-gold-100/70 px-5 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-ink-muted md:flex-row">
          <p>© {new Date().getFullYear()} Zariya. Made with love for couples.</p>
          <p>Privacy · Terms · Cookies</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-700">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm text-ink-muted transition hover:text-gold-700">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
