import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("auth")?.value;

  if (!auth) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const user = JSON.parse(auth) as unknown;
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 400 });
  }
}
