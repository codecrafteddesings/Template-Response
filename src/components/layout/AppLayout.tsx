import { Outlet } from "react-router-dom"
import Sidebar from "@layout/Sidebar"
import Navbar from "@layout/Navbar"

export default function AppLayout() {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            <div className="flex flex-col flex-1">
                <Navbar />

                <main className="p-4 md:p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
