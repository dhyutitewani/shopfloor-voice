export const USER_ROLES = {
	SUPER_ADMIN: "SUPER_ADMIN",
	ADMIN: "ADMIN",
	MANAGER: "MANAGER",
	VIEWER: "VIEWER",
};

export const checkHasPermission = ({
	requiredRole,
	role,
}: {
	requiredRole: string;
	role: string;
}): boolean => {
	const roleHierarchy: Record<string, string[]> = {
		VIEWER: [
			USER_ROLES.VIEWER,
			USER_ROLES.MANAGER,
			USER_ROLES.ADMIN,
			USER_ROLES.SUPER_ADMIN,
		],
		DATA_EDITOR: [
			USER_ROLES.MANAGER,
			USER_ROLES.ADMIN,
			USER_ROLES.SUPER_ADMIN,
		],
		ADMIN: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
		SUPER_ADMIN: [USER_ROLES.SUPER_ADMIN],
	};

	return (
		roleHierarchy[requiredRole] &&
		roleHierarchy[requiredRole].includes(role)
	);
};