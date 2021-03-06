import {Component, Inject, Input, OnDestroy, ViewChild} from '@angular/core';
import {MyBaseCardComponent} from '../my-base-card-component';
import {IDataTugStoreBrief} from '@sneat/datatug/models';
import {AgentStateService, IAgentState} from "@sneat/datatug/services/repo";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {DatatugNavService} from "@sneat/datatug/services/nav";

@Component({
	selector: 'datatug-my-stores',
	templateUrl: './my-stores.component.html',
	styleUrls: ['./my-stores.component.scss'],
})
export class MyStoresComponent implements OnDestroy {
	@Input() public stores: IDataTugStoreBrief[];
	@ViewChild(MyBaseCardComponent) base: MyBaseCardComponent;

	public agentState: IAgentState;

	private readonly destroyed = new Subject<void>();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		readonly agentStateService: AgentStateService,
		private readonly datatugNavService: DatatugNavService,
	) {
		agentStateService.watchAgentInfo('localhost:8989')
			.pipe(
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: agentState => {
					console.log('agent state:', agentState);
					this.agentState = agentState;
				},
				error: error => {
					this.errorLogger.logError(error, 'failed to get agent state');
				}
			});
	}

	ngOnDestroy() {
		this.destroyed.next();
		this.destroyed.complete();
	}

	goStore(repo: string): void {
		this.datatugNavService.goStore(repo);
	}

	public checkAgent(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
	}

	public openHelp(event: Event, path: 'agent' | 'cloud' | 'github.com' | 'private-repos'): void {
		event.preventDefault();
		event.stopPropagation();
		window.open('https://datatug.app/' + path, '_blank');
	}
}
