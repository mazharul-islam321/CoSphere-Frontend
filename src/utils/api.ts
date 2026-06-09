const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export class APIError extends Error {
	status: number;
	constructor(message: string, status: number) {
		super(message);
		this.status = status;
		this.name = "APIError";
	}
}

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
	const url = `${API_BASE_URL}${endpoint}`;

	const headers = new Headers(options.headers);
	if (!(options.body instanceof FormData)) {
		headers.set("Content-Type", "application/json");
	}

	// Attach Authorization Bearer token if it exists in localStorage
	if (typeof window !== "undefined") {
		const token = localStorage.getItem("cosphere_token");
		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}
	}

	const response = await fetch(url, {
		...options,
		headers,
		credentials: "include", // Crucial for reading/writing HttpOnly JWT cookies
	});

	const text = await response.text();
	let data;
	try {
		data = text ? JSON.parse(text) : {};
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (err) {
		data = { message: text || "Failed to parse JSON response" };
	}

	if (!response.ok) {
		throw new APIError(
			data.message || "An error occurred during the API request",
			response.status,
		);
	}

	return data;
};
