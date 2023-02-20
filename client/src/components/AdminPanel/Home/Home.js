import axios from "axios";
import { useMemo, useEffect, useState } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import DataTable from "react-data-table-component";
import { useWallet } from "@solana/wallet-adapter-react";

import "./Home.scss";
import useGameStore from "../../../GameStore";
import getNum from "../../GamePlay/Tools/Calculate";

const Home = () => {
  const { publicKey } = useWallet();

  const { setAlerts } = useGameStore();
  const { number, setNumber } = useGameStore();
  const { factor1, factor2, factor3, factor4 } = useGameStore();


  const [nugList, setNugList] = useState();
  const [playList, setPlayList] = useState();
  const [listMode, setListMode] = useState(0);
  const [ticketData, setTicketData] = useState();
  const [addingTicket, setAddingTicket] = useState([]);
  const [viewNugData, setViewNugData] = useState(false);
  const [transactionList, setTransactionList] = useState();
  const [depositList, setDepositList] = useState();
  const [NFTList, setNFTList] = useState();
  const [playFilterText, setPlayFilterText] = useState("");
  const [ticketFilterText, setTicketFilterText] = useState("");
  const [ticketWalletText, setTicketWalletText] = useState("");
  const [transactionFilterText, setTransactionFilterText] = useState("");
  const [depositFilterText, setDepositFilterText] = useState("");
  const [NFTFilterText, setNFTFilterText] = useState("");
  const [playResetPaginationToggle, setPlayResetPaginationToggle] = useState(false);
  const [ticketResetPaginationToggle, setTicketResetPaginationToggle] = useState(false);
  const [transactionResetPaginationToggle, setTransactionResetPaginationToggle] = useState(false);
  const [NFTResetPaginationToggle, setNFTResetPaginationToggle] = useState(false);
  const [depositResetPaginationToggle, setDepositResetPaginationToggle] = useState(false);

  const solscan = "https://solscan.io/";

  useEffect(() => {
    getPlayList();
    getTicketList();
    getTransacntionList();
    getDepositList();
    getNFTList();
  }, [])

  const getPlayList = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getAll`)
        .then((res) => {
          setPlayList(res.data);
        });
    } catch (err) {
      console.log("Error while getting playList: ", err);
      setAlerts({
        type: "error",
        content: err.message
      })
    }
  }

  const getTicketList = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getTicket`)
        .then((res) => {
          let plays = []
          res.data.map((list, key) => {
            let play = {
              id: key,
              walletAddress: list.walletAddress,
              number: list.number
            }
            addingTicket.push("");
            plays.push(play)
          })
          setTicketData(plays);
        });
    } catch (err) {
      console.log("Error while getting playList: ", err);
      setAlerts({
        type: "error",
        content: err.message
      })
    }
  }

  const getTransacntionList = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getAllTHistory`)
        .then((res) => {
          res.data.forEach((list) => {
            if (list.type === "NFTDeposit" || list.transaction === "Nugget") {
              list.amount = parseFloat(parseFloat(list.amount).toFixed(3)) + " NUG"
            } else {
              list.amount = parseFloat(parseFloat(list.amount).toFixed(3)) + " SOL"
            }
          })
          setTransactionList(res.data);
        });
    } catch (err) {
      console.log("Error while getting Transaction List: ", err);
      setAlerts({
        type: "error",
        content: err.message
      })
    }
  }
  const getDepositList = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getDepositHistory`)
        .then((res) => {
          setDepositList(res.data);
        });
    } catch (err) {
      console.log("Error while getting Transaction List: ", err);
      setAlerts({
        type: "error",
        content: err.message
      })
    }
  }
  const getNFTList = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getNFTHistory`)
        .then((res) => {
          setNFTList(res.data);
        });
    } catch (err) {
      console.log("Error while getting Transaction List: ", err);
      setAlerts({
        type: "error",
        content: err.message
      })
    }
  }

  const changeListMode = (e) => {
    setListMode(e);
    setViewNugData(false);
  }

  const getNugDatas = async (walletAddress) => {
    const body = {
      walletAddress: walletAddress
    };
    const nugData = await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getNugData`, body)
    let sum = 0;
    nugData.data.forEach((nData) => {
      if ((nData.type === "Play with NUGGETs") || nData.type === "NFTDeposit" || nData.transaction === "Nugget" || nData.type === "Bonus Reward" || (nData.type === "Spin" && nData.amount > 1)) {
        nData.amount = parseFloat(parseFloat(nData.amount).toFixed(3)) + " NUG"
      }
      else if (nData.type === "Play with GEM") {
        nData.amount = parseFloat(parseFloat(nData.amount).toFixed(3)) + "GEM"
      }
      else {
        sum = parseFloat(nData.amount) + sum;
        nData.amount = parseFloat(parseFloat(nData.amount).toFixed(3)) + " SOL"
      }
    })

    nugData.data.push({
      type: "Total",
      amount: parseFloat(parseFloat(sum).toFixed(3)),
      date: "-"
    })
    setNugList(nugData.data);
    setViewNugData(true);
  }

  const addOne = async ({ walletAddress, id }) => {
    const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
    if (num) {
      const body = {
        walletAddress: walletAddress,
        host: publicKey.toBase58(),
        addingTicket: addingTicket[id],
        num: num
      }
      const result = await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/addTicket`, body)
      if (result.data.status) {
        await getTicketList();
        setAlerts({
          type: "success",
          content: "Add Ticket succeed."
        })
      } else {
        setAlerts({
          type: "error",
          content: "Add Ticket Failed."
        })
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  }

  const nugColumns = [
    {
      name: "Type",
      selector: (list) => list.type,
      sortable: true,
      grow: 0.5
    },
    {
      name: "Amount",
      selector: (list) => list.amount,
      sortable: true,
      grow: 0.5
    },
    {
      name: "Date",
      selector: (list) => list.date,
      sortable: true,
      grow: 0.8
    },
  ];
  const playColumns = [
    {
      name: "GameMode",
      selector: (list) => list.game,
      sortable: true,
      grow: 0.4
    },
    {
      name: "Mine",
      selector: (list) => list.mine,
      sortable: true,
      grow: 0.2
    },
    {
      name: "Coin",
      selector: (list) => list.coin,
      sortable: true,
      grow: 0.2
    },
    {
      name: "Payout",
      selector: (list) => list.currencyMode === "mainNug" ? parseFloat(parseFloat(list.payout ? list.payout : 0 - list.wager).toFixed(3)) + "SOL" : (parseFloat(parseFloat(list.payout ? list.payout : 0 - list.wager).toFixed(3)) + (list.currencyMode === "bonusNug" ? "NUG" : "GEM")),
      sortable: true,
      grow: 0.3
    },
    {
      name: "Wager",
      selector: (list) => list.currencyMode === "mainNug" ? parseFloat(parseFloat(list.wager).toFixed(3)) + " SOL" : (parseFloat(parseFloat(list.wager).toFixed(3)) + (list.currencyMode === "bonusNug" ? "NUG" : "GEM")),
      sortable: true,
      grow: 0.3
    },
    {
      name: "Player",
      selector: (list) => list.player,
      sortable: true,
      hide: "md",
      grow: 0.3
    },
    {
      name: "Wallet Address",
      selector: (list) => <Box style={{ textDecoration: "underline" }} onClick={() => getNugDatas(list.walletAddress)}>{list.walletAddress}</Box>,
      sortable: true,
      hide: "md",
      grow: 1
    },
  ];
  const ticketColumns = [
    {
      name: "WalletAddress",
      selector: (list) => list.walletAddress,
      sortable: true
    },
    {
      name: "Number of Tickets",
      selector: (list) => parseInt(list.number),
      sortable: true,
    },
    {
      name: "Add/Remove",
      selector: (list) => <Box>
        <input type="number" value={addingTicket[list.id]} onChange={(e) => {
          setAddingTicket(addingTicket.map((at, key) => {
            if (key === list.id) return e.target.value
            else return at
          }))
        }} />
        <button onClick={() => addOne({ walletAddress: list.walletAddress, id: list.id })}>
          Add
        </button>
      </Box>,
      sortable: true,
    },
  ];
  const transactionColumns = [
    {
      name: "Transaction",
      selector: (list) => <a href={`${solscan}tx/${list.transaction}`} style={{ color: "black" }} target="_blank" rel="noreferrer">{list.transaction}</a>,
      grow: 0.7
    },
    {
      name: "Withdraw/Deposit",
      selector: (list) => list.type,
      sortable: true,
      grow: 0.5
    },
    {
      name: "Amount",
      selector: (list) => list.amount,
      sortable: true,
      grow: 0.5
    },
    {
      name: "Wallet Address",
      selector: (list) => list.walletAddress,
      sortable: true,
      hide: "md",
      grow: 1
    },
    {
      name: "Date",
      selector: (list) => list.date,
      sortable: true,
      hide: "md",
      grow: 0.5
    },
  ];
  const depositColumns = [
    {
      name: "WalletAddress",
      selector: (list) => list.walletAddress,
      sortable: true,
      grow: 0.7
    },
    {
      name: "NFT Name",
      selector: (list) => list.nftName,
      sortable: true,
      grow: 0.5
    },
  ];
  const NFTColumns = [
    {
      name: "Mint Address",
      selector: (list) => list.NFTAddress,
      sortable: true,
      grow: 0.7
    },
    {
      name: "NFT Name",
      selector: (list) => list.date,
      sortable: true,
      grow: 0.5
    },
  ];

  const playFilteredList = playList?.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(playFilterText.toLowerCase()) !== -1
  );
  const ticketFilteredList = ticketData?.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(ticketFilterText.toLowerCase()) !== -1
  );
  const transactionFilteredList = transactionList?.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(transactionFilterText.toLowerCase()) !== -1
  );
  const depositFilteredList = depositList?.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(depositFilterText.toLowerCase()) !== -1
  );
  const NFTFilteredList = NFTList?.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(NFTFilterText.toLowerCase()) !== -1
  );
  const playSubHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (playFilterText) {
        setPlayResetPaginationToggle(!playResetPaginationToggle);
        setPlayFilterText("");
      }
    };
    return (
      <>
        <input
          id="search"
          type="text"
          placeholder="Filter table data..."
          value={playFilterText}
          onChange={e => setPlayFilterText(e.target.value)}
        />
        <button onClick={handleClear}>X</button>
      </>
    );
  }, [playFilterText, playResetPaginationToggle]);

  const ticketSubHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (ticketFilterText) {
        setTicketResetPaginationToggle(!ticketResetPaginationToggle);
        setTicketFilterText("");
      }
    };
    const addTicketWallet = async () => {
      if (ticketWalletText) {
        const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
        if (num) {
          const body = {
            host: publicKey.toBase58(),
            walletAddress: ticketWalletText,
            num: num
          }
          const result = await axios
            .post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/addTicketWallet`, body)
          if (result.data.status) {
            getTicketList();
            setTicketWalletText("");
          } else {
            setAlerts({
              type: "error",
              content: "Error while adding ticketWallet"
            })
          }
        }
        else {
          setAlerts({
            type: "error",
            content: "Please try again."
          })
        }
      }
    }
    return (
      <Box className="ticketSubComponent">
        <Box className="inputGroup">
          <input
            id="search"
            type="text"
            placeholder="WalletAddress to add ticket..."
            value={ticketWalletText}
            onChange={e => setTicketWalletText(e.target.value)}
          />
          <button onClick={addTicketWallet}>ADD</button>
        </Box>
        <Box className="inputGroup">
          <input
            id="search"
            type="text"
            placeholder="Filter table data..."
            value={ticketFilterText}
            onChange={e => setTicketFilterText(e.target.value)}
          />
          <button onClick={handleClear}>X</button>
        </Box>
      </Box>
    );
  }, [ticketFilterText, ticketWalletText, ticketResetPaginationToggle]);

  const transactionSubHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (transactionFilterText) {
        setTransactionResetPaginationToggle(!transactionResetPaginationToggle);
        setTransactionFilterText("");
      }
    };
    return (
      <Box className="transactionFilter">
        <input
          id="search"
          type="text"
          placeholder="Filter table data..."
          value={transactionFilterText}
          onChange={e => setTransactionFilterText(e.target.value)}
        />
        <button onClick={handleClear}>X</button>
      </Box>
    );
  }, [transactionFilterText, transactionResetPaginationToggle]);
  const depositSubHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (depositFilterText) {
        setDepositResetPaginationToggle(!depositResetPaginationToggle);
        setDepositFilterText("");
      }
    };
    return (
      <Box className="depositFilter">
        <input
          id="search"
          type="text"
          placeholder="Filter table data..."
          value={depositFilterText}
          onChange={e => setDepositFilterText(e.target.value)}
        />
        <button onClick={handleClear}>X</button>
      </Box>
    );
  }, [depositFilterText, depositResetPaginationToggle]);
  const NFTSubHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (NFTFilterText) {
        setNFTResetPaginationToggle(!NFTResetPaginationToggle);
        setNFTFilterText("");
      }
    };
    return (
      <Box className="NFTFilter">
        <input
          id="search"
          type="text"
          placeholder="Filter table data..."
          value={NFTFilterText}
          onChange={e => setNFTFilterText(e.target.value)}
        />
        <button onClick={handleClear}>X</button>
      </Box>
    );
  }, [NFTFilterText, NFTResetPaginationToggle]);

  return (
    <Box className="home">
      <Box className="listModeGroup">
        <Typography className={!listMode ? "listMode focused" : "listMode"} onClick={() => changeListMode(0)}>
          Play History
        </Typography>
        <Typography className={listMode === 3 ? "listMode focused" : "listMode"} onClick={() => changeListMode(3)}>
          Deposit History
        </Typography>
        <Typography className={listMode === 4 ? "listMode focused" : "listMode"} onClick={() => changeListMode(4)}>
          Mint History
        </Typography>
        <Typography className={listMode === 1 ? "listMode focused" : "listMode"} onClick={() => changeListMode(1)}>
          Ticket Balance
        </Typography>
        <Typography className={listMode === 2 ? "listMode focused" : "listMode"} onClick={() => changeListMode(2)}>
          Transaction History
        </Typography>
      </Box>
      {viewNugData &&
        (<Box className="nugData">
          <DataTable
            columns={nugColumns}
            data={nugList}
            defaultSortField="name"
            striped
            pagination
          />
        </Box>)}
      {listMode === 0 && !viewNugData &&
        <DataTable
          columns={playColumns}
          data={playFilteredList}
          defaultSortField="name"
          striped
          pagination
          paginationRowsPerPageOptions={[10, 30, 50, 100]}
          subHeader
          subHeaderComponent={playSubHeaderComponent}
        />}
      {listMode === 1 && !viewNugData &&
        <DataTable
          columns={ticketColumns}
          data={ticketFilteredList}
          defaultSortField="name"
          striped
          pagination
          subHeader
          subHeaderComponent={ticketSubHeaderComponent}
        />}
      {listMode === 2 && !viewNugData &&
        <DataTable
          columns={transactionColumns}
          data={transactionFilteredList}
          defaultSortField="name"
          striped
          pagination
          subHeader
          subHeaderComponent={transactionSubHeaderComponent}
        />}
      {listMode === 3 && !viewNugData &&
        <DataTable
          columns={depositColumns}
          data={depositFilteredList}
          defaultSortField="name"
          striped
          pagination
          subHeader
          subHeaderComponent={depositSubHeaderComponent}
        />}
      {listMode === 4 && !viewNugData &&
        <DataTable
          columns={NFTColumns}
          data={NFTFilteredList}
          defaultSortField="name"
          striped
          pagination
          subHeader
          subHeaderComponent={NFTSubHeaderComponent}
        />}
    </Box>
  );
}

export default Home;