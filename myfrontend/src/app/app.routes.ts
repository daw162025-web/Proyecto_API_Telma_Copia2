import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';
import { adminGuard } from './auth/admin-guard';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { ProfileComponent } from './pages/profile/profile';
import { ListComponent } from './pages/list-component/list-component';
import { CreateComponent } from './pages/create-component/create-component';
import { EditComponent } from './pages/edit-component/edit-component';
import { ShowComponent } from './pages/show-component/show-component';
import { HomeComponent } from './home/home-component/home-component';
import { MyPetitionsComponent } from './pages/mypetitions-component/mypetitions-component';
import { MySignaturesComponent } from './pages/my-signatures/my-signatures';
import { PanelComponent } from './admin/panel/panel';
import {AdminShowPetition} from './admin/petitions/admin-show-petition/admin-show-petition'
import {AdminEditPetitionComponent} from './admin/petitions/admin-edit-petition/admin-edit-petition'

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'petitions', component: ListComponent },
  { path: 'petitions/mysignatures', component: MySignaturesComponent, canActivate: [authGuard] },
  { path: 'petitions/create', component: CreateComponent, canActivate: [authGuard] },
  { path: 'petitions/edit/:id', component: EditComponent, canActivate: [authGuard] },
  { path: 'petitions/:id', component: ShowComponent }, // Detalle público

  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'mypetitions', component: MyPetitionsComponent, canActivate: [authGuard] },

  { 
    path: 'admin', 
    component: PanelComponent, 
    canActivate: [adminGuard] 
  },
  {
    path: 'admin/petitions/:id',
    component: AdminShowPetition,
    canActivate: [adminGuard]
    },
    {
    path: 'admin/petitions/edit/:id',
    component: AdminEditPetitionComponent,
    canActivate: [adminGuard]
    },
   


  { path: '**', redirectTo: '' }
];
