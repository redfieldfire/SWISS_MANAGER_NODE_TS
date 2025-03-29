import { Index, Main } from "../../classes";
import { T_Model, T_CollectionModel, T_TransformResource, T_TransformCollection, T_TransformIndexResource, T_TransformCollectionIndex, T_IndexModel, T_CollectionIndexModel} from "../../types";

export const transformedResource: T_TransformResource = (row: T_Model) => (new Main(row));
export const transformedCollection: T_TransformCollection = (rows: T_CollectionModel) => (rows.map((row) => transformedResource(row)));

export const transformedIndexResource: T_TransformIndexResource = (row: T_IndexModel) => (new Index(row));
export const transformedCollectionIndex: T_TransformCollectionIndex = (rows: T_CollectionIndexModel) => (rows.map((row) => transformedIndexResource(row)));