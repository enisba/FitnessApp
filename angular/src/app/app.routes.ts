import { Routes } from '@angular/router';
import { MuscleGroupComponent } from './muscle-group/muscle-group.component';
import { WorkoutComponent } from './workout/workout.component'; 


export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./home/home.routes').then(m => m.homeRoutes),
  },
  
  {
    path: 'account',
    loadChildren: () => import('@abp/ng.account').then(m => m.createRoutes()),
  },
  {
    path: 'identity',
    loadChildren: () => import('@abp/ng.identity').then(m => m.createRoutes()),
  },
  {
    path: 'tenant-management',
    loadChildren: () =>
      import('@abp/ng.tenant-management').then(m => m.createRoutes()),
  },
  {
    path: 'setting-management',
    loadChildren: () =>
      import('@abp/ng.setting-management').then(m => m.createRoutes()),
  },
  {
    path: 'exercises',
    loadComponent: () =>
      import('./exercise/exercise.component').then(m => m.ExerciseComponent),
  },
  { path: 'muscle-groups', component: MuscleGroupComponent },
  {
    path: 'workouts',
    loadComponent: () =>
      import('./workout/workout.component').then(m => m.WorkoutComponent), // ✅ yeni route
  },

  {
  path: 'meals',
  loadComponent: () =>
    import('./meal/meal.component').then(m => m.MealComponent),
}

];
