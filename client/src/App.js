import backgroundmusicc from "./assets/audios/backgroundmusic.mp3";

import {
  GlowWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import GamePlay from "./pages/GamePlay";
import Leaderboard from "./pages/Leaderboard";
import { Container } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import { useMemo, useEffect, useState } from "react";

import useGameStore from "./GameStore";
import "@fontsource/mada";
import useSound from "use-sound";
import AdminDashboard from "./pages/AdminDashboard";
import NotFoundPage from "./pages/NotFound";
import DoubleGame from "./pages/DoubleGame";
import Bonuses from "./pages/Bonuses";
import ComingSoon from "./pages/ComingSoon";
import ArbiCasino from "./pages/ArbiCasino";
import FAQs from "./pages/FAQs.js";
import Turtle from "./pages/Turtle.js";
import Landing from "./pages/Landing";
import PirateDeposit from "./pages/PirateDeposit";
import MintNFTs from "./pages/MintNFTs";
import Roulette from './components/GamePlay/Roulette/roulette';
import Limbo from './pages/Limbo.js';
import Crash from './components/GamePlay/Crash/Crash';
import Dice from './pages/Dice.js';

import { StoreContext } from './store';


require("@solana/wallet-adapter-react-ui/styles.css");

function App() {

  const { setGameMode } = useGameStore();
  const { setMineAmount } = useGameStore();
  const { isMuted } = useGameStore();
  const [is_backgroundmusic, setIs_backgroundMusic] = useState(false);
  const [bgmusic] = useSound(backgroundmusicc, {
    volume: isMuted ? 1 : 0,
    loop: true,
  });

  const solNetwork = "mainnet-beta";
  const endpoint = process.env.REACT_APP_QUICK_NODE;

  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [daiBalance, setDaiBalance] = useState(0);
  const [ depositAmount, setDepositAmount] = useState(0.0001);
  const [ payout, setPayout] = useState('1.98');
  const [ limboHistory, setLimboHistory] = useState([]);
  const [ diceHistory, setDiceHistory] = useState([]);
  const [ start, setStart] = useState(false);
  const [ percent, setPercent] = useState('50');

  useEffect(() => {
    if (window.location.href.includes("game/coins")) {
      setGameMode("double")
      setMineAmount(1);
    } else if((window.location.href.includes("game/loot"))) {
      setGameMode("loot")
    } else if((window.location.href.includes("game/limbo"))) {
      setGameMode("limbo")
    } else if((window.location.href.includes("game/dice"))) {
      setGameMode("dice")
    } else {
      setGameMode("minesrush")
      setMineAmount(5);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", click);
    bgmusic()
  }, [bgmusic]);

  const click = () => {
    if (is_backgroundmusic) return;
    setIs_backgroundMusic(true);
  };
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ solNetwork }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletExtensionWalletAdapter(),
      new SolletWalletAdapter(),
    ],
    [solNetwork]
  );


  const value = {
    walletConnected, setWalletConnected,
    walletAddress, setWalletAddress,
    balance, setBalance,
    daiBalance, setDaiBalance,
    depositAmount, setDepositAmount,
    payout, setPayout,
    limboHistory, setLimboHistory,
    diceHistory, setDiceHistory,
    start, setStart,
    percent, setPercent,
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <StoreContext.Provider value= {value}>
          <WalletModalProvider>
            <Container className="App" disableGutters={true} maxWidth={false}>
              <Router basename="/game">
                <Routes>
                  <Route path={`/`} element={<Landing />} />
                  <Route path={`/admindashboard`} element={<AdminDashboard /*socket={socket}*/ />} />
                  <Route path={`/mines`} element={ <GamePlay /*socket={socket}*/ />} />
                  <Route path={`/coins`} element={ <DoubleGame />} />
                  <Route path={`/leaderboard`} element={ <Leaderboard />} />
                  <Route path={`/bonuses`} element={ <Bonuses /*socket={socket}*/ />} />
                  <Route path={`/loot`} element={ <ArbiCasino />} />
                  <Route path={`/FAQs`} element={ <FAQs />} />
                  <Route path={`/turtles`} element={ <Turtle />} />
                  <Route path={`/pirateDeposit`} element={ <PirateDeposit />} />
                  <Route path={`/mintNFTs`} element={ <MintNFTs />} />
                  <Route path={`/*`} element={<NotFoundPage />} />
                  <Route path={`/roulette`} element={<Roulette />} />
                  <Route path={`/limbo`} element={<Limbo />} />
                  <Route path={`/crash`} element={<Crash />} />
                  <Route path={`/dice`} element={<Dice />} />
                </Routes>
              </Router>
            </Container>
          </WalletModalProvider>
        </StoreContext.Provider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;