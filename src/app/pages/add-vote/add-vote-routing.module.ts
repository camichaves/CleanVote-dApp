import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddVotePage } from './add-vote.page';

const routes: Routes = [
  {
    path: '',
    component: AddVotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddVotePageRoutingModule {}
