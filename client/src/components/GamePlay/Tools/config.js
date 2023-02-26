export const BSC_BLOCK_TIME = 3

const MAINNET = 42161

const ChainID = MAINNET;

export const CHAIN_NAME = {
    [MAINNET]: 'ETH Mainnet',
}

export const BASE_ETH_SCAN_URLS = {
    [MAINNET]: 'https://arbiscan.io/',
}

export const NODE = {
    [MAINNET]: 'https://rpc.ankr.com/arbitrum',
    // https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
}

export const SortOption = {
    CLASSES: 'Class',
    LEVEL: 'Level',
    GENDER: 'Gender',
    UPPER: 'Headgear Upper',
    MID: 'Headgear Mid',
    LOWER: 'Headgear Lower'
}

export const NATIVE_CURRENCY = {
    [MAINNET]: {
        name: 'Arbi',
        symbol: 'eth',
        decimals: 18,
    },
}
export const connectorLocalStorageKey = "connectorIdv2"
export const walletLocalStorageKey = "wallet";
export const id = "salary"
export const cakeId = "tether"
export const currency = "usd"
export const SECOND_TO_START = 864000 // 10 days
export const EndDay = new Date(Date.UTC(2022, 2, 12, 12, 0, 0));

export default {
    ChainID,
    CHAIN_NAME,
    NATIVE_CURRENCY,
    Node: NODE[ChainID],
    WalletLocalStorageKey: walletLocalStorageKey,
    BASE_ETH_SCAN_URLS,
};