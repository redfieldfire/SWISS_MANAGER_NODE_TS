import { T_Global, T_UpdateGlobals } from "../types";

export const GLOBALS: T_Global = {};
  
export const updateGlobal: T_UpdateGlobals = (key, value) => GLOBALS[key] = value;
