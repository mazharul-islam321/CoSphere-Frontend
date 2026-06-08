/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:5566/api"; // Fallback to dev port or check env

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api",
	credentials: "include", // Support HTTP-only cookie JWT propagation
});

const customBaseQuery = async (args: any, api: any, extraOptions: any) => {
	const result = await baseQuery(args, api, extraOptions);
	if (result.data) {
		const responseData = result.data as any;
		if (
			responseData &&
			typeof responseData === "object" &&
			"success" in responseData
		) {
			if (responseData.success && responseData.data !== undefined) {
				return { ...result, data: responseData.data };
			}
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
