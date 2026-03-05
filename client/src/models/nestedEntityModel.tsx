import NestedEntityType from "../enums/nestedEntityTypeEnum";

interface NestedEntityModel {
    id: number;
    type: NestedEntityType;
    sheetId: number;
    name: string;
    lastModified: string;
}

export default NestedEntityModel