import { FILE_PATH, INDEX_SUB_PATH, MAIN_DB_PATH_NAME, MAIN_INDEX_PATH_NAME, MODULE_NAME } from '../../config';
import { collection, indexCollection } from '../models/models';
import { Driver } from '../../../../globals/driver';

//--------------------------------------------------- CREATE A NEW DRIVER
export const driver = new Driver({module_name: MODULE_NAME, file_path: FILE_PATH, main_db_path_name: MAIN_DB_PATH_NAME, index_sub_path: INDEX_SUB_PATH, main_index_path_name: MAIN_INDEX_PATH_NAME, collection, indexCollection})

export default driver