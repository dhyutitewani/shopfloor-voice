"use server";
import { cookies } from "next/headers";

export async function getCookie(name: string) {
	return cookies().get(name)?.value || "";
}

export async function setCookie(key: string, val: string) {
	cookies().set(key, val);
}

export async function removeCookie(key: string) {
	cookies().delete(key);
}
