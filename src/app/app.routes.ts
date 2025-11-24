import { Routes } from '@angular/router';
import { ApiExampleComponent } from './examples/api-example.component';

export const routes: Routes = [
  {
    path: 'api-example',
    component: ApiExampleComponent,
    title: 'API Integration Example'
  },
  {
    path: '',
    redirectTo: '/api-example',
    pathMatch: 'full'
  }
];
