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

  async deposit(_amount: number) {
    try {
      const gas = await this.contract.methods.deposit(_amount).estimateGas({ from: this.web3Service.getSelectedAddress(), value: _amount });
      const gasPrice = await this.web3Service.getGasPrice();
      const tx = this.contract.methods.deposit(_amount).
        send({ 
            from: this.web3Service.getSelectedAddress(), 
            gas: gas + GAS_BUFFER, 
            gasPrice: gasPrice ,
            value: _amount
        });
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


  /*async newTrade(
    _amount: number,
    _recipient: string,
    _fee: number,
    _tokenTypeIndex: number,
    networkId: number
  ) {
    try {
      let tx;
      if (networkId == 80001 || networkId == 137) {
        const gas = await this.contract.methods.newTrade(_amount, _recipient, _fee, _tokenTypeIndex).estimateGas({ from: this.web3Service.getSelectedAddress() });
        let txObj = {
          from: this.web3Service.getSelectedAddress(),
          gas: gas + GAS_BUFFER,
        } as any;

        txObj = await this.web3Service.addGasPriceToTxObject(txObj);
        tx = await this.contract.methods.newTrade(_amount, _recipient, _fee, _tokenTypeIndex).
          send(txObj);
      } else {
        const gas = await this.contract.methods.newTrade(
          _amount, _recipient, _fee, _tokenTypeIndex
        ).estimateGas({
          from: this.web3Service.getSelectedAddress(),
          value: _amount
        });
        let txObj = {
          from: this.web3Service.getSelectedAddress(),
          value: _amount,
          gas: gas + GAS_BUFFER,
        } as any;

        txObj = await this.web3Service.addGasPriceToTxObject(txObj);
        tx = await this.contract.methods.newTrade(
          _amount, _recipient, _fee, _tokenTypeIndex
        ).send(txObj);
      }
      console.log(tx);
      return tx;
    } catch (e: any) {
      throw new Error(e.message);
    }

  }

  async getTradeList(_address: string) {
    try {
      const tx = await this.contract.methods.getTradeList().call({ from: _address });
      console.log(tx);
      return tx;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async getTokenAddress(_tokenTypeIndex: number, _isL2: boolean) {
    try {
      const gas = await this.contract.methods.getTokenAddress(_tokenTypeIndex, _isL2).estimateGas({ from: this.web3Service.getSelectedAddress() });
      const gasPrice = await this.web3Service.getGasPrice();
      const tx = await this.contract.methods.getTokenAddress(_tokenTypeIndex, _isL2)
        .call({ from: this.web3Service.getSelectedAddress(), gas: gas + GAS_BUFFER, gasPrice: gasPrice });
      console.log(tx);
      return tx;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async cancelTrade(_index: number) {
    try {
      const gas = await this.contract.methods.cancelTrade(_index).estimateGas({ from: this.web3Service.getSelectedAddress() });
      const gasPrice = await this.web3Service.getGasPrice();
      const tx = await this.contract.methods.cancelTrade(_index).
        send({ from: this.web3Service.getSelectedAddress(), gas: gas + GAS_BUFFER, gasPrice: gasPrice });
      console.log(tx);
      return tx;
    } catch (e: any) {
      throw new Error(e.message);
    }

  }

  async dispute(_user: string, _index: number) {
    try {
      const gas = await this.contract.methods.dispute(_user, _index).estimateGas({ from: this.web3Service.getSelectedAddress() });
      const gasPrice = await this.web3Service.getGasPrice();
      const tx = await this.contract.methods.dispute(_user, _index).
        send({ from: this.web3Service.getSelectedAddress(), gas: gas + GAS_BUFFER, gasPrice: gasPrice });
      console.log(tx);
      return tx;
    } catch (e: any) {
      throw new Error(e.message);
    }

  }

  async slash(_index: number) {
    try {
      const gas = await this.contract.methods.slash(_index).estimateGas({ from: this.web3Service.getSelectedAddress() });
      const gasPrice = await this.web3Service.getGasPrice();
      const tx = await this.contract.methods.slash(_index).
        send({ from: this.web3Service.getSelectedAddress(), gas: gas + GAS_BUFFER, gasPrice: gasPrice });
      console.log(tx);
      return tx;
    } catch (e: any) {
      throw new Error(e.message);
    }

  }



  async bid(_user: string, _index: number) {
    try {
      const gas = await this.contract.methods.bid(_user, _index).estimateGas({ from: this.web3Service.getSelectedAddress() });
      const gasPrice = await this.web3Service.getGasPrice();
      const tx = await this.contract.methods.bid(_user, _index)
        .send({ from: this.web3Service.getSelectedAddress(), gas: gas + GAS_BUFFER, gasPrice: gasPrice });
      console.log(tx);
    } catch (e: any) {
      throw new Error(e.message);
    }

  }

  async withdraw(_user: string, _index: number, _evidence: any) {
    try {
      const gas = await this.contract.methods.withdraw(_user, _index, _evidence).estimateGas({ from: this.web3Service.getSelectedAddress() });
      const gasPrice = await this.web3Service.getGasPrice();
      const tx = await this.contract.methods.withdraw(_user, _index, _evidence)
        .send({ from: this.web3Service.getSelectedAddress(), gas: gas + GAS_BUFFER, gasPrice: gasPrice });
      console.log(tx);
    } catch (e: any) {
      throw new Error(e.message);
    }

  }

  async getEvidence(_user: string, _index: number)
    : Promise<{
      blockNumber: string,
      blockHash: string,
      //blockHeader: string,
      txReceiptProof: Array<string>,
      txProof: Array<string>,
      transaction: string,
      transactionHash: string,
      txDataSpot: Array<string>,
      path: Array<string>,
      txReceipt: string,
    }> {
    try {
      const gas = await this.contract.methods.getEvidence(_user, _index).estimateGas({ from: this.web3Service.getSelectedAddress() });
      const gasPrice = await this.web3Service.getGasPrice();
      const tx = await this.contract.methods.getEvidence(_user, _index)
        .call({ from: this.web3Service.getSelectedAddress(), gas: gas + GAS_BUFFER, gasPrice: gasPrice });

      console.log(tx);
      return tx;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async saveEvidence(_user: string, _index: number, _evidence: any) {
    try {
      const gas = await this.contract.methods.saveEvidence(_user, _index, _evidence).estimateGas({ from: this.web3Service.getSelectedAddress() });
      const gasPrice = await this.web3Service.getGasPrice();
      const tx = await this.contract.methods.saveEvidence(_user, _index, _evidence)
        .send({ from: this.web3Service.getSelectedAddress(), gas: gas + GAS_BUFFER, gasPrice: gasPrice });
      console.log(tx);
    } catch (e: any) {
      throw new Error(e.message);
    }

  }



  async checkTxData(_transaction: string, _txDataSpot: Array<number>, _to: string, _amount: number) {
    try {
      const gas = await this.contract.methods.checkTxData(_transaction, _txDataSpot, _to, _amount).estimateGas({ from: this.web3Service.getSelectedAddress() });
      const gasPrice = await this.web3Service.getGasPrice();
      const tx = await this.contract.methods.checkTxData(_transaction, _txDataSpot, _to, _amount)
        .call({ from: this.web3Service.getSelectedAddress(), gas: gas + GAS_BUFFER, gasPrice: gasPrice });
      console.log(tx);
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async decodeNode(_encoded: string) {
    try {
      const gas = await this.contract.methods.decodeNode(_encoded).estimateGas({ from: this.web3Service.getSelectedAddress() });
      const gasPrice = await this.web3Service.getGasPrice();
      const tx = await this.contract.methods.decodeNode(_encoded)
        .call({ from: this.web3Service.getSelectedAddress(), gas: gas + GAS_BUFFER, gasPrice: gasPrice });
      console.log(tx);
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async checkProof(_proof: Array<string>, _root: string, _path: Array<number>) {
    console.log(_proof, _root);
    try {
      const gas = await this.contract.methods.checkProof(_proof, _root, _path).estimateGas({ from: this.web3Service.getSelectedAddress() });
      const gasPrice = await this.web3Service.getGasPrice();
      console.log(gas);
      const tx = await this.contract.methods.checkProof(_proof, _root, _path)
        .call({ from: this.web3Service.getSelectedAddress(), gas: gas + GAS_BUFFER, gasPrice: gasPrice });
      console.log(await this.web3Service.keccak256(tx));
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async bufferToNibble(_encoded: string) {
    try {
      const gas = await this.contract.methods.bufferToNibble(_encoded).estimateGas({ from: this.web3Service.getSelectedAddress() });
      const gasPrice = await this.web3Service.getGasPrice();
      const tx = await this.contract.methods.bufferToNibble(_encoded)
        .call({ from: this.web3Service.getSelectedAddress(), gas: gas + GAS_BUFFER, gasPrice: gasPrice });
      console.log(tx);
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async getPastEvents(_event: string, _userAddress: string, _from: number) {
    try {
      const event = await this.contract.getPastEvents(_event, {
        fromBlock: _from,
        filter: { userAddress: _userAddress }
      });
      return event;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async getRelayer() {
    try {
      const tx = await this.contract.methods.getRelayer().call();
      return tx;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async createUpwardTrade(_amount: number, _relayer: string, _fee: number, _tokenTypeIndex: number, _evidence: any, networkId: number) {
    try {
      const gas = await this.contract.methods.createUpwardTrade(_amount, _relayer, _fee, _tokenTypeIndex, _evidence).estimateGas({ from: this.web3Service.getSelectedAddress() });
      let txObj = {
        from: this.web3Service.getSelectedAddress(),
        gas: gas + GAS_BUFFER,
      } as any;

      txObj = await this.web3Service.addGasPriceToTxObject(txObj);
      const tx = await this.contract.methods.createUpwardTrade(_amount, _relayer, _fee, _tokenTypeIndex, _evidence).send(txObj);

      console.log(tx);
      return tx;
    } catch (e: any) {
      throw new Error(e.message);
    }

  }

  async getTradeThreshold() {
    try {
      const threhold = this.contract.methods.getTradeThreshold().call();
      return threhold;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async getDisputablePeriod(_isUpward : boolean) {
    try {
      const result = this.contract.methods.getDisputablePeriod(_isUpward).call();
      return result;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async checkEvidenceExceptBlockHash(_trade: any, _evidence: any) {
    try {
      const result = this.contract.methods.checkEvidenceExceptBlockHash(_trade, _evidence).call();
      return result;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async getTradeMinimumAmount() {
    try {
      const threhold = this.contract.methods.getTradeMinimumAmount().call();
      return threhold;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async getRelayerFee(relayer: string) {
    try {
      const threhold = this.contract.methods.getRelayerFee(relayer).call();
      return threhold;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }*/


}

