import { collection, indexCollection } from './../DB/models/models';
import { Helpers } from "../../../globals";
import { HAS_MULTIPLE_FILES, MODULE_DATA_JSON, MODULE_NAME } from "../config";

import { driver } from "../DB/driver";

export const helpers = new Helpers({module_name: MODULE_NAME, module_data_json: MODULE_DATA_JSON, has_multiple_files: HAS_MULTIPLE_FILES, collection, indexCollection, getJSON: driver.getJSON, getIndexJSON: driver.getIndexJSON, writeJSON: driver.writeJSON})

export default helpers
