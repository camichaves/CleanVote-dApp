import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoteStatusPageRoutingModule } from './vote-status-routing.module';

import { VoteStatusPage } from './vote-status.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoteStatusPageRoutingModule
  ],
  declarations: [VoteStatusPage]
})
export class VoteStatusPageModule {}
