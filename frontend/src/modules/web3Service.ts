import Web3 from 'web3'

declare const window: any
let isNetworkReady: any = true;
let isProcessingCallback: any = false;

export default class Web3Service {
    public web3: any
    public ethereum : any
    constructor(web3? :any, ethereum? :any) {
        this.web3 = web3;
        this.ethereum = ethereum;
    }

    public static async init(provider? :any, window?: any, callback?:() => Promise<void> ) {
        let ethereum :any;
        if(typeof window !== 'undefined') {
            ethereum = window.ethereum;
        }
        const web3 = await Web3Service.bootstrapWeb3(provider, ethereum);
        if(callback != undefined) {
          ethereum.on('chainChanged', async (_chainId: string) => {
              if (isProcessingCallback !== true) {
                isProcessingCallback = true;
                await callback();
                isNetworkReady = true;
                isProcessingCallback = false;
              }
          });
          ethereum.on('accountsChanged', async (_chainId: string) => {
              window.location.reload();
          });

        }
        return new Web3Service(web3, ethereum);
    }

    public static async bootstrapWeb3(provider? :any, ethereum?: any) {
      if(typeof provider !== 'undefined') {
        if((provider as string).indexOf("https") == 0) {
          return new Web3(new Web3.providers.HttpProvider(provider));
        }
        return new Web3(new Web3.providers.WebsocketProvider(provider));
      } else if (typeof ethereum !== 'undefined') {
        await ethereum.enable()

        return new Web3(ethereum);

      } else {
        throw new Error('Non-Ethereum browser detected. You should consider trying Mist or MetaMask!');
      }
    }

    public async switchNetwork(chainId: number) {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: await this.toHex(chainId) }],
      });
    }

    public async getContract(abi: any , address: any) {
      return await new this.web3.eth.Contract(abi , address);
    }

    public async getBalance(address: any) {
      return await new this.web3.eth.getBalance(address);
    }

    public getSelectedAddress() {
      return this.ethereum.selectedAddress;
    }

    public async getNetworkId() {
      return await this.web3.eth.net.getId();
    }

    public async keccak256(_value :string) {
      return await this.web3.utils.keccak256(_value);
    }

    public async importAccount(privKey: string) {
      return await this.web3.eth.accounts.privateKeyToAccount(privKey);
    }

    public async getTransaction(_txHash: string) {
      return await this.web3.eth.getTransaction(_txHash);
    }

    public async getTransactionReceipt(_txHash: string) {
      return await this.web3.eth.getTransactionReceipt(_txHash);
    }

    public async toHex(_number: number) {
      return await this.web3.utils.toHex(_number);
    }


    public async getCode(_number: string) {
      return await this.web3.eth.getCode(_number);
    }

    public async getBlock(_number: number) {
      return await this.web3.eth.getBlock(_number);
    }

    public async fromWei(_number: number, _unit= "ether" ) {
      return await this.web3.utils.fromWei(String(_number), _unit);
    }

    public async toWei(_number: number, _unit= "ether" ) {
      const result = await this.web3.utils.toWei(String(_number), _unit);

      if(typeof result === "string") {
          return result;
      } else {
          return result.toString();
      }
    }

    public async getGasPrice() {
      return await this.web3.eth.getGasPrice();
    }

    public async getAccounts(): Promise<any> {
      return await this.web3.eth.getAccounts()
    }

    public async sendTransaction(_address: string, _amount: number) {
      try {
        let txObj = {
            from: this.getSelectedAddress(),
            to: _address,
            value: _amount,
        } as any;

        txObj = await this.addGasPriceToTxObject(txObj);
        const tx = await this.web3.eth.sendTransaction(txObj);
        console.log(tx);
        return tx;
      } catch (e: any) {
        throw new Error(e.message);
      }

    }

    public getWeb3() {
      return this.web3;
    }

    public async addGasPriceToTxObject(txObj: any) {
      const networkId = parseInt(await this.getNetworkId());
      if (networkId == 80001 || networkId == 137) {
        txObj.maxPriorityFeePerGas  = await this.toWei(60, 'gwei')
        txObj.maxFeePerGas = await this.toWei(200, 'gwei')
      } else if (networkId == 5 ||  networkId == 1) {
        txObj.maxPriorityFeePerGas  = await this.toWei(2, 'gwei')
        txObj.maxFeePerGas = await this.toWei(200, 'gwei')
      } else {
        txObj.gasPrice = await this.getGasPrice()
      }
      return txObj;
    }

    public static async isConnect() {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });
      return accounts.length > 0;
    }

}
