/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "./apiSlice";

export const tasksApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getTasks: builder.query<any, any>({
			query: (params) => ({
				url: "/tasks",
				params,
			}),
			providesTags: (result) =>
				result?.data
					? [
							...result.data.map(({ id }: any) => ({
								type: "Task" as const,
								id,
							})),
							{ type: "Task" as const, id: "LIST" },
						]
					: [{ type: "Task" as const, id: "LIST" }],
		}),

		createTask: builder.mutation<any, any>({
			query: (newTask) => ({
				url: "/tasks",
				method: "POST",
				body: newTask,
			}),
			invalidatesTags: (result, error, newTask) => [
				{ type: "Task", id: "LIST" },
				{ type: "Project", id: "LIST" },
				...(newTask?.projectId
					? [{ type: "Project" as const, id: newTask.projectId }]
					: []),
				"Dashboard",
			],
		}),

		updateTask: builder.mutation<any, { id: string; [key: string]: any }>({
			query: ({ id, ...body }) => ({
				url: `/tasks/${id}`,
				method: "PUT",
				body,
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Task", id: arg.id },
				{ type: "Task", id: "LIST" },
				...(result?.projectId
					? [{ type: "Project" as const, id: result.projectId }]
					: []),
				"Project",
				"Dashboard",
			],
		}),

		deleteTask: builder.mutation<any, string>({
			query: (id) => ({
				url: `/tasks/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [
				{ type: "Task", id },
				{ type: "Task", id: "LIST" },
				...(result?.task?.projectId
					? [{ type: "Project" as const, id: result.task.projectId }]
					: []),
				"Project",
				"Dashboard",
			],
		}),

		addComment: builder.mutation<any, { taskId: string; content: string }>({
			query: ({ taskId, content }) => ({
				url: `/tasks/${taskId}/comments`,
				method: "POST",
				body: { content },
			}),
			invalidatesTags: (result, error, { taskId }) => [
				{ type: "Task", id: taskId },
			],
		}),

		addAttachment: builder.mutation<
			any,
			{ taskId: string; formData: FormData }
		>({
			query: ({ taskId, formData }) => ({
				url: `/tasks/${taskId}/attachments`,
				method: "POST",
				body: formData,
			}),
			invalidatesTags: (result, error, { taskId }) => [
				{ type: "Task", id: taskId },
			],
		}),
	}),
	overrideExisting: false,
});

export const {
	useGetTasksQuery,
	useCreateTaskMutation,
	useUpdateTaskMutation,
	useDeleteTaskMutation,
	useAddCommentMutation,
	useAddAttachmentMutation,
} = tasksApi;
