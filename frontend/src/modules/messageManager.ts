import Web3 from 'web3'
import Web3Service from './web3Service'
import artifact from "../abi/MessageManager.json";

const GAS_BUFFER = 10000;

export default class MessageManager {
  contract: any;
  web3Service: Web3Service;

  constructor(web3Service: Web3Service, contract: any) {
    this.web3Service = web3Service;
    this.contract = contract;
  }

  static async init(web3Service: Web3Service, _address: string) {
    const networkId = await web3Service.getNetworkId();
    const contract = await web3Service.getContract(artifact.abi, _address);
    return new MessageManager(web3Service, contract);
  }

  async setRelayMessage(_destChainId: number, _to: string, _message: string) {
    try {
      const gas = await this.contract.methods.setRelayMessage(_destChainId, _to, _message).estimateGas({ from: this.web3Service.getSelectedAddress()});
      const gasPrice = await this.web3Service.getGasPrice();
      let txObj = { 
          from: this.web3Service.getSelectedAddress(), 
          gas: gas + GAS_BUFFER, 
          gasPrice: gasPrice
      } as any;

      txObj = await this.web3Service.addGasPriceToTxObject(txObj);

      const tx = await this.contract.methods.setRelayMessage(_destChainId, _to, _message).
        send(txObj);
      return tx;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}

