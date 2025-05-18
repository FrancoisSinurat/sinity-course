// lib/api/auth.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type LoginPayload = {
  email: string;
  password: string;
};


type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type UpdateProfilePayload = {
  name: string;
  email: string;
};

export const login = async (payload: LoginPayload) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Login failed");
  return data;
};

export const register = async (payload: RegisterPayload) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Register failed");
  return data;
};

export const fetchMe = async (token: string) => {
  const res = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch current user");
  return await res.json();
};

export const updateProfile = async (token: string, payload: UpdateProfilePayload) => {
  const res = await fetch(`${API_URL}/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update profile");
  return await res.json();
};

export const logout = async (token: string) => {
  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Logout failed");
  return await res.json();
};
