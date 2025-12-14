import { NextResponse } from "next/server";
import { cookies } from "next/headers";

interface SetAuthBody {
  user?: Record<string, unknown>;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SetAuthBody;
    const { user } = body;

    if (!user) {
      return NextResponse.json(
        { error: "CSRF token is required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    cookieStore.set({
      name: "auth",
      value: JSON.stringify(user),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting CSRF token:", error);
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
