import {NgModule} from '@angular/core';
import {ProjectItemServiceFactory} from './project-item-service';
import {QueriesService} from './queries.service';
import {QUERY_PROJ_ITEM_SERVICE} from './queries.service.token';
import {RepoProviderService} from '@sneat/datatug/services/repo';
import {ProjItemServiceModule} from './project-item-service.module';

@NgModule({
  imports: [
    ProjItemServiceModule,
  ],
  providers: [
    {
      provide: QUERY_PROJ_ITEM_SERVICE,
      deps: [
        ProjectItemServiceFactory,
        RepoProviderService,
      ],
      useFactory: (projectItemServiceFactory: ProjectItemServiceFactory, repoProvider: RepoProviderService) =>
        projectItemServiceFactory.newProjectItemService(repoProvider, 'queries', 'query'),
    },
    QueriesService,
  ]
})
// @ts-ignore
export class QueriesServiceModule {
}