import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'your-teams'
  },
  {
    path: 'your-teams', loadComponent: () => import('./components/your-teams/your-teams.component')
      .then(m => m.YourTeamsComponent)
  },
  {
    path: 'open-projects', loadComponent: () => import('./components/open-projects/open-projects.component')
      .then(m => m.OpenProjectsComponent)
  },
  {
    path: 'new-project', loadComponent: () => import('./components/add-new-project/add-new-project.component')
      .then(m => m.AddNewProjectComponent),
  },
  {
    path: 'universities', loadComponent: () => import('./components/universities/universities.component')
      .then(m => m.UniversitiesComponent)
  },
  {
    path: 'calendar', loadComponent: () => import('./components/calendar/calendar.component')
      .then(m => m.CalendarComponent)
  },
  {
    path: 'cards', loadComponent: () => import('./components/business-cards/business-cards.component')
      .then(m => m.BusinessCardsComponent)
  },
  {
    path: 'chat', loadComponent: () => import('./components/chat/chat.component')
      .then(m => m.ChatComponent)
  },
];
