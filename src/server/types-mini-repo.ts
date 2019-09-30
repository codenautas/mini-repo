import * as BackendPlus from "backend-plus";

export * from "backend-plus";

export type ContextRoles = {es:{admin:boolean, gabinete:boolean, coordinador:boolean}}
export type TableContext = BackendPlus.TableContext&ContextRoles;
