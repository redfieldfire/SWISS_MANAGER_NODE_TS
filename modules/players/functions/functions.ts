import { T_UpdateDataWithoutTrashed } from '../types/functions';

import { Main } from '../model';

export const updateDataWithoutTrashed: T_UpdateDataWithoutTrashed = async () => Main.BM.helpers.updateDataWithoutTrashed()

