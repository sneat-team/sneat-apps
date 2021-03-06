import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {routingParamRepoId} from '@sneat/datatug/core';

export const datatugRoutes: Routes = [
	{
		path: '',
		loadChildren: () => import('@sneat/datatug/pages/home').then(m => m.DatatugPagesHomeModule),
	},
	{
		path: 'store/:' + routingParamRepoId,
		loadChildren: () => import('./datatug-routing-store').then(m => m.DatatugStoreRoutingModule),
		// ...canLoad(),
	},
	{
		path: 'agent',
		redirectTo: '/',
	},
];

@NgModule({
	imports: [
		RouterModule.forChild(datatugRoutes)
	],
	exports: [
		RouterModule,
	],
})
export class DatatugRoutingModule {
}
