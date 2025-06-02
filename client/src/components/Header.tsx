import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [location] = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "fa-chart-line" },
    { path: "/bonds", label: "Bond Tracker", icon: "fa-search" },
    { path: "/isds", label: "School Districts", icon: "fa-school" },
    { path: "/cities", label: "Cities & Counties", icon: "fa-city" },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <i className="fas fa-chart-line text-2xl text-primary"></i>
              <h1 className="text-xl font-bold text-foreground">Texas Bond Explorer</h1>
            </Link>
            <nav className="hidden md:flex space-x-6 ml-8">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path} className={`flex items-center space-x-2 pb-4 transition-colors ${
                  location === item.path || (location === "/" && item.path === "/dashboard")
                    ? "text-primary font-medium border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}>
                  <i className={`fas ${item.icon} text-sm`}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <i className="fas fa-bell"></i>
            </Button>
            <Button variant="ghost" size="sm">
              <i className="fas fa-user-circle text-xl"></i>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
