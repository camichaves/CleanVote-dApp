import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {NavController, ToastController} from "@ionic/angular";
import { Storage } from '@ionic/storage-angular';



@Component({
  selector: 'app-voters-login',
  templateUrl: './voters-login.page.html',
  styleUrls: ['./voters-login.page.scss'],
})
export class VotersLoginPage implements OnInit {
  usuario: any;
  pass: any;
  private addrVoting: string;
  private error: string;

  constructor( public router: NavController, public route: ActivatedRoute,
               public toastController: ToastController) { }

  async ngOnInit() {
    this.addrVoting = this.route.snapshot.paramMap.get('addrr');
    this.error = this.route.snapshot.paramMap.get('error');
    if(this.error){
      await this.presentToast();
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Ocurrio un error al obtener codigo de Votacion. El ingresado no es un email valido.',
      duration: 4000
    });
    toast.present();
  }

  async abrirGmailAuth() {
    window.location.href = "http://localhost:3001/auth/google";
    // this.router.navigateRoot('/' + this.addrVoting + '/add-vote');

  }
}
