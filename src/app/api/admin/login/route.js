import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const { username = "", password = "" } = body;

    const expectedUsername =
      process.env.ADMIN_USERNAME ||
      process.env.NEXT_PUBLIC_ADMIN_USERNAME;

    const expectedPassword =
      process.env.ADMIN_PASSWORD ||
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    const backupPassword = process.env.ADMIN_PASSWORD_BACKUP;

    const passwordMatches =
      String(password) === expectedPassword ||
      (backupPassword && String(password) === backupPassword);

    if (
      username &&
      String(username).trim() === expectedUsername &&
      passwordMatches
    ) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Invalid username or password." },
      { status: 401 }
    );
  } catch (err) {
    console.error("Login API Error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
