import Navbar from "@layout/Navbar";
import Sidebar from "@layout/Sidebar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-bg">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />

        <main className="flex-1 p-5 md:p-6 overflow-y-auto bg-bg animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
