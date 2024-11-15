import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {ChangePasswordModalComponent} from "../../profile/change-password-modal/change-password-modal.component";
import {ModalOutcome} from "../../../shared/constants/modalOutcome";
import {NgOptimizedImage} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";


interface AddSponsorGroup {
  name: FormControl<string>
  description: FormControl<string | null>
  photo: FormControl<File | null>
}

@Component({
  selector: 'app-add-sponsor-modal',
  standalone: true,
  imports: [
    MatDialogClose,
    NgOptimizedImage,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-sponsor-modal.component.html',
  styleUrl: './add-sponsor-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddSponsorModalComponent {
  newSponsorFormGroup: FormGroup<AddSponsorGroup> = new FormGroup({
    name: new FormControl('', {nonNullable: true, validators: [Validators.required], updateOn: "blur"}),
    description: new FormControl(''),
    photo: new FormControl<File | null>(null, Validators.required)
  })
  validationInProgress = false;

  readonly dialogRef = inject(MatDialogRef<ChangePasswordModalComponent>);
  readonly ModalOutcome = ModalOutcome

  getGroupControls() {
    return this.newSponsorFormGroup.controls
  }

  uploadImage(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    this.newSponsorFormGroup.controls.photo.setValue(files[0])
  }

  injectSponsorToProjectDraft() {
    if (!this.newSponsorFormGroup.valid) {
      this.newSponsorFormGroup.markAllAsTouched()
      this.validationInProgress = true;
      return;
    }
    this.dialogRef.close({
      result: ModalOutcome.SUCCESS,
      data: this.newSponsorFormGroup.value
    })
  }
}
