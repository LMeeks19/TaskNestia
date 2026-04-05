import NestedEntityType from "../../enums/nestedEntityTypeEnum";

interface UploadDataRequestModel {
    sheetId: number;
    type: NestedEntityType;
    sectionName?: string;
    uploadData: string[];
}

export default UploadDataRequestModel;