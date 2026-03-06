import { atom } from "recoil";
import SectionModel from "../models/sectionModel";
import ItemModel from "../models/itemModel";
import SheetModel from "../models/sheetModel";
import UserModel from "../models/userModel";

export const currentUserState = atom({
    key: 'currentUserState',
    default: {} as UserModel
});

export const sheetsState = atom({
    key: 'sheetsState',
    default: [] as Array<SheetModel>
});

export const nestedEntitiesState = atom({
    key: 'nestedEntitiesState',
    default: [] as Array<SectionModel | ItemModel>
});