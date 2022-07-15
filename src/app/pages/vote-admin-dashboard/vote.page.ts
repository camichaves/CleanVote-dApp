import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Web3ConnectionsService } from 'src/app/services/web3-connections.service';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';


@Component({
  selector: 'app-vote',
  templateUrl: './vote.page.html',
  styleUrls: ['./vote.page.scss'],
})

export class VotePage implements OnInit {

  titulo = '';
  vista = '';

  tituloVotacion;
  descripcionVotacion;
  cantVotantesVotacion;
  nameCandidatosVotacion = [];
  nameCandidato1;
  nameCandidato2;

  public myForm: FormGroup;
  candidatesCount = 2;
  isAuthenticating: boolean;
  private loading: HTMLIonLoadingElement;
  vote;
  emailsVotantes = [];

  constructor(private formBuilder: FormBuilder, private authService: Web3ConnectionsService, private alertController: AlertController,
              private toastController: ToastController, public loadingController: LoadingController) {
    this.myForm = formBuilder.group({
    });
   }

  async ngOnInit() {

    await this.presentLoading();
    const checkMeta = await this.authService.checkMetaMask();

    if(checkMeta){
      await this.presentToastMetaConnected();
      const checkVotacion = await this.authService.searchVote();
      if(checkVotacion){
       this.vote = await this.authService.getVoteByAdmin();
       this.nameCandidatosVotacion = await this.authService.getCandidatesByAdmin(this.vote.candidatecount);
        this.titulo = 'Votacion Actual';
        this.vista = 'existente';
        console.log(this.vote.titleVote);

        this.loading.dismiss();
      }else{
        this.vista = 'nueva';
        this.titulo = 'Nueva Votacion';
        this.isAuthenticating = true;
        this.loading.dismiss();
      }

    }else{
      this.loading.dismiss();
     await this.presentNoMetaAlert();
      this.vista = '';
    }

  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Conectando con la Blockchain...'
    });
    await this.loading.present();
  }

  async crearVotacion(){
    await this.presentLoading();
    const txr = await this.authService.postVotacion(this.tituloVotacion, this.descripcionVotacion, this.cantVotantesVotacion, this.nameCandidato1,
      this.nameCandidato2, this.myForm.value, this.emailsVotantes);
    this.authService.sendMailsVotacion(txr).subscribe((r) => {
      this.loading.dismiss();
      location.reload();
    });
  }

  addControl(){
    this.candidatesCount++;
    this.myForm.addControl('candidato' + this.candidatesCount, new FormControl('', Validators.required));
  }

  removeControl(control){
    this.myForm.removeControl(control.key);
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

  async testBackend(){
  }


}
