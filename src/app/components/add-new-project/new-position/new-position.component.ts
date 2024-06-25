import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-new-position',
  standalone: true,
  imports: [],
  templateUrl: './new-position.component.html',
  styleUrl: './new-position.component.scss'
})
export class NewPositionComponent {

  @Input({required: true})
  positionName!: string

}
