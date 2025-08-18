import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Users, Target, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Oportunidades", href: "/opportunities", icon: Target },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">
                Mini Seller Console
              </h1>
              <Badge variant="secondary">v1.0</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Bem-vindo, Vendedor!</span>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  User
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 py-6">
          <aside className="w-64 flex-shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Button
                        key={item.name}
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start font-medium ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        asChild
                      >
                        <Link to={item.href}>
                          <item.icon className="mr-3 h-4 w-4" />
                          {item.name}
                        </Link>
                      </Button>
                    );
                  })}
                </nav>
                <Separator className="my-4" />
                <div className="text-xs text-muted-foreground">
                  <p>Console de Vendas</p>
                  <p>Gerencie seus leads e oportunidades</p>
                </div>
              </CardContent>
            </Card>
          </aside>

          <main className="flex-1 min-w-0 space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
