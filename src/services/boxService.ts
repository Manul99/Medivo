import { getApiUrl } from "../config/api";

export interface BoxPowerResponse {
  isOn: boolean;
  value: number;
}

export async function setBoxPower(
  isOn: boolean
): Promise<BoxPowerResponse> {
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
    getApiUrl("/box/power"),
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrfData.token,
      },
      body: JSON.stringify({
        isOn,
      }),
    }
  );

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error(
      "Failed to update box power state."
    );
  }

  return response.json();
}