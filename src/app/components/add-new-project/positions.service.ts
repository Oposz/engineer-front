import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

export interface DefinedPosition {
  id?: string
  name: string
  quantity: number
}

@Injectable({
  providedIn: 'root'
})
export class PositionsService {

  renewData$: Subject<void> = new Subject();
  private positions: DefinedPosition[] = [];

  constructor() {
  }

  getProjectPositions() {
    return this.positions;
  }

  setAlreadyDefinedPositions(positions: DefinedPosition[]) {
    this.positions = positions.map((position) => ({id: position.id, name: position.name, quantity: position.quantity}))
    this.renewData$.next()
  }

  addNewPosition(name: string) {
    const duplicate = this.positions.find((position) => position.name === name)
    if (duplicate) {
      duplicate.quantity++;
      return;
    }
    this.positions.push({name, quantity: 1})
  }

  increaseQuantity(name: string) {
    const position = this.positions.find((position) => position.name === name)
    if (!position) return;
    position.quantity++
  }

  decreaseQuantity(name: string) {
    const position = this.positions.find((position) => position.name === name)
    if (!position) return;
    if (position.quantity === 1) {
      this.positions = this.positions.filter((_position) => _position.name !== position.name)
      this.renewData$.next()
    }
    position.quantity--
  }

  resetService() {
    this.positions = [];
  }
}
