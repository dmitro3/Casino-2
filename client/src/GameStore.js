// import * as env from "./private"
import create from "zustand";

const useGameStore = create((set) => ({
  alerts: {
    type: "",
    content: ""
  },
  adminView: "home",
  bettingAmount: 0.002 * process.env.REACT_APP_NUGGET_RATIO,
  boardState: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  boardClickedState: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  bonusNugAmount: 0,
  clicked: false,
  currencyMode: "mainNug",
  doubleCheck: false,
  doubleHouseEdge: 1,
  doubleGameWin: 0,
  doubleGameLose: 0,
  enableMines: true,
  enableDouble: true,
  enableLoot: true,
  enableTurtle: true,
  factor1: 0,
  factor2: 0,
  factor3: 0,
  factor4: 0,
  gameHistory: [
    {
      game: "MinesRush",
      player: "Ogur",
      wager: 0.25,
      payout: 4.25,
    },
    {
      game: "Guck",
      player: "Onur",
      wager: 0.8,
      payout: 9.25,
    },
  ],
  gameMode: "minesrush",
  gameState: 0,
  gameStep: 0,
  gameTHistory: [],
  gameWin: false,
  gemAmount: 0,
  hack: "",
  isAdmin: false,
  is_backgroundmusic: false,
  isHolder: false,
  isReward: false,
  isMuted: true,
  loading: false,
  loggedIn: false,
  losePhrase: [
    "Argh ye bilge rat - try again!",
    "Ye wanna be a buccaneer? Ye’ll have to do it better than that!",
    "Argh it warms my hearties when you lose!",
    "Swab the decks ye knave! Try again!",
    "Ye call that a gamble? Try harder matey!",
    "Ye filthy wench! Swab the rug",
    "Heave ho - try again!",
    "Is that a black spot I see ?",
    "Ye be gettin’ cleaved to the brisket ya skallywag",
    "Give no quarter to the gambler",
    "You lily - livered pour excuse for a pirate.",
    "Ye no better than that scurvy dog",
    "Don’t ye worry matey - one day you’ll get your sea legs",
    "Argh go swab the poop deck again ye knave!",
    "Haha those be my doubloons!",
    "If ye lose one more time I’ll have all yer pieces of eight!",
    "Arg! We appreciate your contribution to the coffer matey!",
    "Today you lose your bounty!",
    "I'll skewer yer gizzard, ye flea-bitten, rum-thievin' whelp!",
    "'Tis the Black Spot for ye, ye foul-smellin', blasted maggot!",
    "I'll plunder yer coffer, ye lily-livered, yellow-bellied stowaway!",
  ],
  mineAmount: 5,
  mineHouseEdge: 0.92,
  mineGameWin: 0,
  mineGameLose: 0,
  maxMine: 24,
  minMine: 5,
  netGainList: [],
  nextMultiplier: 1,
  nfts: [],
  nftAvatar: "none",
  nftAvatars: [],
  // nftData: [],
  nugAmount: 0,
  number: 0,
  // play: false,
  password: "1817373289",
  previousMultiplier: 1,
  bNugRatio: 10000,
  raffleDate: 0,
  raffles: 0,
  raffleMode: true,
  remain: 0,
  showSidebar: false,
  showToast: false,
  spinCount: 1,
  solanaTps: 2835,
  ethAmount: 0,
  spinnerItems: [
    0.001, 10, 0.002, 50, 0.003, 25
  ],
  streakNum: 0,
  themeBlack: true,
  timer: "",
  spinDate: 0,
  userName: "MinesRush",
  walletAddress: "0x12345",
  walletAddressList: [],
  winPhrase: [
    "Yer becomin’ a real pirate! Pillage again!",
    "A true scourge of the seven seas yer becoming!",
    "What a fine swashbuckler we have among us!",
    "Ahoy matey! Pillage and plunder!",
    "Blimey! You’ll drain the bank!",
    "Shiver me timbers ye plundered the bank again!",
    "Ye got all the riches in the briney deep!",
    "Fire in the hole, ye won er’ again",
    "Raise Jolly Roger up again, yer plundering the hold!",
    "Pillage that booty!",
    "Argh! yer really filling up yer coffer!",
    "Batten down the hatches, there’s a Flip among us!",
    "Keep winnin’ there’s a kraken in these waters!",
    "Hoist the anchor, we are off to tortuga boys!",
    "Blimey another win!",
    "Avast ye - they win again!",
    "Aye Aye Captain, another win coming right up!",
    "Fill your treasure chest with the pillage of the sea!",
    "We haven’t seen wins like these since cap’n sparrow was among us",
    "Careful if ye win too much ye might find yerself marooned!",
  ],
  winNum: 0,
  setAlerts: (val) => {
    set({ alerts: val });
    setTimeout(() => {
      set({ alerts: { type: "", content: "" } });
    }, 6000)
  },
  setAdminView: (val) => {
    set({ adminView: val });
  },
  setBettingAmount: (val) => {
    set({ bettingAmount: val });
  },
  setBoardClickedState: (val) => {
    set({ boardClickedState: val });
  },
  setBoardState: (value) => {
    set({ boardState: value });
  },
  setBonusNugAmount: (value) => {
    set({ bonusNugAmount: value });
  },
  setDoubleCheck: (val) => {
    set({ doubleCheck: val });
  },
  setClicked: (val) => {
    set({ clicked: val });
  },
  setCurrencyMode: (val) => {
    set({ currencyMode: val });
  },
  setDoubleGameWin: (val) => {
    set({ doubleGameWin: val });
  },
  setDoubleGameLose: (val) => {
    set({ doubleGameLose: val });
  },
  setDoubleHouseEdge: (val) => {
    set({ doubleHouseEdge: val });
  },
  setEnableMines: (val) => {
    set({enableMines: val})
  },
  setEnableDouble: (val) => {
    set({enableDouble: val})
  },
  setEnableLoot: (val) => {
    set({enableLoot: val})
  },
  setEnableTurtle: (val) => {
    set({enableTurtle: val})
  },
  setFactor1: (val) => {
    set({ factor1: val });
  },
  setFactor2: (val) => {
    set({ factor2: val });
  },
  setFactor3: (val) => {
    set({ factor3: val });
  },
  setFactor4: (val) => {
    set({ factor4: val });
  },
  setHack: (val) => {
    set({ hack: val });
  },
  
  setGameHistory: (value) => {
    set({ gameHistory: value });
  },
  setGameMode: (val) => {
    set({ gameMode: val });
  },
  setGameState: (val) => {
    set({ gameState: val });
  },
  setGameStep: (val) => {
    set({ gameStep: val });
  },
  
  setGameTHistory: (value) => {
    set({ gameTHistory: value });
  },
  setGameWin: (val) => {
    set({ gameWin: val })
  },
  setGameLose: (val) => {
    set({ gameLose: val })
  },
  setGemAmount: (val) => {
    set({gemAmount: val})
  },
  setIsAdmin: (val) => {
    set({ isAdmin: val })
  },
  setIs_backgroundMusic: (val) => {
    set({ is_backgroundmusic: val });
  },
  setIsHolder: (val) => {
    set({ isHolder: val });
  },
  setIsReward: (val) => {
    set({ isReward: val });
  },
  setIsMuted: (val) => {
    set({ isMuted: val });
  },
  setLoading: (val) => {
    set({ loading: val });
  },
  setLoggedIn: (val) => {
    set({ loggedIn: val });
  },
  setMaxMine: (val) => {
    set({ maxMine: val });
  },
  setMinMine: (val) => {
    set({ minMine: val });
  },
  setMineAmount: (val) => {
    set({ mineAmount: val });
  },
  setMineGameWin: (val) => {
    set({ mineGameWin: val });
  },
  setMineGameLose: (val) => {
    set({ mineGameLose: val });
  },
  setMineHouseEdge: (val) => {
    set({ mineHouseEdge: val })
  },
  setNetGainList: (val) => {
    set({ netGainList: val });
  },
  setNextMultiplier: (val) => {
    set({ nextMultiplier: val });
  },
  setNfts: (val) => {
    set({ nfts: val });
  },
  setNftAvatar: (val) => {
    set({ nftAvatar: val });
  },
  setNftAvatars: (val) => {
    set({ nftAvatars: val });
  },
  setNugAmount: (val) => {
    set({ nugAmount: val });
  },
  
  setNumber: (val) => {
    set({ number: val });
  },
  setPreviousMultiplier: (val) => {
    set({ previousMultiplier: val });
  },
  setRaffles: (val) => {
    set({ raffles: val });
  },
  setRaffleMode: (val) => {
    set({ raffleMode: val });
  },
  setRemain: (value) => {
    set({ remain: value });
  },
  setShowSidebar: (val) => {
    set({ showSidebar: val });
  },
  setShowToast: (val) => {
    set({showToast: val});
  },
  setNugAmount: (val) => {
    set({ nugAmount: val });
  },
  setSolanaTps: (val) => {
    set({ solanaTps: val });
  },
  setSpinCount: (val) => {
    set({ spinCount: val });
  },
  setSpinDate: (val) => {
    set({ spinDate: val });
  },
  setStreakNum: (val) => {
    set({ streakNum: val });
  },
  setThemeBlack: (val) => {
    set({ themeBlack: val });
  },
  setTimer: (val) => {
    set({ timer: val });
  },
  setRaffleDate: (val) => {
    set({ raffleDate: val });
  },
  setUserName: (val) => {
    set({ userName: val });
  },
  setWalletAddress: (value) => {
    set({ wallletAddress: value });
  },
  setWalletAddressList: (val) => {
    set({ walletAddressList: val });
  },
  setWinNum: (val) => {
    set({ winNum: val });
  },
}));

export default useGameStore;