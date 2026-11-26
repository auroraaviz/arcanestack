import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return children;
}
