import { useThemeStore } from "@store/themeStore"

export default function ThemeToggle() {
    const toggle = useThemeStore((s) => s.toggle)

    return (
        <button onClick={toggle} className="px-3 py-1 bg-gray-200 rounded">
            Cambiar tema
        </button>
    )
}
