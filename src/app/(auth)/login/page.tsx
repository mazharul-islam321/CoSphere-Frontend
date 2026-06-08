/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { useLoginMutation } from "../../../redux/api/authApi";
import {
	setCredentials,
	selectCurrentUser,
	selectAuthLoading,
} from "../../../redux/features/authSlice";
import styles from "../auth.module.css";

export default function Login() {
	const user = useAppSelector(selectCurrentUser);
	const loading = useAppSelector(selectAuthLoading);
	const dispatch = useAppDispatch();
	const [loginTrigger, { isLoading: submitting }] = useLoginMutation();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setError(null);
		if (user) {
			router.replace("/dashboard");
		}
	}, [user, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) {
			setError("Please fill in all fields.");
			return;
		}

		setError(null);
		try {
			const data = await loginTrigger({ email, password }).unwrap();
			dispatch(setCredentials(data.user));
			router.push("/dashboard");
		} catch (err: any) {
			setError(
				err?.data?.message ||
					"Login failed. Please verify credentials.",
			);
		}
	};

	const handleDemoLogin = async (roleEmail: string) => {
		setError(null);
		try {
			const data = await loginTrigger({
				email: roleEmail,
				password: "Password123",
			}).unwrap();
			dispatch(setCredentials(data.user));
			router.push("/dashboard");
		} catch (err: any) {
			setError(err?.data?.message || "Demo login failed.");
		}
	};

	if (loading) {
		return null; // Gateway loading handles this
	}

	return (
		<div className={styles.authContainer}>
			<div className={styles.authCard}>
				<div className={styles.header}>
					<h1 className={styles.logo}>CoSphere</h1>
					<p className={styles.subtitle}>
						Smart Project & Task Collaboration
					</p>
				</div>

				{error && (
					<div className={styles.errorMsg}>
						<svg
							fill="none"
							height="20"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							width="20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle cx="12" cy="12" r="10" />
							<line x1="12" x2="12" y1="8" y2="12" />
							<line x1="12" x2="12.01" y1="16" y2="16" />
						</svg>
						<span>{error}</span>
					</div>
				)}

				<form onSubmit={handleSubmit} className={styles.form}>
					<div className={styles.inputGroup}>
						<label className={styles.label} htmlFor="email">
							Email Address
						</label>
						<input
							id="email"
							type="email"
							className={styles.input}
							placeholder="name@company.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={submitting}
							required
						/>
					</div>

					<div className={styles.inputGroup}>
						<label className={styles.label} htmlFor="password">
							Password
						</label>
						<input
							id="password"
							type="password"
							className={styles.input}
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={submitting}
							required
						/>
					</div>

					<button
						type="submit"
						className={styles.submitBtn}
						disabled={submitting}
					>
						{submitting ? "Authenticating..." : "Sign In"}
					</button>
				</form>

				<p className={styles.footerText}>
					Don&apos;t have an account?{" "}
					<Link href="/signup" className={styles.link}>
						Sign Up
					</Link>
				</p>

				<div className={styles.demoSection}>
					<h3 className={styles.demoTitle}>Quick Demo Login</h3>
					<div className={styles.demoGrid}>
						<button
							onClick={() => handleDemoLogin("admin@example.com")}
							className={styles.demoBtn}
							disabled={submitting}
						>
							Admin
						</button>
						<button
							onClick={() => handleDemoLogin("pm@example.com")}
							className={styles.demoBtn}
							disabled={submitting}
						>
							Manager
						</button>
						<button
							onClick={() =>
								handleDemoLogin("member1@example.com")
							}
							className={styles.demoBtn}
							disabled={submitting}
						>
							Member
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
