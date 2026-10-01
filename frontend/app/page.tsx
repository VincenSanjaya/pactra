import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0d0f]">
      <Sidebar />

      <div className="ml-[240px] min-h-screen">
        <Topbar />
        <Dashboard />
      </div>
    </div>
  );
}