import { Component, OnInit } from '@angular/core';
import {Web3ConnectionsService} from "../../services/web3-connections.service";
import {AlertController, LoadingController, NavController, ToastController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-add-vote',
  templateUrl: './add-vote.page.html',
  styleUrls: ['./add-vote.page.scss'],
})
export class AddVotePage implements OnInit {

  private loading: HTMLIonLoadingElement;
  nameCandidatosVotacion = [];
  voterToken = '';
  private addrr: string;
  constructor(private authService: Web3ConnectionsService, private alertController: AlertController,
              private toastController: ToastController, public loadingController: LoadingController, public storage: Storage,
              public route: ActivatedRoute,  public router: NavController) { }

  async ngOnInit() {
    await this.presentLoading();
    await this.storage.create();
    this.voterToken = this.route.snapshot.paramMap.get('codTkn');
    this.addrr = this.route.snapshot.paramMap.get('addr');
    const checkMeta = await this.authService.checkMetaMask();

    if(checkMeta){
      await this.presentToastMetaConnected();
      const votacionInfo = await this.authService.getVoteByVoter( this.addrr);
      if(votacionInfo){
        this.nameCandidatosVotacion = await this.authService.getCandidates(votacionInfo.candidatecount, this.addrr);
        if(this.voterToken){
          this.loading.dismiss();
        }else{
          this.loading.dismiss();
          await this.presentNoTokenToVote();
        }
      }else{
        this.loading.dismiss();
        await this.presentNoVoteByAddress();
      }

    }else{
      this.loading.dismiss();
      await this.presentNoMetaAlert();
      // this.vista = '';
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Conectando con la Blockchain...'
    });
    await this.loading.present();
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

  private async presentNoVoteByAddress() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'No existe una Votacion Vigente para ese código.',
      subHeader: 'Por favor, revisalo y escribelo nuevamente',
      backdropDismiss: false
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  private async presentNoTokenToVote() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'No tienes token para votar!.',
      subHeader: 'Por favor, ingresa nuevamente al link de Votacion para Autenticarte',
      backdropDismiss: false
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async votar(i: any) {
    await this.presentAlertConfirmVote(i);
  }

  async presentAlertConfirmVote(i: number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Confirmas tu Voto a ' + this.nameCandidatosVotacion[i] +' ?',
      message: 'Esta acción no se puede deshacer.',

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          id: 'confirm-button',
          handler: async () => {
            console.log('Confirm Okay');
            await this.presentLoading();
            const result = await this.authService.votar(this.addrr, i, this.voterToken);
            if (result.transactionHash != undefined){
              this.loading.dismiss();
              this.router.navigateRoot('/vote-const/' + result.transactionHash);
            }else{
              this.loading.dismiss();
              await this.presentErrorVoting()
            }
          }
        }
      ]
    });

    await alert.present();
  }

  private async presentErrorVoting() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Hubo un error al cargar tu voto.',
      subHeader: 'Por favor, recarga la pagina e intenta nuevamente',
      backdropDismiss: false
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
