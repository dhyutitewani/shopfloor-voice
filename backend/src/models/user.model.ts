import mongoose, { Schema, Document, Types } from "mongoose";
import { Password } from "../services/password";

// Define roles as an enum
enum UserRole {
	ADMIN = "ADMIN"
}

// Define interface for User document
interface IUser extends Document {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	active: boolean;
	role: UserRole;
}

// Define Mongoose schema for User
const userSchema: Schema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	active: { type: Boolean, default: false },
	role: { type: String, enum: Object.values(UserRole), required: true },
});

userSchema.pre("save", async function (done) {
	if (this.isModified("password")) {
		const hashed = await Password.toHash(this.get("password") as string); // Casting to string
		this.set("password", hashed);
	}
	done();
});

const User = mongoose.model<IUser>("User", userSchema);

export { User, IUser, UserRole };