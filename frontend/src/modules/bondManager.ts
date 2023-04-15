import Web3 from 'web3'
import Web3Service from './web3Service'
import bondManagerArtifact from "../abi/BondManager.json";

const GAS_BUFFER = 10000;

export default class BondManager {
  contract: any;
  web3Service: Web3Service;

  constructor(web3Service: Web3Service, contract: any) {
    this.web3Service = web3Service;
    this.contract = contract;
  }

  static async init(web3Service: Web3Service, _address: string) {
    const networkId = await web3Service.getNetworkId();
    const contract = await web3Service.getContract(bondManagerArtifact.abi, _address);
    return new BondManager(web3Service, contract);
  }

  async deposit(_amount: number, _isPoolDeposit:boolean) {
    try {
      const gas = await this.contract.methods.deposit(_amount, _isPoolDeposit).estimateGas({ from: this.web3Service.getSelectedAddress(), value: _amount });
      const gasPrice = await this.web3Service.getGasPrice();
      let txObj = { 
          from: this.web3Service.getSelectedAddress(), 
          gas: gas + GAS_BUFFER, 
          gasPrice: gasPrice ,
          value: _amount
      } as any;

      txObj = await this.web3Service.addGasPriceToTxObject(txObj);

      const tx = await this.contract.methods.deposit(_amount, _isPoolDeposit).
        send(txObj);
      return tx;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async addNetwork(_chainId: number) {
    try {
      const gas = await this.contract.methods.addNetwork(_chainId).estimateGas({ from: this.web3Service.getSelectedAddress() });
      const gasPrice = await this.web3Service.getGasPrice();
      let txObj = { 
          from: this.web3Service.getSelectedAddress(), 
          gas: gas + GAS_BUFFER, 
          gasPrice: gasPrice ,
      } as any;

      txObj = await this.web3Service.addGasPriceToTxObject(txObj);
      const tx = this.contract.methods.addNetwork(_chainId).
        send(txObj);
      return tx;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async getBond() {
    try {
      const tx = await this.contract.methods.getBond().call();
      return tx;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async owner() {
    try {
      const tx = await this.contract.methods.owner().call();
      return tx;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async getExpireDate() {
    try {
      const tx = await this.contract.methods.getExpireDate().call();
      return tx;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async getAllAvailableNetworks() {
    try {
      const tx = await this.contract.methods.getAllAvailableNetworks().call();
      return tx;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async isAvailableNetwork(_chainId: number) {
    try {
      const tx = await this.contract.methods.isAvailableNetwork(_chainId).call();
      return tx;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async getRootStatusManagerAddress() {
    try {
      const tx = await this.contract.methods.getRootStatusManagerAddress().call();
      return tx;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }


}

