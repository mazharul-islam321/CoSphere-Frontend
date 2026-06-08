/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "./apiSlice";

export const projectsApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getProjects: builder.query<any, any>({
			query: (params) => ({
				url: "/projects",
				params,
			}),
			providesTags: (result) =>
				result?.data
					? [
							...result.data.map(({ id }: any) => ({
								type: "Project" as const,
								id,
							})),
							{ type: "Project" as const, id: "LIST" },
						]
					: [{ type: "Project" as const, id: "LIST" }],
		}),

		getProjectById: builder.query<any, string>({
			query: (id) => `/projects/${id}`,
			providesTags: (result, error, id) => {
				const tags: any[] = [{ type: "Project" as const, id }];
				if (result?.tasks) {
					result.tasks.forEach((task: any) => {
						tags.push({ type: "Task" as const, id: task.id });
					});
				}
				return tags;
			},
		}),

		createProject: builder.mutation<any, any>({
			query: (newProj) => ({
				url: "/projects",
				method: "POST",
				body: newProj,
			}),
			invalidatesTags: [{ type: "Project", id: "LIST" }, "Dashboard"],
		}),

		updateProject: builder.mutation<
			any,
			{ id: string; [key: string]: any }
		>({
			query: ({ id, ...body }) => ({
				url: `/projects/${id}`,
				method: "PUT",
				body,
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: "Project", id },
				{ type: "Project", id: "LIST" },
				"Dashboard",
			],
		}),

		deleteProject: builder.mutation<any, string>({
			query: (id) => ({
				url: `/projects/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: [
				{ type: "Project", id: "LIST" },
				"Dashboard",
				"Task",
			],
		}),

		addMemberToProject: builder.mutation<
			any,
			{ id: string; memberId: string }
		>({
			query: ({ id, memberId }) => ({
				url: `/projects/${id}/members`,
				method: "POST",
				body: { memberId },
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: "Project", id },
				"Dashboard",
			],
		}),

		removeMemberFromProject: builder.mutation<
			any,
			{ id: string; memberId: string }
		>({
			query: ({ id, memberId }) => ({
				url: `/projects/${id}/members`,
				method: "DELETE",
				body: { memberId },
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: "Project", id },
				"Dashboard",
			],
		}),
	}),
	overrideExisting: false,
});

export const {
	useGetProjectsQuery,
	useGetProjectByIdQuery,
	useCreateProjectMutation,
	useUpdateProjectMutation,
	useDeleteProjectMutation,
	useAddMemberToProjectMutation,
	useRemoveMemberFromProjectMutation,
} = projectsApi;
