import mongoose from "mongoose";
import { User } from "../models/user.model";

const users = [
	{
		firstName: "ORCA",
		lastName: "LEAN",
		email: "super@orcalean.com",
		password: "Password$1234",
		role: "ADMIN", // Change role to ADMIN if needed
	},
];

async function usersSeed() {
	try {
		for (const userObj of users) {
			const { firstName, lastName, email, password, role } = userObj;

			const existingUser = await User.findOne({ email });

			if (existingUser) {
				console.error(`${email} account already exists. Skipping creation.`);
			} else {
				const user = await User.create({
					firstName,
					lastName,
					email,
					password,
					role,
				});
				console.info(`User account for ${email} created successfully.`);
			}
		}
	} catch (error) {
		console.error("Error seeding administrator account:", error);
	}
}

export default usersSeed;