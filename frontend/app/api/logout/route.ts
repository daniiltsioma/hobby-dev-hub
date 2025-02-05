import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function GET() {
    const cookieStore = await cookies();

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    redirect("/");
}
