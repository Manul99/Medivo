import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";

import { auth } from "../firebase/firebase";

const API_BASE_URL = "";

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
  bloodType: string;
  boxId: string;
}

export interface UserProfileResponse {
  id: string;
  firebaseUid: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdAtUtc: string;
  updatedAtUtc: string;
}

/**
 * Gets the CSRF token from the backend.
 *
 * The backend stores the token in the XSRF-TOKEN cookie.
 */
async function getCsrfToken(): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/csrf`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to initialize CSRF protection.");
  }

  const data = await response.json();

  if (!data.token) {
    throw new Error("CSRF token was not returned by the server.");
  }

  return data.token;
}

/**
 * Creates the authenticated backend session.
 */
async function createBackendSession(
  firebaseIdToken: string,
  csrfToken: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/session`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrfToken,
      },
      body: JSON.stringify({
        idToken: firebaseIdToken,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || "Failed to create application session."
    );
  }
}

/**
 * Creates the application user profile in PostgreSQL.
 */
async function createUserProfile(
  request: RegisterRequest,
  csrfToken: string
): Promise<UserProfileResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/profile`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrfToken,
      },
      body: JSON.stringify({
        firstName: request.firstName,
        lastName: request.lastName,
        phoneNumber: request.phoneNumber,
        dateOfBirth: request.dateOfBirth,
        bloodType: request.bloodType,
        boxId: request.boxId,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || "Failed to create user profile."
    );
  }

  return response.json();
}

export async function registerUser(
  request: RegisterRequest
): Promise<UserProfileResponse> {
  /*
   * 1. Get CSRF token before making any POST request.
   */
  const csrfToken = await getCsrfToken();

  /*
   * 2. Create the Firebase Authentication account.
   */
  const credential =
    await createUserWithEmailAndPassword(
      auth,
      request.email,
      request.password
    );

  const firebaseUser = credential.user;

  /*
   * 3. Optional Firebase display name.
   */
  await updateProfile(firebaseUser, {
    displayName:
      `${request.firstName} ${request.lastName}`.trim(),
  });

  /*
   * 4. Get Firebase ID token.
   */
  const firebaseIdToken =
    await firebaseUser.getIdToken(true);

  /*
   * 5. Create the backend session.
   *
   * Sends:
   *   XSRF-TOKEN cookie
   *   X-XSRF-TOKEN header
   */
  await createBackendSession(
    firebaseIdToken,
    csrfToken
  );

  /*
   * 6. Create the application user in PostgreSQL.
   */
  const profile =
    await createUserProfile(
      request,
      csrfToken
    );

  return profile;
}

export async function loginUser(
  email: string,
  password: string
): Promise<UserProfileResponse> {
  /*
   * 1. Get CSRF token.
   */
  const csrfToken = await getCsrfToken();

  /*
   * 2. Login to Firebase.
   */
  const credential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  /*
   * 3. Get Firebase ID token.
   */
  const firebaseIdToken =
    await credential.user.getIdToken(true);

  /*
   * 4. Create backend session.
   */
  await createBackendSession(
    firebaseIdToken,
    csrfToken
  );

  /*
   * 5. Load application profile.
   */
  const response = await fetch(
    `${API_BASE_URL}/api/auth/me`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load application user profile."
    );
  }

  return response.json();
}

export async function logoutUser(): Promise<void> {
  try {
    const csrfToken = await getCsrfToken();

    await fetch(
      `${API_BASE_URL}/api/auth/logout`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": csrfToken,
        },
      }
    );
  } finally {
    await signOut(auth);
  }
}

export function getFirebaseUser(): User | null {
  return auth.currentUser;
}