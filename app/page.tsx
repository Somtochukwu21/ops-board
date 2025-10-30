"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ProductForm } from "@/components/product-form";
import { ProductList } from "@/components/product-list";
import { StatsBar } from "@/components/stats-bar";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";
import { LogOut, Moon, Sun } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
	const router = useRouter();
	const [isDark, setIsDark] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [user, setUser] = useState<any>(null);
	const { products } = useProducts();

	// ✅ Load theme and auth state once
	useEffect(() => {
		const initialize = async () => {
			setMounted(true);

			// Theme
			const savedTheme = localStorage.getItem("theme");
			const isDarkMode = savedTheme === "dark";
			setIsDark(isDarkMode);
			document.documentElement.classList.toggle("dark", isDarkMode);

			// Auth check (only once)
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				router.replace("/auth/login");
				return;
			}

			setUser(user);
		};

		initialize();

		// ✅ Subscribe to auth state changes (for logout or token refresh)
		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				if (!session?.user) {
					router.replace("/auth/login");
				} else {
					setUser(session.user);
				}
			}
		);

		return () => {
			listener.subscription.unsubscribe();
		};
	}, [router]);

	const toggleTheme = () => {
		const newIsDark = !isDark;
		setIsDark(newIsDark);
		localStorage.setItem("theme", newIsDark ? "dark" : "light");
		document.documentElement.classList.toggle("dark", newIsDark);
	};

	const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout successful!");
		router.replace("/auth/login");
	};

	if (!mounted) return null;
	if (!user)
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-muted-foreground">Checking authentication...</p>
			</div>
		);

	return (
		<main className="min-h-screen bg-background text-foreground transition-colors duration-200">
			{/* Header */}
			<header className="border-b border-border bg-card">
				<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								Product Tracker
							</h1>
							<p className="mt-1 text-sm text-muted-foreground">
								Welcome, {user.email}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<button
								onClick={toggleTheme}
								className="rounded-lg border border-border bg-card p-2 hover:bg-muted transition-colors"
								aria-label="Toggle theme">
								{isDark ? (
									<Sun className="h-5 w-5" />
								) : (
									<Moon className="h-5 w-5" />
								)}
							</button>
							<Button
								onClick={handleLogout}
								variant="outline"
								size="sm"
								className="flex items-center gap-2 bg-transparent">
								<LogOut className="h-4 w-4" />
								Logout
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Content */}
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<StatsBar products={products} />

				<div className="mt-8 grid gap-8 lg:grid-cols-3">
					<div className="lg:col-span-1">
						<ProductForm />
					</div>

					<div className="lg:col-span-2">
						<ProductList />
					</div>
				</div>
			</div>
		</main>
	);
}
