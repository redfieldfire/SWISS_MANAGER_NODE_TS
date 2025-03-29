import { T_Model, T_CollectionModel, T_Collection, T_Resource, T_IndexResource, T_IndexModel, T_CollectionIndexModel, T_CollectionIndex } from "../../types";
import { indexModelStructure, modelStructure } from "../structures";

export const resource: T_Resource = (row: T_Model) => (
    Object.keys(modelStructure).reduce((accum, key) => {
        accum[key] = row[key] ?? modelStructure[key]
        return accum;
    }, {} as T_Model)
)
export const collection: T_Collection = (rows: T_CollectionModel) => (rows.map((row) => resource(row)));

export const indexResource: T_IndexResource = (row: T_IndexModel) => (
    Object.keys(indexModelStructure).reduce((accum, key) => {
        accum[key] = row[key] ?? indexModelStructure[key]
        return accum;
    }, {} as T_IndexModel)
)
export const indexCollection: T_CollectionIndex = (rows: T_CollectionIndexModel) => (rows.map((row) => indexResource(row)));