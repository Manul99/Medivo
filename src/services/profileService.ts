import type {
  UserProfile,
  UpdateProfileRequest,
} from "../interfaces/user.interface";

import { getApiUrl } from "../config/api";
export async function getMyProfile(): Promise<UserProfile> {
  const response =
    await fetch(
      getApiUrl("/auth/me"),
      {
        method: "GET",
        credentials: "include",
      }
    );

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error(
      "Failed to load user profile."
    );
  }

  return response.json();
}

export async function updateMyProfile(
  request: UpdateProfileRequest
): Promise<UserProfile> {
  // Get CSRF token before making the PUT request.
  const csrfResponse = await fetch(
    getApiUrl("/auth/csrf"),
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!csrfResponse.ok) {
    throw new Error(
      "Failed to initialize CSRF protection."
    );
  }

  const csrfData = await csrfResponse.json();

  if (!csrfData.token) {
    throw new Error(
      "CSRF token was not returned by the server."
    );
  }

  const response = await fetch(
    getApiUrl("/auth/me"),
    {
      method: "PUT",
      credentials: "include",

      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrfData.token,
      },

      body: JSON.stringify(request),
    }
  );

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    let message =
      "Failed to update user profile.";

    try {
      const data = await response.json();

      if (typeof data === "string") {
        message = data;
      } else if (data?.message) {
        message = data.message;
      } else if (data?.title) {
        message = data.title;
      }
    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  return response.json();
}