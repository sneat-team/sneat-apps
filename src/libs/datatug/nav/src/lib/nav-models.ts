import {
	IProjectBrief,
	IProjectSummary,
	IEnvironmentSummary,
	IProjEnv,
	ITableFull, IDatatugStoreBrief
} from '@sneat/datatug/models';
import {IProjectRef} from "@sneat/datatug/core";
import {IStoreRef, parseStoreRef} from '@sneat/core';

export interface IDatatugStoreContext {
	readonly ref: IStoreRef;
	readonly brief?: IDatatugStoreBrief;
}

export interface IProjectContext {
	readonly ref: IProjectRef;
	readonly store: IDatatugStoreContext;
	readonly brief?: IProjectBrief;
	readonly summary?: IProjectSummary;
}

export function newProjectBriefFromSummary(summary: IProjectSummary, brief?: IProjectBrief): IProjectBrief {
	return {
		...(brief || {}),
		access: summary.access,
		title: summary.title,
		// titleOverride: summary.t
	};
}

export function populateProjectBriefFromSummaryIfMissing(p: IProjectContext): IProjectContext {
	if (p?.summary && !p.brief) {
		p = {...p, brief: newProjectBriefFromSummary(p.summary)};
	}
	return p
}

export function newProjectContextFromRef(ref: IProjectRef): IProjectContext {
	return {ref, store: {ref: parseStoreRef(ref.storeId)}};
}


export interface IEnvContext {
	readonly id: string;
	readonly brief?: IProjEnv;
	readonly summary?: IEnvironmentSummary;
}

export interface IEnvDbContext {
	readonly id: string;
}

export interface IEnvDbTableContext {
	schema: string;
	name: string;
	meta?: ITableFull,
}

export interface IDatatugNavContext {
	readonly projectId?: string;
	readonly envId?: string;
	readonly dbId?: string;
}

export interface IAgentContext {
	protocol: 'http' | 'https';
	host: string;
	port: number;
}

export const getStoreId = (repo: string): string => {
	if (repo.startsWith('http://')) {
		return repo.replace('http://', 'http-')
	} else if (repo.startsWith('https://')) {
		return repo.replace('https://', 'https-')
	}
	return repo;
}

export const getStoreUrl = (storeId: string): string => {
	if (storeId === 'firestore') {
		const v = 'http://localhost:4300/v0'; //environment.agents.firestoreStoreAgent;
		console.log('firestoreStoreAgent', v);
		return v.endsWith('/') ? v.substring(0, v.length - 1) : v;
	}
	if (!storeId || storeId.startsWith('http://') || storeId.startsWith('https://')) {
		return storeId;
	}
	if (storeId.startsWith('http-')) {
		return storeId.replace('http-', 'http://');
	}
	if (storeId.startsWith('https-')) {
		return storeId.replace('https-', 'https://');
	}
	const a = storeId.split(':');
	storeId = `//${a[0]}:${a[1]}`;
	if (a[2]) {
		storeId += ':' + a[2];
	}
	return storeId;
};
