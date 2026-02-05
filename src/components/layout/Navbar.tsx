import { useUIStore } from "@store/uiStore"

export default function Navbar() {
    const toggleSidebar = useUIStore((s) => s.toggleSidebar)

    return (
        <header className="h-14 bg-white shadow px-4 flex items-center justify-between">
            <button
                onClick={toggleSidebar}
                className="md:hidden text-xl"
            >
                ☰
            </button>

            <span className="font-semibold">Panel</span>
        </header>
    )
}
