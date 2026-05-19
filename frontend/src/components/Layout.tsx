import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Sun, Moon, LayoutDashboard } from 'lucide-react';
import { Button } from './ui/Button';

export const Layout = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-6 border-b flex items-center space-x-2 text-primary">
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-xl font-bold">ServiceHive</span>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link to="/" className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground text-sm font-medium">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-muted-foreground text-xs">{user?.role}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold">Leads Management</h2>
          <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
