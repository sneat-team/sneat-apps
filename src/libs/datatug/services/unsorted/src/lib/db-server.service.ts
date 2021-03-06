import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ProjectContextService, ProjectService} from '@sneat/datatug/services/project';
import {IDbCatalogSummary, IDbServer, IDbServerSummary, IProjDbServerSummary} from '@sneat/datatug/models';
import {getStoreUrl} from '@sneat/datatug/nav';
import {GetServerDatabasesRequest} from '@sneat/datatug/dto';
import {IDatatugProjRef} from '@sneat/datatug/core';

@Injectable()
export class DbServerService {

  constructor(
    private readonly http: HttpClient,
    private readonly projectContextService: ProjectContextService,
    private readonly projectService: ProjectService,
  ) {
  }

  public getDbServerSummary(dbServer: IDbServer): Observable<IDbServerSummary> {
    const target = this.projectContextService?.current;
    if (!target) {
      return throwError(new Error('projectContextService.current is not set'));
    }
    const params: any = {
      proj: target.projectId,
      ...dbServer,
    }
    return this.http.get<IDbServerSummary>(`${getStoreUrl(target.repoId)}/dbserver-summary`, {params});
  }

  public getServerDatabases(request: GetServerDatabasesRequest): Observable<IDbCatalogSummary[]> {
    console.log('DbServerService.getDatabaseCatalogs()', request);
    const target = this.projectContextService.current;
    if (!target) {
      return throwError(new Error('projectContextService.current is not set'));
    }
    const params: any = {
      ...request.dbServer,
      proj: request.project || target.projectId,
    };
    return this.http.get<IDbCatalogSummary[]>(`${getStoreUrl(target.repoId)}/dbserver-databases`, {params});
  }

  public addDbServer(dbServer: IDbServer): Observable<IDbServerSummary> {
    const target = this.projectContextService.current;
    const params: any = {proj: target.projectId, ...dbServer};
    return this.http.post<IDbServerSummary>(`${getStoreUrl(target.repoId)}/dbserver-add`, undefined, {params});
  }

  public deleteDbServer(dbServer: IDbServer): Observable<void> {
    console.log('deleteDbServer', dbServer);
    const target = this.projectContextService.current;
    const params: any = {proj: target.projectId, ...dbServer};
    return this.http.delete<void>(`${getStoreUrl(target.repoId)}/dbserver-delete`, {params});
  }

  public getDbServers(target: IDatatugProjRef): Observable<IProjDbServerSummary[]> {
    console.log('getDbServers()', target);
    return this.projectService
      .getFull(target)
      .pipe(
        map(p => p.dbServers?.map(dbServerFull => ({
            dbServer: dbServerFull.dbServer,
            databasesCount: dbServerFull.databases?.length || 0
          }))
        ),
      );
  }
}
