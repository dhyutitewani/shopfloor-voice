import { JWT, DefaultJWT } from "next-auth/jwt";
import { PlantType, ScreenType } from "./types";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			_id: string;
			username: string;
			email: string;
			firstName: string;
			lastName: string;
			role: string;
			userJwt: string;
		} & DefaultSession;
	}
	interface User extends DefaultUser {
		_id: string;
		username: string;
		email: string;
		firstName: string;
		lastName: string;
		role: string;
		userJwt: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		_id: string;
		username: string;
		email: string;
		firstName: string;
		lastName: string;
		role: string;
		userJwt: string;
	}
}
