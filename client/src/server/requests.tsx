import UserModel from "../models/userModel";

async function request<T>(endpoint: string){
    const response = await fetch(`/api${endpoint}`, { credentials: 'include' });

    switch (response.status) {
        case 200:
            return await response.json() as T;
        default:
            return null;
    }
}

async function requestAuth<T>(method: string) {
    return await request<T>(`/auth/${method}`)
}

export function fetchCurrentUser() {
    return requestAuth<UserModel>(`getCurrentUser`);
}

