import { NavLink } from "react-router-dom"
import { useUIStore } from "@store/uiStore"

export default function Sidebar() {
    const { sidebarOpen, closeSidebar } = useUIStore()

    return (
        <>
            {/* Overlay móvil */}
            {sidebarOpen && (
                <div
                    onClick={closeSidebar}
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                />
            )}

            <aside
                className={`
          fixed z-50 top-0 left-0 h-full w-64 bg-white shadow-md p-4
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:block
        `}
            >
                <h1 className="text-xl font-bold mb-6">MyApp</h1>

                <nav className="flex flex-col gap-2">
                    <NavLink to="/" onClick={closeSidebar}>Dashboard</NavLink>
                    <NavLink to="/users" onClick={closeSidebar}>Usuarios</NavLink>
                </nav>
            </aside>
        </>
    )
}
