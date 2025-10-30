"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { set } from "react-hook-form";
import { SignUpSuccessModal } from "../../../components/success-login-modal";
import { cn } from "../../../lib/utils";

export default function SignUpPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
  const [ showRepeatPassword, setShowRepeatPassword ] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		if (!name.trim()) {
			setError("Please enter your name");
			setIsLoading(false);
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters");
			setIsLoading(false);
			return;
		}

		if (password !== repeatPassword) {
			setError("Passwords do not match");
			setIsLoading(false);
			return;
		}

		try {
			const redirectTo = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL;
			if (!redirectTo) throw new Error("Redirect URL not configured");

			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: redirectTo,
					data: { name },
				},
			});

			if (error) throw error;

setShowSuccessModal(true);
		} catch (err: unknown) {
			setError(
				err instanceof Error ? err.message : "An unexpected error occurred"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
    <div className={ cn ("flex min-h-svh w-full items-center justify-center p-6 md:p-10", showSuccessModal && "hidden") }>
			<div className="w-full max-w-sm">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Sign up</CardTitle>
						<CardDescription>Create a new account</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSignUp} className="flex flex-col gap-6">
							{/* Name */}
							<div className="grid gap-2">
								<Label htmlFor="name">Full Name</Label>
								<Input
									id="name"
									type="text"
									autoComplete="name"
									placeholder="John Doe"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>

							{/* Email */}
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									autoComplete="email"
									placeholder="you@example.com"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>

							{/* Password */}
							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										autoComplete="new-password"
										required
										minLength={6}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="pr-10"
									/>
									<button
										type="button"
										onClick={() => setShowPassword((prev) => !prev)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
										aria-label={
											showPassword ? "Hide password" : "Show password"
										}>
										{showPassword ? (
											<Eye className="h-4 w-4" />
										) : (
											<EyeOff className="h-4 w-4" />
										)}
									</button>
								</div>
							</div>

							{/* Repeat Password */}
							<div className="grid gap-2">
								<Label htmlFor="repeat-password">Repeat Password</Label>
								<div className="relative">
									<Input
										id="repeat-password"
										type={showRepeatPassword ? "text" : "password"}
										autoComplete="new-password"
										required
										value={repeatPassword}
										onChange={(e) => setRepeatPassword(e.target.value)}
										className="pr-10"
									/>
									<button
										type="button"
										onClick={() => setShowRepeatPassword((prev) => !prev)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
										aria-label={
											showRepeatPassword
												? "Hide repeat password"
												: "Show repeat password"
										}>
										{showRepeatPassword ? (
											<Eye className="h-4 w-4" />
										) : (
											<EyeOff className="h-4 w-4" />
										)}
									</button>
								</div>
							</div>

							{/* Error */}
							{error && <p className="text-sm text-destructive">{error}</p>}

							{/* Submit */}
							<Button
								type="submit"
								className="w-full"
								disabled={isLoading}
								aria-disabled={isLoading}>
								{isLoading ? "Creating account..." : "Sign up"}
							</Button>

							<div className="mt-4 text-center text-sm">
								Already have an account?{" "}
								<Link
									href="/auth/login"
									className="underline underline-offset-4">
									Login
								</Link>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
 
				<SignUpSuccessModal
					open={showSuccessModal}
					onOpenChange={setShowSuccessModal}
				/>
		 
		</div>
	);
}
