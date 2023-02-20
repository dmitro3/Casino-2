import Logo from "../Logo";
import GameBoard from "../GameBoard";
import BettingPanel from "../BettingPanel/BettingPanel";
import RecentPlays from "../RecentPlays";
import GameInfo from "../GameInfo/GameInfo";
const Content = ({
  loading,
  setLoading,
  depositText,
  setDepositText,
  // socket,
}) => {
  return (
    <>
      <Logo />
      <GameBoard />
      <BettingPanel
        loading={loading}
        setLoading={setLoading}
        depositText={depositText}
        setDepositText={setDepositText}
      />
      <GameInfo />
      <RecentPlays />
    </>
  );
};

export default Content;
