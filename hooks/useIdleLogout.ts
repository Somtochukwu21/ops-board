"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const IDLE_TIMEOUT = 10 * 60 * 2000;

export default function useIdleLogout() {
	const router = useRouter();
	const logoutTimer = useRef<NodeJS.Timeout | null>(null);

	const resetTimer = () => {
		if (logoutTimer.current) clearTimeout(logoutTimer.current);
		logoutTimer.current = setTimeout(async () => {
			await supabase.auth.signOut();
			router.push("/auth/login");
		}, IDLE_TIMEOUT);
	};

	useEffect(() => {
		// Listen for user activity
		const events = ["click", "mousemove", "keypress", "scroll", "touchstart"];
		events.forEach((event) => window.addEventListener(event, resetTimer));

		// Supabase session expiration listener
		const { data: listener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				if (event === "SIGNED_OUT" || !session) {
					router.push("/auth/login");
				}
			}
		);

		resetTimer();

		return () => {
			events.forEach((event) => window.removeEventListener(event, resetTimer));
			if (logoutTimer.current) clearTimeout(logoutTimer.current);
			listener?.subscription.unsubscribe();
		};
	}, []);
}
