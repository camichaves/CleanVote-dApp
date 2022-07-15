import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'vote',
    pathMatch: 'full'
  },
  {
    path: 'vote',
    loadChildren: () => import('./pages/vote-admin-dashboard/vote.module').then(m => m.VotePageModule)
  },
  {
    path: 'vote-status/:addr',
    loadChildren: () => import('./pages/vote-status/vote-status.module').then( m => m.VoteStatusPageModule)
  },
  {
    path: 'add-vote/:addr/:codTkn',
    loadChildren: () => import('./pages/add-vote/add-vote.module').then( m => m.AddVotePageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./pages/landing/landing.module').then( m => m.LandingPageModule)
  },
  {
    path: ':addrr/voter',
    loadChildren: () => import('./pages/voters-login/voters-login.module').then( m => m.VotersLoginPageModule)
  },
  {
    path: ':addrr/voter/:error',
    loadChildren: () => import('./pages/voters-login/voters-login.module').then( m => m.VotersLoginPageModule)
  },
  {
    path: 'vote-const/:hashtrans',
    loadChildren: () => import('./pages/vote-const/vote-const.module').then( m => m.VoteConstPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules , useHash: true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
