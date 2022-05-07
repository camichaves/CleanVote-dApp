import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
declare let window: any;

interface NonceResponse {
  nonce: string;
}

interface VerifyResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AutMetaService {
  abi;
  private myadress = '';
  private contractAdres = '0xb6750D9B7C0B66ee71A746aa15E96d855931F61c';
  private contract;
  private tieneVot: boolean = null;
  private checkVotaciones: boolean;
  private titulo: any;
  constructor() {}
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

    this.abi =[
      {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'uint256',
            name: '_candidateid',
            type: 'uint256'
          }
        ],
        name: 'eventVote',
        type: 'event'
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address'
          }
        ],
        name: 'electiones',
        outputs: [
          {
            internalType: 'string',
            name: 'titleVote',
            type: 'string'
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'candidatecount',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'votantecount',
            type: 'uint256'
          }
        ],
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'ownerAdr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256'
          }
        ],
        name: 'getCandidatoNombre',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string'
          }
        ],
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'ownerAdr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256'
          }
        ],
        name: 'getCandidatoVotos',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256'
          }
        ],
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [
          {
            internalType: 'string',
            name: '_titulo',
            type: 'string'
          },
          {
            internalType: 'string[]',
            name: '_nameCandidatos',
            type: 'string[]'
          },
          {
            internalType: 'string[]',
            name: '_nameVotantes',
            type: 'string[]'
          },
          {
            internalType: 'string[]',
            name: '_clavesVotantes',
            type: 'string[]'
          }
        ],
        name: 'nuevaVotacion',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [],
        name: 'pruebaF',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256'
          }
        ],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_candidateid',
            type: 'uint256'
          },
          {
            internalType: 'string',
            name: '_claveVotante',
            type: 'string'
          },
          {
            internalType: 'address',
            name: 'ownerAdr',
            type: 'address'
          }
        ],
        name: 'vote',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ];

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
      const web3 = new Web3(provider);
      console.log(web3);
      this.contract = new web3.eth.Contract(this.abi, this.contractAdres);

      const met = await this.contract.methods.electiones(this.myadress).call();

      if (met.owner === '0x0000000000000000000000000000000000000000') {
        this.tieneVot = false;
        this.checkVotaciones = true;
      } else {
        this.titulo = met.titleVote;
        this.checkVotaciones = true;

      }
    }else{
      console.log('NO META');
    }
    }
  }



