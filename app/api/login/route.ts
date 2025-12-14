import { cookies } from "next/headers";
import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";

interface LoginBody {
  email?: string;
  password?: string;
}

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as LoginBody;

  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE");
  const cookieHeader = req.headers.get("cookie") ?? undefined;

  try {
    const apiRes = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/auth/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          ln: localeCookie?.value,
          Cookie: cookieHeader,
        },
        withCredentials: true,
      }
    );

    const response = NextResponse.json({
      message: "Logged in successfully",
      userData: apiRes?.data,
    });

    return response;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const status = axiosError.response?.status ?? 500;
    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Something went wrong";

    return NextResponse.json({ error: message }, { status });
  }
}
