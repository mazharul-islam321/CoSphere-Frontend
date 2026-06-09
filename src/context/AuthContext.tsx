/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch, APIError } from "../utils/api";

export interface User {
	id: string;
	email: string;
	name: string;
	role: "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	signup: (
		email: string,
		password: string,
		name: string,
		role?: string,
	) => Promise<void>;
	logout: () => Promise<void>;
	error: string | null;
	setError: (err: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchCurrentUser = async () => {
		console.log("[AuthContext] fetchCurrentUser started");
		try {
			setLoading(true);
			const data = await apiFetch("/auth/me");
			console.log("[AuthContext] fetchCurrentUser success:", data.user);
			setUser(data.user);
		} catch (err) {
			console.log("[AuthContext] fetchCurrentUser error:", err);
			// Ignore 401/403 on mount (user is simply not logged in)
			if (
				err instanceof APIError &&
				(err.status === 401 || err.status === 403)
			) {
				setUser(null);
			} else {
				console.error("Session restoration failed:", err);
			}
		} finally {
			console.log(
				"[AuthContext] fetchCurrentUser finally - setting loading to false",
			);
			setLoading(false);
		}
	};

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchCurrentUser();
	}, []);

	const login = async (email: string, password: string) => {
		setError(null);
		try {
			const data = await apiFetch("/auth/login", {
				method: "POST",
				body: JSON.stringify({ email, password }),
			});
			if (data.token) {
				localStorage.setItem("cosphere_token", data.token);
			}
			setUser(data.user);
		} catch (err: any) {
			setError(err.message || "Login failed. Please verify credentials.");
			throw err;
		}
	};

	const signup = async (
		email: string,
		password: string,
		name: string,
		role?: string,
	) => {
		setError(null);
		try {
			const data = await apiFetch("/auth/signup", {
				method: "POST",
				body: JSON.stringify({ email, password, name, role }),
			});
			if (data.token) {
				localStorage.setItem("cosphere_token", data.token);
			}
			setUser(data.user);
		} catch (err: any) {
			setError(err.message || "Signup failed. Please try again.");
			throw err;
		}
	};

	const logout = async () => {
		try {
			await apiFetch("/auth/logout", { method: "POST" });
		} catch (err) {
			console.error("Logout API request error:", err);
		} finally {
			localStorage.removeItem("cosphere_token");
			setUser(null);
		}
	};

	return (
		<AuthContext.Provider
			value={{ user, loading, login, signup, logout, error, setError }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
