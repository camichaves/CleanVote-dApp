import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VotersLoginPage } from './voters-login.page';

const routes: Routes = [
  {
    path: '',
    component: VotersLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VotersLoginPageRoutingModule {}
