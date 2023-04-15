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
        <th>IsSlashing</th>
      </tr>
      <tr v-for="(bond, index) in bondList" :key="index">
        <td>{{ bond.address }}</td>
        <td>{{ bond.bond }}</td>
        <td>{{ bond.isVaid }}</td>
        <td>{{ bond.networks }}</td>
        <td>{{ bond.isSlashing }}</td>
      </tr>
    </table>

    <!-- Modal HTML -->
    <div v-if="showModalFlag" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add Bond</h2>
          <button class="close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <input v-model="amountInput" type="text" placeholder="Amount" required />
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
          <label for="networks" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
          <select  v-model="selecetedNetwork">
            <option selected value="0">Choose a Network</option>
            <option v-for="(network, index) in supportedNetworkList" :key="index" :value="network.id">{{network.chainName}}</option>
          </select>
        </div>
        <div class="modal-footer">
          <button class="bg-white hover:bg-slate-200 text-black font-bold py-2 px-4 rounded-full border border-black" @click="addBond">Add Network</button>
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
let web3: Web3Service;
let bondManger: BondManager;

const supportedNetworkList = [
  {id: 1, chainId: 80001, chainName: "Mumbai"},
  {id: 2, chainId: 534353, chainName: "ScrollTestnet"}
]
export default {
  data() {
    return {
      bondList: [
        { address: '0x123456789', bond: '1000 BTC', expire: '2023-08-15', networks: 'Bitcoin, Ethereum', isSlashing: 'Yes' }
      ],
      showModalFlag: false,
      showNetworkModalFlag: false,
      expireInput: '',
      networkInput: '',
      amountInput: '',
      userAddress: [],
      networkName: "polygon",
      web3Mainnet: {} as any,
      mainnetBondManager: {} as any,
      supportedNetworkList: supportedNetworkList,
      selecetedNetwork: 0,
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
    showNetworkModal() {
      this.showNetworkModalFlag = true;
    },
    closeNetworkModal() {
      this.showNetworkModalFlag = false;
    },
    async addNetwork() {
      if(this.selecetedNetwork == 0) {
        return;
      }
      const selectedNetworkDetail = supportedNetworkList.find((network :any) => {
        return network.id == this.selecetedNetwork;
      });
      console.log(selectedNetworkDetail);
      const tx = bondManger.addNetwork(selectedNetworkDetail.chainId);
      console.log(tx);

      await tx;
    },

    async addBond() {
      if(this.getNetworkId != 5) {
        await web3.switchNetwork(5);
      }

      // TODO: Perform data validation and add the new bond entry to the table
      const tx = bondManger.deposit(this.amountInput);

      tx.then(async (result) => {
        this.bondList.push({
          address: await this.web3.getSelectedAddress(),
          bond: this.amountInput,
          //expire: this.expireInput,
          //networks: this.networkInput,
          isSlashing: 'No'
        });
      }).catch((e:any) => {
        console.log(e);
        console.log(constant.METAMASK_GENERAL_ERROR);
      });

      // Close the modal
      this.showModalFlag = false;
    }
  },
  async created() {
    const isConnect = await Web3Service.isConnect();
    if(isConnect) {
      await this.connectMetamask();
    }
    const bondManagerList = [import.meta.env.VITE_BOND_MANAGER_ADDRESS1, import.meta.env.VITE_BOND_MANAGER_ADDRESS2]; 
    const childStatusManager = [import.meta.env.VITE_CHILD_STATUS_MANAGER_ADDRESS1, import.meta.env.ITE_CHILD_STATUS_MANAGER_ADDRESS2]; 
    const rootStatusManager = [import.meta.env.VITE_ROOT_STATUS_MANAGER_ADDRESS1, import.meta.env.VITE_ROOT_STATUS_MANAGER_ADDRESS2]; 
    this.web3Mainnet = await Web3Service.init(import.meta.env.VITE_GOERLI_PROVIDER as string, undefined);
    bondManger = await BondManager.init(web3, import.meta.env.VITE_BOND_MANAGER_ADDRESS1 as string);
    //this.mainnetBondManager = await BondManager.init(this.web3Mainnet, import.meta.env.VITE_BOND_MANAGER_ADDRESS1 as string);
    for(let i = 0; i < bondManagerList.length; i++ ) {
      let mainnetBondManager = await BondManager.init(this.web3Mainnet, bondManagerList[i]);
      console.log(mainnetBondManager);
      console.log(await mainnetBondManager.getBond());
      console.log(await mainnetBondManager.owner());
      console.log(await mainnetBondManager.getExpireDate());
     // console.log(await mainnetBondManager.getAllAvailableNetworks());
      const expiredInterval = await mainnetBondManager.getExpireDate()
      const expiredDate = new Date(Date.now() + parseInt(expiredInterval) * 1000);
      const expiredDateFormatted = expiredDate.getMonth() + 1  + "/" + expiredDate.getDate() + "/" + expiredDate.getHours() + "/" + expiredDate.getMinutes() 
      const isValid = expiredInterval == 10800 ? "valid" : "will expire at" + expiredDateFormatted
      //const networks = await mainnetBondManager.getAllAvailableNetworks()
      //console.log(networks);
      /*const networks = await mainnetBondManager.getAllAvailableNetworks()
      const networksFormatted = networks.length > 0 ? String(networks) : "None"*/
      const network = await mainnetBondManager.isAvailableNetwork("80001")

      this.bondList.push({
        address: await mainnetBondManager.owner(),
        bond: await mainnetBondManager.getBond(),
        isValid: isValid,
        //networks: networksFormatted,
        networks: network,
        isSlashing: 'No'
      });
    };
    console.log(Date.now())
    console.log(new Date(Date.now()))
    console.log(new Date(Date.now() + 10800000))
    //let mainnetBondManager = await BondManager.init(this.web3Mainnet, import.meta.env.VITE_BOND_MANAGER_ADDRESS1 as string);
    //console.log(bondManger);
    /*console.log(await this.mainnetBondManager.getBond());
    console.log(await this.mainnetBondManager.owner());
    console.log(await this.mainnetBondManager.getExpireDate());*/

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
    @apply fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50;
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

