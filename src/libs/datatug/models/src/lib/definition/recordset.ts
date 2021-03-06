import {IEntityFieldRef} from "./metapedia";

export interface IRecordsetDefinition {
	name: string;
	columns?: IRecordsetColumn[];
}

export interface IRecordsetColumn {
	name: string;
	type: string;
	meta?: IEntityFieldRef;
	hideIf?: IHideRecordsetColIf;
}

export interface IHideRecordsetColIf {
	parameters?: string[];
}

// This is used to mark source of a field in Views, SP & queries
export interface IRecordsetFieldRef {
	recordset: string;
	field: string;
}
