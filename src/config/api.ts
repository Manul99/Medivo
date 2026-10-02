// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// if (!API_BASE_URL) {
//   throw new Error(
//     "VITE_API_BASE_URL is not configured."
//   );
// }

// export const getApiUrl = (path: string): string =>
//   `${API_BASE_URL}/api${path}`;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const getApiUrl = (path: string): string =>
  `${API_BASE_URL}/api${path}`;