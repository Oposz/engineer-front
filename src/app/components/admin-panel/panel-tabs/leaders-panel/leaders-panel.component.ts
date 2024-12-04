import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {MatMenu, MatMenuContent, MatMenuTrigger} from "@angular/material/menu";
import {NgOptimizedImage} from "@angular/common";
import {DetailedLeaderCard, LeaderProject} from "../../../../shared/constants/leaderCard";
import {HttpService} from "../../../../shared/service/http.service";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarComponent, SnackbarData} from "../../../shared/snackbar/snackbar.component";
import {SnackbarService} from "../../../../shared/service/snackbar.service";
import {AddEditLeaderModalComponent} from "./add-edit-leader-modal/add-edit-leader-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ModalOutcome} from "../../../../shared/constants/modalOutcome";

type ModalOutComeWithData = {
  result: ModalOutcome,
  data: DetailedLeaderCard
}

@Component({
  selector: 'app-leaders-panel',
  standalone: true,
  imports: [
    MatMenu,
    MatMenuContent,
    NgOptimizedImage,
    MatMenuTrigger
  ],
  templateUrl: './leaders-panel.component.html',
  styleUrl: './leaders-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadersPanelComponent implements OnInit {
  fetching = true;
  leaders: DetailedLeaderCard[] = [];
  leadersToModify: string[] = []

  readonly dialog = inject(MatDialog);
  readonly destroyRef = inject(DestroyRef);


  constructor(
    private readonly httpService: HttpService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly snackbarService: SnackbarService) {
  }

  ngOnInit() {
    this.httpService.get('leaders/detailed').subscribe((leaders: DetailedLeaderCard[]) => {
      this.leaders = leaders;
      this.fetching = false;
      this.changeDetectorRef.detectChanges();
    })
  }

  adjustAllLeadersInList(checkboxEvent: Event) {
    const checkboxValue = checkboxEvent.target as HTMLInputElement
    if (checkboxValue.checked) {
      this.leadersToModify = this.leaders.map((leader) => leader.id);
      return
    }
    this.leadersToModify = [];
    this.changeDetectorRef.detectChanges();
  }

  adjustLeaderToModify(leaderId: string, checkboxEvent: Event) {
    const checkboxValue = checkboxEvent.target as HTMLInputElement
    if (checkboxValue.checked) {
      this.leadersToModify.push(leaderId);
      return
    }
    const cardIdIndex = this.leadersToModify.indexOf(leaderId)
    if (cardIdIndex === -1) return
    this.leadersToModify.splice(cardIdIndex, 1)
    this.changeDetectorRef.detectChanges();
  }

  isLeaderAlreadySelected(leaderId: string) {
    return this.leadersToModify.some((_card) => _card === leaderId);
  }

  getAllUsersAssigned(leaderProjects: LeaderProject[]) {
    const userSet = new Set<string>();

    leaderProjects.forEach(project => {
      project.signedUsers.forEach(user => {
        userSet.add(user.id);
      });
    });

    return userSet.size;
  }

  deleteLeader(leaderId: string) {
    console.log(leaderId)
    this.httpService.delete(`leaders/delete/${leaderId}`).subscribe({
      next: () => {
        const deletedProject = this.leaders.find((leader) => leader.id === leaderId)
        if (!deletedProject) return;
        const deletedProjectId = this.leaders.indexOf(deletedProject)
        this.leaders.splice(deletedProjectId, 1);
        this.handleSuccess()
      },
      error: (e: HttpErrorResponse) => {
        this.handleError(e);
      }
    })
  }

  deleteAllMarkedLeaders() {
    this.httpService.patch(`leaders/delete-many`, {leadersIds: this.leadersToModify}).subscribe({
      next: () => {
        this.leaders = this.leaders.filter(leader =>
          !this.leadersToModify.includes(leader.id)
        );
        this.handleSuccess()
      },
      error: (e: HttpErrorResponse) => {
        this.handleError(e);
      }
    })
  }

  editLeader(leaderId: any) {
    const leader = this.leaders.find(leader => leader.id === leaderId)
    if (!leader) return;
    const dialog = this.dialog.open(AddEditLeaderModalComponent, {width: '600px', data: {leader: leader}})
    dialog.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((results: ModalOutComeWithData) => {
      if (results.result === ModalOutcome.ABANDON) return;
      this.leaders.splice(this.leaders.indexOf(leader), 1, results.data)
      this.changeDetectorRef.detectChanges();
    })
  }

  addLeader() {
    const dialog = this.dialog.open(AddEditLeaderModalComponent, {width: '600px'})
    dialog.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((results: ModalOutComeWithData) => {
      if (results.result === ModalOutcome.ABANDON) return;
      this.leaders.push({...results.data, projects: []});
      this.changeDetectorRef.detectChanges();
    })
  }


  private handleSuccess() {
    let data: SnackbarData = {
      message: 'Operacja przebiegła pomyślnie',
      variant: "info",
      closeButton: true
    }

    this.snackbarService.snackbarFromComponent(SnackbarComponent, data)
    this.changeDetectorRef.detectChanges()
  }

  private handleError(e: HttpErrorResponse) {
    let data: SnackbarData = {
      message: 'Ups! Coś poszło nie tak :(',
      variant: "error",
      closeButton: true
    }

    this.snackbarService.snackbarFromComponent(SnackbarComponent, data)
    this.changeDetectorRef.detectChanges()
  }
}
