import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';
import Constants from './config';


const Web3 = require('web3');
let walletProvider = null;
let walletAddress = "";

const options = new WalletConnectProvider({
    rpc: {
      137: 'https://matic-mainnet.chainstacklabs.com',
    },
    infuraId: '460f40a260564ac4a4f4b3fffb032dad',
  });

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        // options: {
        //     infuraId: "460f40a260564ac4a4f4b3fffb032dad", // required
        //     bridge: "https://bridge.walletconnect.org"
        // }
        options: options,
    }
};

const web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: false, // optional
    disableInjectedProvider: false,
    providerOptions // required
});

export const setupNetwork = async () => {
    const provider = window.ethereum
    if (provider) {
        const chainId = 42161
        try {
            await provider.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: `0x${chainId.toString(16)}`,
                        chainName: Constants.CHAIN_NAME[chainId],
                        nativeCurrency: Constants.NATIVE_CURRENCY[chainId],
                        rpcUrls: [Constants.Node],
                        blockExplorerUrls: [Constants.BASE_ETH_SCAN_URLS[chainId]],
                    },
                ],
            })
            return true
        } catch (error) {
            console.error('Failed to setup the network in Metamask:', error)
            return false
        }
    } else {
        console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
        return false
    }
}

export const connectWallet = async () => {
    try {
        await web3Modal.clearCachedProvider()
        const provider = await web3Modal.connect()
        window.web3 = new Web3(provider)

        window.web3.eth.extend({
            methods: [
                {
                    name: "chainId",
                    call: "eth_chainId",
                    outputFormatter: window.web3.utils.hexToNumber
                }
            ]
        });

        const chainId = await window.web3.eth.chainId();
        if (chainId !== 56) { //56: mainnet, 97: testnet
            const res = await setupNetwork();
            if (!res) {
                return {
                    address: "",
                    status: "Add network"
                }
            }
        }


        provider.on("chainChanged", (chainId) => {
            setupNetwork();
        });

        const accounts = await window.web3.eth.getAccounts();
        const address = accounts[0];


        window.localStorage.setItem("wallet", address);

        walletProvider = provider;
        walletAddress = address;
        if (accounts.length > 0) {
            return {
                address: walletAddress,
                status: "Success"
            }
        } else {
            return {
                address: "",
                status: "Connect to wallet"
            }
        }
    } catch (err) {
        return {
            address: "",
            status: err.message
        }
    }

}

export const disconnectWallet = async () => {
    await web3Modal.clearCachedProvider()
    if (walletProvider?.disconnect && typeof walletProvider.disconnect === 'function') {
        await walletProvider.disconnect()
    }
    window.localStorage.removeItem(Constants.WalletLocalStorageKey);
    walletProvider = null
}




const ContractUtils = {
    connectWallet,
    disconnectWallet,
};

export default ContractUtils;