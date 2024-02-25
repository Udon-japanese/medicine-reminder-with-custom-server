import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuthOptions";

export default async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}