import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoteConstPageRoutingModule } from './vote-const-routing.module';

import { VoteConstPage } from './vote-const.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoteConstPageRoutingModule
  ],
  declarations: [VoteConstPage]
})
export class VoteConstPageModule {}
