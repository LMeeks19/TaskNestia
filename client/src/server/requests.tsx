import ItemModel from "../models/itemModel";
import NestedEntityModel from "../models/nestedEntityModel";
import SectionModel from "../models/sectionModel";
import SheetModel from "../models/sheetModel";
import UserModel from "../models/userModel";
import CreateItemRequestModel from "./models/createItemRequestModel";
import CreateSectionRequestModel from "./models/createSectionRequestModel";
import CreateSheetRequestModel from "./models/createSheetRequestModel";
import UpdateItemRequestModel from "./models/updateItemRequestModel";
import UpdateSectionRequestModel from "./models/updateSectionRequestModel";

async function request<T>(endpoint: string, params: RequestInit): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
        ...params,
        headers: { "Content-Type": "application/json" },
        credentials: 'include'
    });
    return await response.json() as T;
}

// Auth

async function requestAuth<T>(method: string, params: RequestInit): Promise<T> {
    return await request<T>(`/auth/${method}`, params);
}

export function fetchCurrentUser(): Promise<UserModel> {
    return requestAuth<UserModel>('getCurrentUser', {
        method: 'GET'
    });
}

// Sheet

async function requestSheet<T>(method: string, params: RequestInit): Promise<T> {
    return await request<T>(`/sheet/${method}`, params);
}

export function fetchUserSheets(): Promise<Array<SheetModel>> {
    return requestSheet<Array<SheetModel>>('getUserSheets', {
        method: 'GET'
    });
}

export function addSheet(name: string): Promise<SheetModel> {
    return requestSheet<SheetModel>('addSheet', {
        method: 'POST',
        body: JSON.stringify({ name: name } as CreateSheetRequestModel)
    });
}

export function deleteSheet(id: number): Promise<number> {
    return requestSheet<number>(`deleteSheet/${id}`, {
        method: 'DELETE'
    });
}

// Nested Entity

async function requestNestedEntity<T>(method: string, params: RequestInit): Promise<T> {
    return await request<T>(`/nestedEntities/${method}`, params);
}

export function fetchNestedEntities(sheetId: number): Promise<Array<SectionModel | ItemModel>> {
    return requestNestedEntity<Array<SectionModel | ItemModel>>(`getNestedEntities/${sheetId}`, {
        method: 'GET'
    })
}

// Section

async function requestSection<T>(method: string, params: RequestInit): Promise<T> {
    return await request<T>(`/section/${method}`, params);
}

export async function addSection(request: CreateSectionRequestModel): Promise<SectionModel> {
    return await requestSection<SectionModel>(`addSection`, {
        method: 'POST',
        body: JSON.stringify(request)
    });
}

export async function deleteSection(id: number): Promise<number> {
    return await requestSection<number>(`deleteSection/${id}`, {
        method: 'DELETE'
    });
}

export async function updateSection(request: UpdateSectionRequestModel): Promise<UpdateNestedEntityModel> {
    return await requestSection<UpdateNestedEntityModel>(`updateSection`, {
        method: 'PATCH',
        body: JSON.stringify(request)
    });
}

// Item

async function requestItem<T>(method: string, params: RequestInit): Promise<T> {
    return await request<T>(`/item/${method}`, params);
}

export async function addItem(request: CreateItemRequestModel): Promise<ItemModel> {
    return await requestItem<ItemModel>('addItem', {
        method: 'POST',
        body: JSON.stringify(request)
    });
}

export async function deleteItem(id: number): Promise<number> {
    return await requestItem<number>(`deleteItem/${id}`, {
        method: 'DELETE'
    });
}

export async function updateItem(request: UpdateItemRequestModel): Promise<UpdateNestedEntityModel> {
    return await requestItem<UpdateNestedEntityModel>(`updateItem`, {
        method: 'PATCH',
        body: JSON.stringify(request)
    });
}

