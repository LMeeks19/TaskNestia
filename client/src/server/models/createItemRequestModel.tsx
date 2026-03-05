interface CreateItemRequestModel {
    name: string;
    description: string;
    sheetId: number;
    sectionId?: number;
}

export default CreateItemRequestModel;