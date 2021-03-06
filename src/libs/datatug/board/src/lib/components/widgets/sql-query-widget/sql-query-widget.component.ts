import {ChangeDetectorRef, Component, Inject, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {BoardCardTabService} from '../../board-card/board-card.component';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {IBoardContext, ISqlWidgetSettings} from '@sneat/datatug/models';
import {AgentService} from '@sneat/datatug/services/repo';
import {IRecordsetResult} from '@sneat/datatug/dto';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';

const reSqlParams = /@(\w+)/;

@Component({
	selector: 'datatug-sql-query-widget',
	templateUrl: './sql-query-widget.component.html',
})
export class SqlQueryWidgetComponent implements OnChanges, OnDestroy {

	@Input() level: number;
	@Input() tab: 'SQL' | 'grid' | 'card' = 'SQL';
	@Input() data: ISqlWidgetSettings;
	@Input() boardContext: IBoardContext;

	public state: 'loading' | 'loaded' | 'error';

	public sql: string;
	public recordset: IRecordsetResult = {
		duration: 0,
		columns: [
			{name: 'Grid', dbType: 'NVARCHAR'},
		],
		rows: [
			['Loading...'],
		]
	};

	destroyed = new Subject<boolean>();

	constructor(
		private readonly boardCardTab: BoardCardTabService,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly agentService: AgentService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
		setTimeout(() => boardCardTab.setTab('grid'), 2000);
		this.boardCardTab.changed.pipe(takeUntil(this.destroyed)).subscribe(() => this.changeDetectorRef.markForCheck())
	}

	ngOnDestroy(): void {
		this.destroyed.next(true);
		this.destroyed.complete();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if ((changes.data || changes.boardContext) && this.data) {
			console.log('SqlQueryWidgetComponent.ngOnChanges()', this.data);
			let sql = this.data.query;
			const match = sql.match(reSqlParams)
			if (match) {
				const paramName = match[1];
				const parameter = this.boardContext?.parameters[paramName];
				console.log('Parameter: ', paramName, parameter);
				if (parameter) {
					switch (parameter.type) {
						case 'string':
						case 'GUID':
						case 'UUID':
							sql = sql.replace(match[0], `'${parameter.value}'`);
							break
						case 'integer':
							sql = sql.replace(match[0], `${parameter.value}`)
					}
				}
			}
			this.sql = sql;
			if (this.data.env && this.data.db) {
				this.agentService.select('localhost:8989', {
					sql,
					env: this.data.env || 'LOCAL',
					db: this.data.db,
					proj: '.',
				}).subscribe({
					next: _ => {
						alert('not implemented processing response')
						// const itemWithRecordset = response.commands[0].items[0] as ICommandResponseWithRecordset
						// this.recordset = itemWithRecordset.value;
						this.changeDetectorRef.markForCheck();
					},
					error: err => this.errorLogger.logError(err, 'Failed to load data'),
				});
			} else { // TODO: temporary debug thing
				console.log(`Not issuing SELECT query as env=${this.data.env}, db=${this.data.db}`);
			}
			if (this.data.db) {
				this.sql = `-- USE ${this.data.db};
${this.sql}`;
			}
			this.changeDetectorRef.markForCheck();
		}
	}
}
