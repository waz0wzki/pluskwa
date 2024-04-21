import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SettingsComponent } from './settings/settings.component';
import { SearchComponent } from './search/search.component';
import { LearnComponent } from './learn/learn.component';
import { EditWordComponent } from './edit-word/edit-word.component';


const routes: Routes = [
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'learn',
    component: LearnComponent
  },
  {
    path: 'edit-word',
    component: EditWordComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
 }
