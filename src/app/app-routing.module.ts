import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'vote',
    loadChildren: () => import('./pages/vote/vote.module').then( m => m.VotePageModule)
  },
  {
    path: 'vote-status',
    loadChildren: () => import('./pages/vote-status/vote-status.module').then( m => m.VoteStatusPageModule)
  },
  {
    path: 'add-vote',
    loadChildren: () => import('./pages/add-vote/add-vote.module').then( m => m.AddVotePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
