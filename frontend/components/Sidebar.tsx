"use client";

const navigation = [
  {
    name: "Overview",
    active: true,
  },
  {
    name: "Create Pact",
    active: false,
  },
  {
    name: "My Pacts",
    active: false,
  },
  {
    name: "Activity",
    active: false,
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 flex h-screen w-[240px] flex-col border-r border-[#24282d] bg-[#0b0d0f] px-5 py-6">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c7ff1a] text-sm font-bold text-black">
          P
        </div>

        <div>
          <p className="text-[17px] font-semibold tracking-tight text-white">
            Pactra
          </p>
          <p className="text-xs text-[#636b74]">Escrow Protocol</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navigation.map((item) => (
          <button
            key={item.name}
            className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition ${
              item.active
                ? "bg-[#161a1f] font-medium text-white"
                : "text-[#8e969f] hover:bg-[#111418] hover:text-white"
            }`}
          >
            <span
              className={`mr-3 h-1.5 w-1.5 rounded-full ${
                item.active ? "bg-[#c7ff1a]" : "bg-[#3b4148]"
              }`}
            />

            {item.name}
          </button>
        ))}
      </nav>

      <div className="mt-auto border-t border-[#24282d] pt-5">
        <div className="rounded-xl border border-[#24282d] bg-[#111418] p-4">
          <p className="text-xs font-medium text-white">
            Arbitrum Sepolia
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#43d17b]" />
            <span className="text-xs text-[#8e969f]">
              Testnet connected
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}