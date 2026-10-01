export function shortAddress(value?: string) {
  if (!value) return "—";

  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function pactStatusLabel(status?: number) {
  if (status === 0) return "Active";
  if (status === 1) return "Completed";
  if (status === 2) return "Cancelled";

  return "Unknown";
}

export function milestoneStatusLabel(status?: number) {
  if (status === 0) return "Pending";
  if (status === 1) return "Submitted";
  if (status === 2) return "Revision Requested";
  if (status === 3) return "Approved";

  return "Unknown";
}

export function pactStatusClass(status?: number) {
  if (status === 1) {
    return "border-[#43d17b]/20 bg-[#43d17b]/10 text-[#43d17b]";
  }

  if (status === 2) {
    return "border-[#ff5c5c]/20 bg-[#ff5c5c]/10 text-[#ff7c7c]";
  }

  return "border-[#c7ff1a]/20 bg-[#c7ff1a]/10 text-[#c7ff1a]";
}

export function milestoneStatusClass(status?: number) {
  if (status === 1) {
    return "border-blue-400/20 bg-blue-400/10 text-blue-300";
  }

  if (status === 2) {
    return "border-[#ffb547]/20 bg-[#ffb547]/10 text-[#ffb547]";
  }

  if (status === 3) {
    return "border-[#43d17b]/20 bg-[#43d17b]/10 text-[#43d17b]";
  }

  return "border-[#636b74]/20 bg-[#636b74]/10 text-[#8e969f]";
}

export const ARBISCAN_BASE_URL = "https://sepolia.arbiscan.io";
