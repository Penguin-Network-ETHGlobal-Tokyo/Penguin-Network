import Web3 from 'web3'
import Web3Service from './web3Service'
import artifact from "../abi/ChildStatusManager.json";

const GAS_BUFFER = 10000;

export default class ChildStatusManager {
  contract: any;
  web3Service: Web3Service;

  constructor(web3Service: Web3Service, contract: any) {
    this.web3Service = web3Service;
    this.contract = contract;
  }

  static async init(web3Service: Web3Service, _address: string) {
    const networkId = await web3Service.getNetworkId();
    const contract = await web3Service.getContract(artifact.abi, _address);
    return new ChildStatusManager(web3Service, contract);
  }

  async getSlashStatus() {
    try {
      const tx = await this.contract.methods.getSlashStatus().call();
      return tx;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}

