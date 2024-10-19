import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function setParams() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const params = new URLSearchParams(searchParams);

	return (key: string, val: string) => {
		if (key && val) {
			params.set(key, val);
		} else {
			params.delete(key);
		}
		replace(`${pathname}?${params.toString()}`);
	};
}

export function setRouteWithParams() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const params = new URLSearchParams(searchParams);

	return (newRoute: string) => {
		replace(`${pathname + "/" + newRoute}?${params.toString()}`);
	};
}
