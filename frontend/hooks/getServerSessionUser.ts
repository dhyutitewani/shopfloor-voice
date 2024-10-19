import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export default async function getServerSessionUser() {
	const session = await getServerSession(authOptions);

	return session?.user;
}
