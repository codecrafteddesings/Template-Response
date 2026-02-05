import { ReactNode, useEffect } from "react"
import { useAuthStore } from "@features/auth/store"

export default function Providers({ children }: { children: ReactNode }) {
    const setUser = useAuthStore((s) => s.setUser)

    useEffect(() => {
        const saved = localStorage.getItem("user")
        if (saved) setUser(JSON.parse(saved))
    }, [])

    return <>{children}</>
}
