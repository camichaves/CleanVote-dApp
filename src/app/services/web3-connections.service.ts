import {Injectable, OnInit} from '@angular/core';
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
export class Web3ConnectionsService {
  abi;
  private myadress = '';
  private contractAdres = '0xf5B6598cdB353Df498037e8252Fbfc17F36b4048';
  private contract;
  private tieneVot: boolean = null;
  private checkVotaciones: boolean;
  private titulo: string;
  private web3: Web3;
  constructor() {
    this.abi =[
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
            name: 'ownerVotacion',
            type: 'address'
          },
          {
            internalType: 'bytes32',
            name: '_codigos',
            type: 'bytes32'
          }
        ],
        name: 'cargaCodigosVotacion',
        outputs: [],
        stateMutability: 'nonpayable',
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
            internalType: 'uint256',
            name: 'cantVotantes',
            type: 'uint256'
          },
          {
            internalType: 'string',
            name: '_descripcion',
            type: 'string'
          }
        ],
        name: 'nuevaVotacion',
        outputs: [],
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
            internalType: 'bytes32',
            name: '_codigo',
            type: 'bytes32'
          },
          {
            internalType: 'address',
            name: '_ownerAdr',
            type: 'address'
          }
        ],
        name: 'vote',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor'
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
          },
          {
            internalType: 'enum VoteCodeContract.state',
            name: 'estado',
            type: 'uint8'
          },
          {
            internalType: 'string',
            name: 'description',
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
      return true;
    }else{
      console.log('NO META');
      return false;
    }
    }


  // eslint-disable-next-line @typescript-eslint/member-ordering
  async searchVote() {
      this.contract = new this.web3.eth.Contract(this.abi, this.contractAdres);

      const met = await this.contract.methods.electiones(this.myadress).call();

      if (met.owner === '0x0000000000000000000000000000000000000000') {
        return false;
      }
      this.titulo = met.titleVote;
      return true;

  }

  async postVotacion(titulo: string, descripcionVotacion: string, cantVotantesVotacion: number, nameCandidato1: string, nameCandidato2: string,
                     value: any) {
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
    const m =  await this.contract.methods.nuevaVotacion(titulo, c,cantVotantesVotacion, descripcionVotacion).send({ from: this.myadress });
    console.log(m);

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
}



