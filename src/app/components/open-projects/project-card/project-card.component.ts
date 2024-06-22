import {Component, Input} from '@angular/core';
import {Project} from "../../../shared/constants/project";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {

  @Input({required: true})
  project!: Project


  getDate(date: string) {
    const endDate = new Date(date)
    const day = endDate.getUTCDate()
    const month = endDate.getUTCMonth() + 1
    const year = endDate.getUTCFullYear()
    return `${day}/${month}/${year}`
  }

  getRemainingDays(date: string) {
    const endDate = new Date(date)
    const now = new Date(Date.now())
    return Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

}
