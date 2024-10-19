"use client";
export function setLocalStorage(key: string, value: string) {
	localStorage.setItem(key, JSON.stringify(value));
}
