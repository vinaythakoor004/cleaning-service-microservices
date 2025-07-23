import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { ServicesComponent } from './services/services.component';
import { BookServiceComponent } from './services/book-service/book-service.component';
import { PlansComponent } from './plans/plans.component';
import { LoginComponent } from './login/login.component';
import { RouteGuardService } from './common/service/route-guard/route-guard.service';
import { PageNotFoundComponent } from './common/component/page-not-found/page-not-found.component';
import { BookAppointmentComponent } from './services/book-service/book-appointment/book-appointment.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ExampleComponent } from './example/example.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, canActivate: [RouteGuardService] },
      { path: 'ex', component: ExampleComponent, canActivate: [RouteGuardService] },
      {
        path: 'services', canActivate: [RouteGuardService],
        children: [
          { path: '', component: ServicesComponent },
          {
            path: 'book-service', canActivate: [RouteGuardService],
            children: [
              {
                path: '', canActivate: [RouteGuardService],
                component: BookServiceComponent,
              },
              {
                path: 'appointment', canActivate: [RouteGuardService],
                loadComponent: () => import('./services/book-service/book-appointment/book-appointment.component').then(m => m.BookAppointmentComponent),
              },
            ],
          },
        ],
      },
      { path: 'plans', canActivate: [RouteGuardService],
        children: [
          { path: '', component: PlansComponent },
          { path: 'checkout', component: CheckoutComponent, canActivate: [RouteGuardService] },
        ]
       },
      { path: 'contact', component: ContactComponent, canActivate: [RouteGuardService] },
      { path: 'about', component: AboutComponent, canActivate: [RouteGuardService] },
      { path: 'login', component: LoginComponent },
      { path: '**', component: PageNotFoundComponent }

    ],
  },
];
