import Navbar from "@layout/Navbar";
import Sidebar from "@layout/Sidebar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-black">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar />

        <main className="p-4 md:p-6 overflow-y-auto bg-gray-100 dark:bg-black">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
