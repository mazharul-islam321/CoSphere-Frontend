/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { useSignupMutation } from "../../../redux/api/authApi";
import {
	setCredentials,
	selectCurrentUser,
	selectAuthLoading,
} from "../../../redux/features/authSlice";
import styles from "../auth.module.css";

export default function Signup() {
	const user = useAppSelector(selectCurrentUser);
	const loading = useAppSelector(selectAuthLoading);
	const dispatch = useAppDispatch();
	const [signupTrigger, { isLoading: submitting }] = useSignupMutation();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("TEAM_MEMBER");
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
		if (!name || !email || !password || !role) {
			setError("Please fill in all fields.");
			return;
		}

		setError(null);
		try {
			const data = await signupTrigger({
				email,
				password,
				name,
				role,
			}).unwrap();
			dispatch(setCredentials(data.user));
			router.push("/dashboard");
		} catch (err: any) {
			setError(err?.data?.message || "Signup failed. Please try again.");
		}
	};

	if (loading) {
		return null;
	}

	return (
		<div className={styles.authContainer}>
			<div className={styles.authCard}>
				<div className={styles.header}>
					<h1 className={styles.logo}>CoSphere</h1>
					<p className={styles.subtitle}>
						Create your collaborator account
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
						<label className={styles.label} htmlFor="name">
							Full Name
						</label>
						<input
							id="name"
							type="text"
							className={styles.input}
							placeholder="John Doe"
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={submitting}
							required
						/>
					</div>

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
							placeholder="•••••••• (Min 6 characters)"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={submitting}
							minLength={6}
							required
						/>
					</div>

					<div className={styles.inputGroup}>
						<label className={styles.label} htmlFor="role">
							Organization Role
						</label>
						<select
							id="role"
							className={styles.select}
							value={role}
							onChange={(e) => setRole(e.target.value)}
							disabled={submitting}
							required
						>
							<option value="TEAM_MEMBER">
								Team Member (Task Updates Only)
							</option>
							<option value="PROJECT_MANAGER">
								Project Manager (Full Project & Task control)
							</option>
							<option value="ADMIN">
								System Administrator (Full access)
							</option>
						</select>
					</div>

					<button
						type="submit"
						className={styles.submitBtn}
						disabled={submitting}
					>
						{submitting ? "Creating Account..." : "Get Started"}
					</button>
				</form>

				<p className={styles.footerText}>
					Already have an account?{" "}
					<Link href="/login" className={styles.link}>
						Sign In
					</Link>
				</p>
			</div>
		</div>
	);
}
