import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AutMetaService } from 'src/app/services/aut-meta.service';


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
  candidatesCount = 1;
  isAuthenticating: boolean;

  constructor(private formBuilder: FormBuilder, private authService: AutMetaService) {
    this.myForm = formBuilder.group({
    });
   }

  ngOnInit() {

    this.authService.checkMetaMask();

    this.vista = 'nueva';
    this.titulo = 'Nueva Votacion';
    this.isAuthenticating = true;
  }

  crearVotacion() {
    console.log(this.tituloVotacion);

  }

  addControl(){
    this.candidatesCount++;
    this.myForm.addControl('candidato' + this.candidatesCount, new FormControl('', Validators.required));
  }

  removeControl(control){
    this.myForm.removeControl(control.key);
  }

}
