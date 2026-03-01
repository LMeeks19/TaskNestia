import SheetModel from "../models/sheetModel";
import UserModel from "../models/userModel";

async function request<T>(endpoint: string, params: RequestInit): Promise<T> {
    const response = await fetch(`/api${endpoint}`, { ...params, headers: { "Content-Type": "application/json" }, credentials: 'include' });
    return await response.json() as T;
}

async function requestAuth<T>(method: string, params: RequestInit): Promise<T> {
    return await request<T>(`/auth/${method}`, params);
}

async function requestSheet<T>(method: string, params: RequestInit): Promise<T> {
    return await request<T>(`/sheet/${method}`, params);
}

export function fetchCurrentUser(): Promise<UserModel> {
    return requestAuth<UserModel>('getCurrentUser', { method: 'GET' });
}

export function fetchUserSheets(): Promise<Array<SheetModel>> {
    return requestSheet<Array<SheetModel>>('getUserSheets', { method: 'GET' });
}

export function addSheet(name: string): Promise<SheetModel> {
    return requestSheet<SheetModel>('addSheet', { method: 'POST', body: JSON.stringify(name) });
}

export function deleteSheet(id: number): Promise<number> {
    return requestSheet<number>(`deleteSheet/${id}`, { method: 'DELETE' });
}

