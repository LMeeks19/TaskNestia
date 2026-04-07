import ItemModel from "../models/itemModel";
import SectionModel from "../models/sectionModel";
import UpdateNestedEntityModel from "../models/updateNestedEntityModel";

export function updateItemEntity(entity: ItemModel, model: UpdateNestedEntityModel): ItemModel {
    return {
        ...entity,
        isComplete: model.isComplete,
        lastModified: model.lastModified
    } as ItemModel;

}

export function updateSectionEntity(entity: SectionModel, model: UpdateNestedEntityModel): SectionModel {
    return {
        ...entity,
        lastModified: model.lastModified,
        items: entity.items.map(item => {
            if (item.id === model?.id || !model.id)
                return updateItemEntity(item, model)
            return item;
        })
    } as SectionModel
}