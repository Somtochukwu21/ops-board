"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import Link from "next/link";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL}/auth/reset`,
			});
			if (error) throw error;

			toast.success("Password reset email sent. Check your inbox.");
			setEmail("");
		} catch (error: unknown) {
			setError(error instanceof Error ? error.message : "Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Reset Password</CardTitle>
						<CardDescription>
							Enter your email below to receive a reset link.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleResetPassword}
							className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									autoComplete="email"
								/>
							</div>

							{error && <p className="text-sm text-destructive">{error}</p>}

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Sending..." : "Send reset link"}
							</Button>

							<div className="mt-4 text-center text-sm">
								Remember your password?{" "}
								<Link
									href="/auth/login"
									className="underline underline-offset-4">
									Back to login
								</Link>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
