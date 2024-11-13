import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/client/client.component').then((c) => c.ClientComponent),
  },
  {
    path: 'developer',
    loadComponent: () =>
      import('./pages/developer/developer.component').then(
        (c) => c.DeveloperComponent,
      ),
  },
];
