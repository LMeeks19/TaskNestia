import NestedEntityModel from "./nestedEntityModel";

interface ItemModel extends NestedEntityModel {
    sectionId?: number;
    description: string;
    isComplete: boolean;
}

export default ItemModel