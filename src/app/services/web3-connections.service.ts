import {Injectable} from '@angular/core';
import Web3 from 'web3';
import {HttpClient, HttpHeaders} from "@angular/common/http";

declare let window: any;
const abiDecoder = require("web3-eth-abi");

interface NonceResponse {
  nonce: string;
}

interface VerifyResponse {
  token: string;
}

class RequestMailsVotacion {
  private votacionAddress: string;
  private hash: string;
  constructor(myadress: string, hash: string) {
    this.hash = hash;
    this.votacionAddress = myadress;
  }
}

@Injectable({
  providedIn: 'root'
})
export class Web3ConnectionsService {
  abi;
  private myadress = '';
  private contractAdres = '0x42787b8254d66A862806F2536F129E3c0861192A';
  private contract;
  private tieneVot: boolean = null;
  private checkVotaciones: boolean;
  private titulo: string;
  private web3: Web3;
  constructor(private httpClient: HttpClient) {
    this.abi =[
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "ownerVotacion",
            "type": "address"
          },
          {
            "internalType": "bytes32[]",
            "name": "_codigos",
            "type": "bytes32[]"
          }
        ],
        "name": "cargaCodigosVotacion",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "bytes32",
            "name": "codigoGuardado",
            "type": "bytes32"
          }
        ],
        "name": "codigoGenerado",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "bytes32",
            "name": "codigoGuardado",
            "type": "bytes32"
          }
        ],
        "name": "codigoGuardado",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "_ownerAdr",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "string[]",
            "name": "_emailsVotantes",
            "type": "string[]"
          }
        ],
        "name": "eventNewVotacion",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "_candidateid",
            "type": "uint256"
          }
        ],
        "name": "eventVote",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_titulo",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "_nameCandidatos",
            "type": "string[]"
          },
          {
            "internalType": "uint256",
            "name": "cantVotantes",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_descripcion",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "_emailsVotantes",
            "type": "string[]"
          }
        ],
        "name": "nuevaVotacion",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_candidateid",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "_codigo",
            "type": "bytes"
          },
          {
            "internalType": "address",
            "name": "_ownerAdr",
            "type": "address"
          }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "electiones",
        "outputs": [
          {
            "internalType": "string",
            "name": "titleVote",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "candidatecount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "votantecount",
            "type": "uint256"
          },
          {
            "internalType": "enum VoteCodeContract.state",
            "name": "estado",
            "type": "uint8"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "ownerAdr",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          }
        ],
        "name": "getCandidatoNombre",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "ownerAdr",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          }
        ],
        "name": "getCandidatoVotos",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];
  }
  async ethEnabled() {
    if (window.ethereum) {
      await window.ethereum.request({method: 'eth_requestAccounts'});
      window.web3 = new Web3(window.ethereum);
      return true;
    }
    return false;
  }
  private getAccounts = async () => {
    try {
        return await window.ethereum.request({ method: 'eth_accounts' });
    } catch (e) {
        return [];
    }
};
  // eslint-disable-next-line @typescript-eslint/member-ordering
  async checkMetaMask() {

    const haveMeta = await this.ethEnabled();
    if (haveMeta) {
      const provider = window.ethereum;
      let addresses = await this.getAccounts();
      console.log('service', addresses);
      if (!addresses.length) {
        try {
          addresses = await window.ethereum.enable();
        } catch (e) {
          return false;
        }
      }
      this.myadress = addresses[0];
       this.web3 = new Web3(provider);
      console.log(this.web3);
      this.contract = new this.web3.eth.Contract(this.abi, this.contractAdres);
      return true;
    }else{
      console.log('NO META');
      return false;
    }
    }


  // eslint-disable-next-line @typescript-eslint/member-ordering
  async searchVote() {

      const met = await this.contract.methods.electiones(this.myadress).call();

      if (met.owner === '0x0000000000000000000000000000000000000000') {
        return false;
      }
      this.titulo = met.titleVote;
      return true;

  }

  async postVotacion(titulo: string, descripcionVotacion: string, cantVotantesVotacion: number, nameCandidato1: string, nameCandidato2: string,
                     value: any, emails: string []) {
    console.log(value);
    let c = []; let v = []; let clav = [];
    c[0] = nameCandidato1;
    c[1] = nameCandidato2;
    const candKeys = Object.keys(value);
    if(candKeys.length > 0){
      for(let i =0; i> candKeys.length; i++){
        const d = 2 + i;
        c[d] =  value.candKeys[i];
      }
    }
    console.log(emails);
    const m =  await this.contract.methods.nuevaVotacion(titulo, c,cantVotantesVotacion, descripcionVotacion, emails).send({ from: this.myadress });
    console.log(m);

    return  m.transactionHash;
    // const p = new RequestMailsVotacion(this.myadress, m.blockHash);
    // const r = await this.httpClient.post<any>( 'http://localhost:3001/mailsvotacion', p).toPromise( (rta) => {
    //   console.log(rta);
    //   return;
    //      });


    // {
    //   "blockHash": "0xd02fb891fbe8d4027d0fda8bde217f1f88afe5660a9714e2e452586bab820635",
    //   "blockNumber": 19087460,
    //   "contractAddress": null,
    //   "cumulativeGasUsed": 753340,
    //   "from": "0xb14cafcb782b0c388cfe2122fb36f7be4844b16d",
    //   "gasUsed": 247619,
    //   "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    //   "status": true,
    //   "to": "0xf5b6598cdb353df498037e8252fbfc17f36b4048",
    //   "transactionHash": "0x0c6c9f4f1abebb78a45ef9967fd21ef2f2f41658090f9f0140afbe9022a4f949",
    //   "transactionIndex": 5,
    //   "type": "0x0",
    //   "events": {}
    // }
  }

  async getVoteByAdmin() {
    const met = await this.contract.methods.electiones(this.myadress).call();
    console.log(met);
    return met;
  }

  async getCandidates(candidatecount: number, address: string) {

    let candidatos = []  ;
    let limit = Number(candidatecount) +1;
    for(let i = 1; i< limit; i++){
      const candidate = await this.contract.methods.getCandidatoNombre(address, i).call();
      candidatos[i] = candidate;
    }
    console.log(candidatos);
    candidatos =  candidatos.filter((a) => a);
    return candidatos;
  }

  async getVoteByVoter(addrr: any) {
    const met =  await this.contract.methods.electiones(addrr).call();
    console.log(met);
    return met;
  }

  async votar(addrr: string, i: number, tkn: any) {
    const met =  await this.contract.methods.vote(i, "0x" + tkn, addrr).send({ from: this.myadress });
    console.log(met);
    return met;
  }

  async obtenerVoto(transactionHash){
    const rta = await this.web3.eth.getTransaction(transactionHash, function (error, result){console.log(result);});
   // const trans = await this.contract.events.allEvents();
    console.log(rta);
    const inputs = [
      {
        internalType: 'uint256',
        name: '_candidateid',
        type: 'uint256'
      },
      {
        internalType: 'bytes32',
        name: '_codigo',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: '_ownerAdr',
        type: 'address'
      }
    ];
    const decoded = await this.web3.eth.abi.decodeParameters(
      inputs,
      rta.input.slice(10)); // Or (11), not sure
    rta.value = await this.getCandidate(decoded[0], decoded[2]);
    return rta;

  }

  private async getCandidate(candidateiD: any, ownerAdress) {
      const candidate = await this.contract.methods.getCandidatoNombre(ownerAdress, candidateiD).call();
    console.log(candidate);
    return candidate;
  }

  async getCantVotos(candidatecount: number, addrr: string) {
    let votos = []  ;
    let limit = Number(candidatecount) +1;
    for(let i = 1; i< limit; i++){
      const voto = await this.contract.methods.getCandidatoVotos(addrr, i).call();
      votos[i] = voto;
    }
    console.log(votos);
    votos =  votos.filter((a) => a);
    return votos;
  }

  async getCandidatesByAdmin(candidatecount: any) {
    let candidatos = []  ;
    let limit = Number(candidatecount) +1;
    for(let i = 1; i< limit; i++){
      const candidate = await this.contract.methods.getCandidatoNombre(this.myadress, i).call();
      candidatos[i] = candidate;
    }
    console.log(candidatos);
    candidatos =  candidatos.filter((a) => a);
    return candidatos;
  }

   sendMailsVotacion(txn) {
    const p = new RequestMailsVotacion(this.myadress, txn);
    const r = this.httpClient.post<any>( 'http://localhost:3001/mailsvotacion', p);
    return r;
  }

}



