import Link from "next/link";
import { BallIcon } from "./icons";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 md:flex-row md:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center gap-2">
            <BallIcon className="h-5 w-5 text-floodlight" />
            <span className="font-display text-lg tracking-wide text-chalk">SPORTHUB</span>
          </div>
          <p className="mt-3 text-[14px] text-slate">
            Courts, gear, and pickup games — mapped, tagged, and open to whoever adds them next.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <FooterColumn
            title="Explore"
            links={[
              { href: "/events", label: "Events" },
              { href: "/gear", label: "Gear" },
              { href: "/categories", label: "Categories" },
            ]}
          />
          <FooterColumn
            title="You"
            links={[
              { href: "/favorites", label: "Favorites" },
              { href: "/submit", label: "Add yours" },
              { href: "/search", label: "Search" },
            ]}
          />
        </div>
      </div>
      <div className="border-t border-line px-4 py-5 text-center text-[13px] text-slate sm:px-6">
        Listings are added by the community and pulled live from the Sport API.
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="font-display text-[15px] tracking-wide text-chalk">{title}</h4>
      <ul className="mt-3 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-[14px] text-slate hover:text-chalk">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
