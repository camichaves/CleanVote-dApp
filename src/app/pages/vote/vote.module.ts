import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VotePageRoutingModule } from './vote-routing.module';

import { VotePage } from './vote.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VotePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [VotePage]
})
export class VotePageModule {}
