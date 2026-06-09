/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "./apiSlice";
import { User } from "../features/authSlice";

export const authApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation<{ user: User; token: string }, any>({
			query: (credentials) => ({
				url: "/auth/login",
				method: "POST",
				body: credentials,
			}),
			invalidatesTags: ["Dashboard", "User"],
		}),

		signup: builder.mutation<{ user: User; token: string }, any>({
			query: (userData) => ({
				url: "/auth/signup",
				method: "POST",
				body: userData,
			}),
			invalidatesTags: ["Dashboard", "User"],
		}),

		logout: builder.mutation<{ message: string }, void>({
			query: () => ({
				url: "/auth/logout",
				method: "POST",
			}),
			// Clear all tags in cache upon logout
			invalidatesTags: ["Project", "Task", "User", "Dashboard"],
		}),

		getMe: builder.query<{ user: User }, void>({
			query: () => "/auth/me",
			providesTags: ["User"],
		}),

		getUsers: builder.query<any[], void>({
			query: () => "/auth/users",
			providesTags: ["User"],
		}),
	}),
	overrideExisting: false,
});

export const {
	useLoginMutation,
	useSignupMutation,
	useLogoutMutation,
	useGetMeQuery,
	useGetUsersQuery,
} = authApi;
