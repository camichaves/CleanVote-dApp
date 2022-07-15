import { Component, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {Web3ConnectionsService} from "../../services/web3-connections.service";
import {AlertController, LoadingController, ToastController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-vote-status',
  templateUrl: './vote-status.page.html',
  styleUrls: ['./vote-status.page.scss'],
})
export class VoteStatusPage implements OnInit {
  codigoVotacion = "";
  nameCandidatosVotacion = [];
  votos = [];
  private addrr = '';
  private loading: HTMLIonLoadingElement;
  private vote: any;

  constructor(private authService: Web3ConnectionsService, private alertController: AlertController,
              private toastController: ToastController, public loadingController: LoadingController,
              public route: ActivatedRoute) { }

  async ngOnInit() {

    await this.presentLoading();
    this.addrr = this.route.snapshot.paramMap.get('addr');

    const checkMeta = await this.authService.checkMetaMask();

    if(checkMeta){
      await this.presentToastMetaConnected();
      this.vote = await this.authService.getVoteByVoter(this.addrr);
      if(this.vote){
        this.votos = await this.authService.getCantVotos(this.vote.candidatecount, this.addrr);
        this.nameCandidatosVotacion = await this.authService.getCandidates(this.vote.candidatecount, this.addrr, );
        this.loading.dismiss();
      }else{
      //  this.isAuthenticating = true;
        this.loading.dismiss();
      }

    }else{
      this.loading.dismiss();
      await this.presentNoMetaAlert();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Conectando con la Blockchain...'
    });
    await this.loading.present();
  }

  async presentToastMetaConnected() {
    const toast = await this.toastController.create({
      message: '¡Metamask Conectado!',
      duration: 2000
    });
    toast.present();
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

}
