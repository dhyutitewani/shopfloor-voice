export const USER_ROLES = {
	ADMIN: "ADMIN",
};

export const checkHasPermission = ({
	requiredRole,
	role,
}: {
	requiredRole: string;
	role: string;
}): boolean => {
	const roleHierarchy: Record<string, string[]> = {
		ADMIN: [USER_ROLES.ADMIN],
	};

	return (
		roleHierarchy[requiredRole] &&
		roleHierarchy[requiredRole].includes(role)
	);
};