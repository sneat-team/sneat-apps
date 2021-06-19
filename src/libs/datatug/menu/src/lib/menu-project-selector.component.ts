import {Component, Inject, Input, OnChanges, SimpleChanges} from "@angular/core";
import {
	allUserProjectsAsFlatList,
	IDatatugProjectBase, IDatatugProjectBrief,
	IDatatugUser,
	IProjectAndStore,
	projectsBriefFromDictToFlatList
} from "@sneat/datatug/models";
import {PopoverController} from "@ionic/angular";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {DatatugNavContextService, DatatugNavService} from "@sneat/datatug/services/nav";
import {NewProjectFormComponent} from "../../../project/src/lib/new-project/new-project-form.component";
import {NewProjectService} from '../../../project/src/lib/new-project/new-project.service';

@Component({
	selector: 'datatug-menu-project-selector',
	templateUrl: 'menu-project-selector.component.html'
})
export class MenuProjectSelectorComponent implements OnChanges {
	@Input() datatugUser?: IDatatugUser;
	@Input() currentStoreId?: string;
	@Input() currentProjectId?: string;
	projects?: IDatatugProjectBrief[];

	constructor(
		@Inject(ErrorLogger)
		private readonly errorLogger: IErrorLogger,
		private readonly newProjectService: NewProjectService,
		private readonly nav: DatatugNavService,
		private readonly datatugNavContextService: DatatugNavContextService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.datatugUser) {
			if (this.datatugUser?.datatug?.stores && this.currentStoreId) {
				const projectsById = this.datatugUser?.datatug?.stores[this.currentStoreId]?.projects;
				this.projects = projectsBriefFromDictToFlatList(projectsById);
			} else {
				this.projects = undefined;
			}
		}
	}

	public newProject(event: Event): void {
		this.newProjectService.openNewProjectDialog(event);
	}

	switchProject(event: CustomEvent): void {
		try {
			const projectId: string = event.detail.value;
			if (!projectId) {
				return;
			}
			console.log('DatatugMenuComponent.switchProject', projectId);
			if (!this.currentStoreId) {
				console.log('project changed but there is no store');
				return;
			}
			const project = this.projects?.find(p => p.id === projectId);
			if (!project) {
				return;
			}
			this.datatugNavContextService.setCurrentProject({
				storeId: this.currentStoreId,
				brief: {
					...project,
					id: projectId,
					store: {type: 'agent'},
				},
				projectId,
			});
			if (projectId) {
				this.nav.goProject({storeId: this.currentStoreId, projectId});
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to handle project switch');
		}
	}

}