interface UpdateItemModel {
    id: number;
    sectionId?: number;
    sectionLastModified: Date;
    itemLastModified: Date;
    itemIsComplete: boolean;
}