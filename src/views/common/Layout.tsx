import { Outlet } from "react-router-dom"

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--color-fountain-blue-50)] dark:bg-[var(--color-fountain-blue-900)]">
            {/* Navbar */}
            {children}
            
            {/* Main content */}
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}