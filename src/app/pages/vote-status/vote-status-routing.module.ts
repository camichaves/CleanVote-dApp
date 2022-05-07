import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoteStatusPage } from './vote-status.page';

const routes: Routes = [
  {
    path: '',
    component: VoteStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoteStatusPageRoutingModule {}
