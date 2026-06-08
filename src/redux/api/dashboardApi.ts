/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "./apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getDashboardStats: builder.query<any, void>({
			query: () => "/dashboard",
			providesTags: ["Dashboard"],
		}),
	}),
	overrideExisting: false,
});

export const { useGetDashboardStatsQuery } = dashboardApi;
