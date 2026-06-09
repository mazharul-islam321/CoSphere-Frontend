/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:5566/api"; // Fallback to dev port or check env

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api",
	credentials: "include", // Support HTTP-only cookie JWT propagation
	prepareHeaders: (headers) => {
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("cosphere_token");
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
		}
		return headers;
	},
});

const customBaseQuery = async (args: any, api: any, extraOptions: any) => {
	const result = await baseQuery(args, api, extraOptions);
	const url = typeof args === "string" ? args : args?.url;

	if (result.data) {
		const responseData = result.data as any;
		if (
			responseData &&
			typeof responseData === "object" &&
			"success" in responseData
		) {
			if (responseData.success && responseData.data !== undefined) {
				const data = responseData.data;
				if (
					url &&
					(url.includes("/auth/login") ||
						url.includes("/auth/signup"))
				) {
					if (data && data.token && typeof window !== "undefined") {
						localStorage.setItem("cosphere_token", data.token);
					}
				}
				return { ...result, data: responseData.data };
			}
		}
	}

	if (url && url.includes("/auth/logout")) {
		if (typeof window !== "undefined") {
			localStorage.removeItem("cosphere_token");
		}
	}

	return result;
};

export const apiSlice = createApi({
	reducerPath: "api",
	baseQuery: customBaseQuery,
	tagTypes: ["Project", "Task", "User", "Dashboard"],
	endpoints: () => ({}),
});
