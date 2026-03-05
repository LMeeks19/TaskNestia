import ItemModel from "./itemModel";
import NestedEntityModel from "./nestedEntityModel";

interface SectionModel extends NestedEntityModel {
    items: Array<ItemModel>;
}

export default SectionModel