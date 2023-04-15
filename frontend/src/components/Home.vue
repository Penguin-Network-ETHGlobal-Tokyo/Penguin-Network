<template>
  <div class="container">
    <header class="header">
      <h1 class="title">BondManager</h1>
      <div class="flex">
        <div v-if="userAddress.length == 0">
          <button class="bg-white hover:bg-slate-200 text-black font-bold py-2 px-4 rounded-full border border-black" type="button" @click="connectMetamask">
            <span>Connect a Wallet</span>
          </button>
        </div>
        <div v-if="userAddress.length != 0">
           <button class="bg-white text-black font-bold py-2 px-4 rounded-full border border-black" type="button">
             {{userAddress[0]}}
          </button>
        </div>
      </div>
    </header>
    <table class="table">
      <tr>
        <th>Address</th>
        <th>Bond</th>
        <th>Valid</th>
        <th>Networks</th>
        <th>IsSlashed</th>
        <th>Message</th>
      </tr>
      <tr v-for="(bond, index) in bondList" :key="index">
        <td>{{ bond.address }}</td>
        <td>{{ bond.bond }}</td>
        <td>{{ bond.isValid }}</td>
        <td>{{ bond.networks }}</td>
        <td>{{ bond.isSlashed }}</td>
        <td><button class="bg-white text-black font-bold py-2 px-4 rounded-full border border-black" type="button" @click="showMessageModal">message</button></td>
      </tr>
    </table>
    <!-- Modal HTML -->
    <div v-if="showTxModalFlag" class="modal">
      <div class="modal-content">
        <div class="modal-header flex justify-center">
          <h2>{{operation}}</h2>
          <button class="close" @click="closeTxModal">&times;</button>
        </div>
        <div class="flex justify-center" v-if="txhash == ''">
          <div class="animate-ping h-2 w-2 bg-blue-600 rounded-full"></div>
          <div class="animate-ping h-2 w-2 bg-blue-600 rounded-full mx-4"></div>
          <div class="animate-ping h-2 w-2 bg-blue-600 rounded-full"></div>
        </div>
        <div class="break-words" v-if="txhash != ''">
          {{txhash}}
        </div>
      </div>
    </div>
    <div v-if="showModalFlag" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add Bond</h2>
          <button class="close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <input v-model="amountInput" type="text" placeholder="Amount" required />
          <label for="default-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">is Pool Deposit? (using Aave)</label>
          <input id="default-checkbox" type="checkbox" v-model="isPoolDeposit" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
        </div>
        <div class="modal-footer">
          <button class="bg-white hover:bg-slate-200 text-black font-bold py-2 px-4 rounded-full border border-black" @click="addBond">Add Bond</button>
        </div>
      </div>
    </div>
    <div v-if="showNetworkModalFlag" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add Network</h2>
          <button class="close" @click="closeNetworkModal">&times;</button>
        </div>
        <div class="modal-body">
          <select  v-model="selecetedNetwork" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected value="0">Choose a Network</option>
            <option v-for="(network, index) in supportedNetworkList" :key="index" :value="network.id">{{network.chainName}}</option>
          </select>
        </div>
        <div class="modal-footer">
          <button class="bg-white hover:bg-slate-200 text-black font-bold py-2 px-4 rounded-full border border-black" @click="addNetwork">Add Network</button>
        </div>
      </div>
    </div>

    <div v-if="showMessageModalFlag"  class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Send Arbitrary Message</h2>
          <button class="close" @click="closeMessageModal">&times;</button>
        </div>
        <div class="modal-body">
          <input v-model="message" type="text" placeholder="Encoded Message" required />
          <select  v-model="selecetedNetwork" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-3">
            <option selected value="0">Choose Network</option>
            <option v-for="(network, index) in supportedNetworkList" :key="index" :value="network.id">{{network.chainName}}</option>
          </select>

          <select  v-model="destNetwork" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-3">
            <option selected value="0">Choose Destination Network</option>
            <option v-for="(network, index) in supportedNetworkList" :key="index" :value="network.id">{{network.chainName}}</option>
          </select>
          <input v-model="destAddress" type="text" placeholder="Destination Address" required />

        </div>
        <div class="modal-footer">
          <button class="bg-white hover:bg-slate-200 text-black font-bold py-2 px-4 rounded-full border border-black" @click="setRelayMessage">Add Message</button>
        </div>
      </div>
    </div>

    <hr class="my-10">
    <div>
      <div v-if="userAddress.length != 0">
        <button class="bg-white hover:bg-slate-200 text-black font-bold py-2 px-4 mr-2 rounded-full border border-black" type="button" @click="showNetworkModal">
           Add Network
        </button>
        <button class="bg-white hover:bg-slate-200 text-black font-bold py-2 px-4 rounded-full border border-black" type="button" @click="showModal">
           Add Bond
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Web3Service from "../modules/web3Service";
import BondManager from "../modules/bondManager";
import ChildStatusManager from "../modules/childStatusManager";
import RootStatusManager from "../modules/rootStatusManager";
import MessageManager from "../modules/messageManager";
let web3: Web3Service;
let bondManger: BondManager;
let childStatusManager: ChildStatusManager;
let rootStatusManager: RootStatusManager;
let messageManager: MessageManager;

const supportedNetworkList = [
  {id: 1, chainId: 80001, chainName: "Mumbai"},
  {id: 2, chainId: 534353, chainName: "ScrollTestnet"},
  {id: 3, chainId: 1442, chainName: "Polygon zkEVM"},
  {id: 4, chainId: 59140, chainName: "LineaGoerli"},
  {id: 5, chainId: 167002, chainName: "TaikoAlpha2"}
]
export default {
  data() {
    return {
      bondList: [],
      showModalFlag: false,
      showNetworkModalFlag: false,
      showTxModalFlag: false,
      showMessageModalFlag: false,
      expireInput: '',
      txhash: '',
      operation: '',
      networkInput: '',
      amountInput: '',
      isPoolDeposit: false,
      message: '',
      destNetwork: 0,
      destAddress: '',
      userAddress: [],
      networkName: "polygon",
      web3Mainnet: {} as any,
      web3Polygon: {} as any,
      web3Scroll: {} as any,
      web3PolygoZkEvm: {} as any,
      web3Linea: {} as any,
      mainnetBondManager: {} as any,
      supportedNetworkList: supportedNetworkList,
      selecetedNetwork: 0,
      bondManagerList: [],
      childStatusManagerList: [],
      rootStatusManagerList: [],
      messageManagerList: [],
    };
  },
  methods: {
    async connectMetamask() {
      web3 = await Web3Service.init(undefined, window, this.connectMetamask);
      //this.currentNetworkId = await web3.getNetworkId();
      this.userAddress = await web3.getAccounts();
      console.log(this.userAddress);
    },

    showModal() {
      this.showModalFlag = true;
    },
    closeModal() {
      this.showModalFlag = false;
    },
    showTxModal() {
      this.showTxModalFlag = true;
    },
    closeTxModal() {
      this.showTxModalFlag = false;
    },
    showNetworkModal() {
      this.showNetworkModalFlag = true;
    },
    closeNetworkModal() {
      this.showNetworkModalFlag = false;
    },
    showMessageModal() {
      this.showMessageModalFlag = true;
    },
    closeMessageModal() {
      this.showMessageModalFlag = false;
    },
    async setRelayMessage() {
      this.txhash = "";
      if(this.message == "" ||  this.destAddress == "" ||  this.destNetwork == 0 || this.selecetedNetwork == 0) {
        return;
      }
      // if(await web3.getNetworkId() != "80001") {
      //   return;
      // }

      const selectedNetworkDetail = supportedNetworkList.find((network :any) => {
        return network.id == this.selecetedNetwork;
      });


      const destNetworkDetail = supportedNetworkList.find((network :any) => {
        return network.id == this.destNetwork;
      });

      const messageManagerinfo = this.messageManagerList.find(async (messageManager:any) => {
        if(messageManager.network == selectedNetworkDetail.chainName) {
          return messageManager;
        }
      });

      messageManager = await MessageManager.init(web3, messageManagerinfo.endpoint);

      const tx = messageManager.setRelayMessage(destNetworkDetail.chainId, this.destAddress, this.message);
      this.operation = "Send Message Tx Sending..."
      this.closeMessageModal()
      this.showTxModal()
      tx.then(async (result) => {
        this.operation = "Complete!"
        this.txhash = result.transactionHash;
        this.bondList = [];
        this.getBondList()
      }).catch((e:any) => {
        console.log(e);
      });

      await tx;
    },

    async addNetwork() {
      this.txhash = "";
      if(this.selecetedNetwork == 0) {
        return;
      }
      const selectedNetworkDetail = supportedNetworkList.find((network :any) => {
        return network.id == this.selecetedNetwork;
      });
      const tx = bondManger.addNetwork(selectedNetworkDetail.chainId);
      this.operation = "Add Network Tx Sending..."
      this.closeNetworkModal()
      this.showTxModal()
      tx.then(async (result) => {
        this.operation = "Complete!"
        this.txhash = result.transactionHash;
        this.bondList = [];
        this.getBondList()
      }).catch((e:any) => {
        console.log(e);
      });

      await tx;
    },
    async addBond() {
      this.txhash = "";
      if(this.getNetworkId != 5) {
        await web3.switchNetwork(5);
      }
      console.log(this.isPoolDeposit);
      const tx = bondManger.deposit(this.amountInput, this.isPoolDeposit);

      this.operation = "Add Bond Tx Sending..."
      this.showTxModal()
      tx.then(async (result) => {
        this.txhash = result.transactionHash;
        this.operation = "Complete!"
        this.bondList = [];
        this.getBondList()
      }).catch((e:any) => {
        console.log(e);
      });

      // Close the modal
      this.showModalFlag = false;
    },
    async getSlashStatus() {
      for(let i = 0; i < this.childStatusManagerList.length; i++ ) {
        if(this.childStatusManagerList[i].network == "polygon") {
          childStatusManager = await ChildStatusManager.init(this.web3Polygon, this.childStatusManagerList[i].endpoint);
        } else if(this.childStatusManagerList[i].network == "scrollTestnet") {
          childStatusManager = await ChildStatusManager.init(this.web3Scroll, this.childStatusManagerList[i].endpoint);
        } else if (this.childStatusManagerList[i].network == "polygonZkEvm") {
          childStatusManager = await ChildStatusManager.init(this.web3PolygoZkEvm, this.childStatusManagerList[i].endpoint);
        } else if (this.childStatusManagerList[i].network == "linea") {
          childStatusManager = await ChildStatusManager.init(this.web3Linea, this.childStatusManagerList[i].endpoint);
        }
        const isSlashed = await childStatusManager.getSlashStatus();
        if(isSlashed) {
          return true;
        }
      }
      return false;
    },
    async getBondList() {
      for(let i = 0; i < this.bondManagerList.length; i++ ) {
        let mainnetBondManager = await BondManager.init(this.web3Mainnet, this.bondManagerList[i]);
        const expiredInterval = await mainnetBondManager.getExpireDate()
        const expiredDate = new Date(Date.now() + parseInt(expiredInterval) * 1000);
        const expiredDateFormatted = expiredDate.getMonth() + 1  + "/" + expiredDate.getDate() + "/" + expiredDate.getHours() + "/" + expiredDate.getMinutes() 
        const isValid = expiredInterval == 10800 ? "valid" : "will expire at" + expiredDateFormatted
        //const networks = await mainnetBondManager.getAllAvailableNetworks()
        //console.log(networks);
        //const networksFormatted = networks.length > 0 ? String(networks) : "None"


        const networks = []
        for(let i = 0; i < supportedNetworkList.length; i++ ){
          if(await mainnetBondManager.isAvailableNetwork(String(supportedNetworkList[i].chainId))) {
            networks.push(supportedNetworkList[i].chainName)
          }
        }
        const networksFormatted = networks.length > 0 ? String(networks) : "None"
 
        const isSlashed = await this.getSlashStatus();
        this.bondList.push({
          address: await mainnetBondManager.owner(),
          bond: await mainnetBondManager.getBond(),
          isValid: isValid,
          networks: networksFormatted,
          isSlashed: isSlashed ? "Yes" : "No"
        });
      };

    }
  },
  async created() {
    const isConnect = await Web3Service.isConnect();
    if(isConnect) {
      await this.connectMetamask();
    }

    this.bondManagerList = [import.meta.env.VITE_BOND_MANAGER_ADDRESS1, import.meta.env.VITE_BOND_MANAGER_ADDRESS2]; 
    //TODO retrieve from bondmanager
    this.childStatusManagerList = [{network: "polygonZkEvm", endpoint: import.meta.env.VITE_CHILD_STATUS_MANAGER_ADDRESS1}];
    this.rootStatusManagerList = [import.meta.env.VITE_ROOT_STATUS_MANAGER_ADDRESS1, import.meta.env.VITE_ROOT_STATUS_MANAGER_ADDRESS2]; 
    //TODO specify messageManger for each relayer.
    this.messageManagerList = [{network: "polygonZkEvm", endpoint: import.meta.env.VITE_MESSAGE_MANAGER_ADDRESS1}]
    this.web3Mainnet = await Web3Service.init(import.meta.env.VITE_GOERLI_PROVIDER as string, undefined);
    this.web3Polygon = await Web3Service.init(import.meta.env.VITE_MUMBAI_PROVIDER as string, undefined);
    this.web3Scroll = await Web3Service.init(import.meta.env.VITE_SCROLL_TESTNET_PROVIDER as string, undefined);
    this.web3PolygoZkEvm = await Web3Service.init(import.meta.env.VITE_POLYGON_ZK_EVM_TESTNET_PROVIDER as string, undefined);
    this.web3Linea = await Web3Service.init(import.meta.env.VITE_LINEA_GOERLI_PROVIDER as string, undefined);
    bondManger = await BondManager.init(web3, import.meta.env.VITE_BOND_MANAGER_ADDRESS1 as string);
    await this.getBondList();
  }
};
</script>

<style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .title {
    font-size: 2rem;
    color: #1c355e;
  }
 .table {
  width: 100%;
  border-collapse: collapse;
}

  th,
  td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid #ccc;
  }
  
  tr:nth-child(even) {
    background-color: #f8f8f8;
  }
  
  .modal {
    @apply fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ;
  }
  
  .modal-content {
    @apply bg-white rounded-md max-w-md p-4 text-center;
  }
  
  .modal-header {
    @apply flex justify-between items-center mb-4;
  }
  
  .modal-header h2 {
    @apply text-2xl font-semibold text-blue-900;
  }
  
  .close {
    @apply bg-none border-none text-gray-600 text-xl cursor-pointer p-0;
  }
  
  .close:hover {
    @apply text-blue-900;
  }
  
  .modal-body input {
    @apply mb-4 p-2 w-full border border-gray-300 rounded-sm;
  }
  
  .modal-footer {
    @apply mt-4;
  }
</style>

