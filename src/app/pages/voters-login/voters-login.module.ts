import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VotersLoginPageRoutingModule } from './voters-login-routing.module';

import { VotersLoginPage } from './voters-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VotersLoginPageRoutingModule
  ],
  declarations: [VotersLoginPage]
})
export class VotersLoginPageModule {}
