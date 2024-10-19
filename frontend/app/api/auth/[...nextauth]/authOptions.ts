import { z } from 'zod';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const parsedCredentials = z
					.object({
						email: z.string().email(),
						password: z.string().min(8),
					})
					.safeParse(credentials);

				try {
					if (parsedCredentials.success) {
						const { email, password } = parsedCredentials.data;

						const res = await fetch(
							process.env.NEXT_PUBLIC_API_URL + '/admin/login',
							{
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({ email, password }),
							}
						);
						const data = await res.json();

						if (res.ok) {
							return { ...data.user, userJwt: data.userJwt };
						}

						throw new Error(data.message);
					} else {
						throw new Error(
							"zod says: " +
								parsedCredentials.error.issues[0].message
						);
					}
				} catch (error: any) {
					console.error("error from auth option", error.message);
					throw { error: error.message };
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token._id = user._id;
				token.username = user.username;
				token.email = user.email;
				token.firstName = user.firstName as string;
				token.lastName = user.lastName as string;
				token.role = user.role;
				token.userJwt = user.userJwt as string;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user._id = token._id as string;
				session.user.username = token.username;
				session.user.email = token.email;
				session.user.firstName = token.firstName;
				session.user.lastName = token.lastName;
				session.user.role = token.role;
				session.user.userJwt = token.userJwt;
			}
			return session;
		},
	},
};