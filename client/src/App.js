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
import { StoreContext } from './store';


require("@solana/wallet-adapter-react-ui/styles.css");

function App() {

  const { setGameMode } = useGameStore();
  const { setMineAmount } = useGameStore();
  const { isMuted } = useGameStore();
  const { enableMines, enableDouble, enableLoot, enableTurtle} = useGameStore();
  const [is_backgroundmusic, setIs_backgroundMusic] = useState(false);
  const [bgmusic] = useSound(backgroundmusicc, {
    volume: isMuted ? 1 : 0,
    loop: true,
  });

  const solNetwork = "mainnet-beta";
  const endpoint = process.env.REACT_APP_QUICK_NODE;

  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    if (window.location.href.includes("game/coins")) {
      setGameMode("double")
      setMineAmount(1);
    } else if((window.location.href.includes("game/loot"))) {
      setGameMode("loot")
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
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <StoreContext.Provider value= {value}>
          <WalletModalProvider>
            <Container className="App" disableGutters={true} maxWidth={false}>
              <Router basename="/game">
                <Routes>
                  <Route path={`/`} element={ process.env.REACT_APP_COMING_SOON === "true" ? <ComingSoon /> : <Landing />} />
                  <Route path={`/admindashboard`} element={<AdminDashboard /*socket={socket}*/ />} />
                  { enableMines && <Route path={`/mines`} element={ process.env.REACT_APP_COMING_SOON === "true" ? <ComingSoon /> : <GamePlay /*socket={socket}*/ />} />}
                  { enableDouble && <Route path={`/coins`} element={ process.env.REACT_APP_COMING_SOON === "true" ? <ComingSoon /> : <DoubleGame />} />}
                  <Route path={`/leaderboard`} element={ process.env.REACT_APP_COMING_SOON === "true" ? <ComingSoon /> : <Leaderboard />} />
                  <Route path={`/bonuses`} element={ process.env.REACT_APP_COMING_SOON === "true" ? <ComingSoon /> : <Bonuses /*socket={socket}*/ />} />
                  { enableLoot && <Route path={`/loot`} element={ process.env.REACT_APP_COMING_SOON === "true" ? <ComingSoon /> : <ArbiCasino />} />}
                  <Route path={`/FAQs`} element={ process.env.REACT_APP_COMING_SOON === "true" ? <ComingSoon /> : <FAQs />} />
                  { enableTurtle && <Route path={`/beta-turtles`} element={ process.env.REACT_APP_COMING_SOON === "true" ? <ComingSoon /> : <Turtle />} />}
                  <Route path={`/pirateDeposit`} element={ process.env.REACT_APP_COMING_SOON === "true" ? <ComingSoon /> : <PirateDeposit />} />
                  <Route path={`/mintNFTs`} element={ process.env.REACT_APP_COMING_SOON === "true" ? <ComingSoon /> : <MintNFTs />} />
                  {/* <Route path={`/comingSoon`} element={<ComingSoon />} /> */}
                  <Route path={`/*`} element={<NotFoundPage />} />
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