import { RoutesService, eLayoutType } from '@abp/ng.core';
import { APP_INITIALIZER } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService], multi: true },
];

function configureRoutes(routes: RoutesService) {
  return () => {
    routes.add([
      {
        path: '/',
        name: '::Menu:Home',
        iconClass: 'fas fa-home',
        order: 1,
        layout: eLayoutType.application,
      },
      {
        path: '/exercises',
        name: 'Exercises',
        iconClass: 'fas fa-dumbbell',
        order: 2,
        layout: eLayoutType.application,
      },
      {
  path: '/muscle-groups',
  name: 'Muscle Groups',
  iconClass: 'fas fa-users', // istediğin bir ikon
  order: 3,
  layout: eLayoutType.application,
},
{
  path: '/workouts',
  name: 'Workouts',
  iconClass: 'fas fa-dumbbell',
  order: 4,
  layout: eLayoutType.application,
},
{
  path: '/meals',
  name: 'Meals',
  iconClass: 'fas fa-utensils',
  order: 5,
  layout: eLayoutType.application,
},
{
  path: '/meal-logs',
  name: 'Daily Meal',
  iconClass: 'fas fa-utensils',
  order: 6,
  layout: eLayoutType.application,
}


    ]);
  };
}
