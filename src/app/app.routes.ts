import {Routes} from '@angular/router';
import {authGuard} from "./guards/auth.guard";
import {MainAppComponent} from "./components/main-app/main-app.component";
import {AdminPanelComponent} from "./components/admin-panel/admin-panel.component";
import {adminGuard} from "./guards/admin.guard";

export const routes: Routes = [
  {
    path: 'auth', loadComponent: () => import('./components/authorization-screen/authorization-screen.component')
      .then(m => m.AuthorizationScreenComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    component: MainAppComponent,
    children: [
      {
        path: '',
        redirectTo: 'teams',
        pathMatch: 'full'
      },
      {
        path: 'teams', loadComponent: () => import('./components/your-teams/your-teams.component')
          .then(m => m.YourTeamsComponent)
      },
      {
        path: 'profile', loadComponent: () => import('./components/profile/profile.component')
          .then(m => m.ProfileComponent)
      },
      {
        path: 'teams/:id', loadComponent: () => import('./components/project-details/project-details.component')
          .then(m => m.ProjectDetailsComponent)
      },
      {
        path: 'projects', loadComponent: () => import('./components/open-projects/open-projects.component')
          .then(m => m.OpenProjectsComponent)
      },
      {
        path: 'projects/new-project',
        loadComponent: () => import('./components/add-new-project/add-new-project.component')
          .then(m => m.AddNewProjectComponent),
      },
      {
        path: 'projects/edit-project/:id',
        canActivate: [adminGuard],
        loadComponent: () => import('./components/edit-project/edit-project.component')
          .then(m => m.EditProjectComponent),
      },
      {
        path: 'projects/:id', loadComponent: () => import('./components/project-details/project-details.component')
          .then(m => m.ProjectDetailsComponent),
      },
      {
        path: 'universities', loadComponent: () => import('./components/universities/universities.component')
          .then(m => m.UniversitiesComponent)
      },
      {
        path: 'universities/:id', loadComponent: () => import('./components/university-view/university-view.component')
          .then(m => m.UniversityViewComponent)
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
        path: 'chats', loadComponent: () => import('./components/chat/chat.component')
          .then(m => m.ChatComponent)
      },
      {
        path: 'chats/:id',
        loadComponent: () => import('./components/chat/conversation-view/conversation-view.component')
          .then(m => m.ConversationViewComponent)
      },
      {
        path: 'panel',
        canActivate: [adminGuard],
        children: [
          {
            path: '',
            component: AdminPanelComponent,
          }
        ]
      }
    ]
  }
];
