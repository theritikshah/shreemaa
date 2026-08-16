import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/smg-logo.png";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white pt-20 pb-10 mt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-3">
              <Image src={logo} alt="SMG" className="h-11 w-11 rounded-full" />
              <div>
                <div className="font-display font-bold text-lg">Shri Maa Group</div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Est. 1997</div>
              </div>
            </Link>
            <p className="mt-6 text-white/70 text-sm max-w-md leading-relaxed">
              The launchpad for global brands. One of the most trusted commerce, distribution and trade networks, built over nearly three decades.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-wider text-white/50 mb-4">Businesses</div>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/businesses/marketplace-operations" className="text-white/80 hover:text-white">Marketplace</Link></li>
              <li><Link href="/businesses/distribution-network" className="text-white/80 hover:text-white">Distribution</Link></li>
              <li><Link href="/businesses/commerce-trading" className="text-white/80 hover:text-white">Trading</Link></li>
              <li><Link href="/businesses/global-trade" className="text-white/80 hover:text-white">Global Trade</Link></li>
              <li><a href="https://www.oyugreen.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">Sustainability</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-wider text-white/50 mb-4">Company</div>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="text-white/80 hover:text-white">About</Link></li>
              <li><Link href="/careers" className="text-white/80 hover:text-white">Work with us</Link></li>
              <li><Link href="/jobs" className="text-white/80 hover:text-white">Open roles</Link></li>
              <li><Link href="/contact" className="text-white/80 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-wider text-white/50 mb-4">Headquarters</div>
            <p className="text-sm text-white/80 leading-relaxed">
              Shri Maa Group<br />
              Mumbai, Maharashtra<br />
              India
            </p>
            <a href="mailto:contact@shrimaa.com" className="block mt-3 text-sm text-white/80 hover:text-white">contact@shrimaa.com</a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-white/50">© {new Date().getFullYear()} Shri Maa Group. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gradient" />
            Building India&apos;s commerce infrastructure since 1997
          </div>
        </div>
      </div>
    </footer>
  );
}
