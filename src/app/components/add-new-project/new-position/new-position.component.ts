import {Component, inject, Input} from '@angular/core';
import {PositionsService} from "../positions.service";

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
  @Input({required: true})
  quantity!: number

  private positionsService = inject(PositionsService)

  increase() {
    this.positionsService.increaseQuantity(this.positionName)
  }

  decrease() {
    this.positionsService.decreaseQuantity(this.positionName)
  }
}
