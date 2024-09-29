export enum UserRole {
	ADMIN = "ADMIN"
}

export interface UserType {
	_id: number;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	role: UserRole; 
}