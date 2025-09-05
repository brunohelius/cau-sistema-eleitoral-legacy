import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsuariosListComponent } from './components/usuarios/usuarios-list/usuarios-list.component';
import { UsuariosFormComponent } from './components/usuarios/usuarios-form/usuarios-form.component';
import { EleicoesListComponent } from './components/eleicoes/eleicoes-list/eleicoes-list.component';
import { EleicoesFormComponent } from './components/eleicoes/eleicoes-form/eleicoes-form.component';
import { ChapaListComponent } from './components/chapas/chapa-list/chapa-list.component';
import { ChapaFormComponent } from './components/chapas/chapa-form/chapa-form.component';

// Guards
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // Rotas protegidas
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      
      // Usuários
      { path: 'usuarios', component: UsuariosListComponent },
      { path: 'usuarios/novo', component: UsuariosFormComponent },
      { path: 'usuarios/editar/:id', component: UsuariosFormComponent },
      
      // Eleições
      { path: 'eleicoes', component: EleicoesListComponent },
      { path: 'eleicoes/nova', component: EleicoesFormComponent },
      { path: 'eleicoes/editar/:id', component: EleicoesFormComponent },
      
      // Chapas
      { path: 'chapas', component: ChapaListComponent },
      { path: 'chapas/:eleicaoId', component: ChapaListComponent },
      { path: 'chapas/nova/:eleicaoId', component: ChapaFormComponent },
      { path: 'chapas/editar/:id', component: ChapaFormComponent },
    ]
  },
  
  // Wildcard route - deve ser a última
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }