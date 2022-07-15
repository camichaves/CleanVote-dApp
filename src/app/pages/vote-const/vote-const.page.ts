import { Component, OnInit } from '@angular/core';
import {Web3ConnectionsService} from "../../services/web3-connections.service";
import {ActivatedRoute} from "@angular/router";
import {AlertController, LoadingController, ToastController} from "@ionic/angular";

@Component({
  selector: 'app-vote-const',
  templateUrl: './vote-const.page.html',
  styleUrls: ['./vote-const.page.scss'],
})
export class VoteConstPage implements OnInit {
  private loading: HTMLIonLoadingElement;
  voto = null;
   hash: string;

  constructor( public route: ActivatedRoute, private authService: Web3ConnectionsService, public loadingController: LoadingController,
               private toastController: ToastController,private alertController: AlertController) { }

  async ngOnInit() {
    await this.presentLoading();
    this.hash = this.route.snapshot.paramMap.get('hashtrans');
    const checkMeta = await this.authService.checkMetaMask();
    if(checkMeta){
      await this.presentToastMetaConnected();
      this.voto = await this.authService.obtenerVoto(this.hash);
      this.loading.dismiss();
    }else{
      this.loading.dismiss();
      await this.presentNoMetaAlert();
      // this.vista = '';
    }
  }


  async presentNoMetaAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Necesitas Metamask para utilizar CleanVote',
      subHeader: 'Por favor, instala metamask y recarga la pagina',
      backdropDismiss: false
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }


  async presentToastMetaConnected() {
    const toast = await this.toastController.create({
      message: '¡Metamask Conectado!',
      duration: 2000
    });
    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Conectando con la Blockchain...'
    });
    await this.loading.present();
  }

}
