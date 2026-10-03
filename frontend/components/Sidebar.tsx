"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard",
  },
  {
    label: "Create Pact",
    href: "/create",
  },
  {
    label: "My Pacts",
    href: "/pacts",
  },
  {
    label: "Activity",
    href: "/activity",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-[240px] flex-col border-r border-[#24282d] bg-[#0b0d0f] px-5 py-6">
      <Link
        href="/"
        className="flex items-center gap-3"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c7ff1a] font-bold text-black">
          P
        </div>

        <div>
          <p className="font-semibold text-white">
            Pactra
          </p>

          <p className="text-xs text-[#636b74]">
            Escrow Protocol
          </p>
        </div>
      </Link>

      <nav className="mt-10 space-y-1">
        {navigation.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${active
                  ? "bg-[#161a1f] text-white"
                  : "text-[#8e969f] hover:bg-[#111418] hover:text-white"
                }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${active
                    ? "bg-[#c7ff1a]"
                    : "bg-[#3a4047]"
                  }`}
              />

              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[#24282d] pt-5">
        <div className="rounded-xl border border-[#24282d] bg-[#111418] p-4">
          <p className="text-xs font-medium text-white">
            Arbitrum Sepolia
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#43d17b]" />

            <p className="text-xs text-[#636b74]">
              Testnet connected
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}