import axios from "axios";
import { useMemo, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
} from "@mui/material";
import DataTable from "react-data-table-component";
import { useWallet } from "@solana/wallet-adapter-react";

import useGameStore from "../../../GameStore";
import user from "../../../assets/images/defaultUser.jpg"

import "./User.scss";
import getNum from "../../GamePlay/Tools/Calculate";

const User = () => {

  const { publicKey, connected, signTransaction } = useWallet();
  const { setAlerts } = useGameStore();
  const { number, setNumber } = useGameStore();
  const { factor1, factor2, factor3, factor4 } = useGameStore();

  const [userList, setUserList] = useState();
  const [hackList, setHackList] = useState();
  const [holderList, setHolderList] = useState();
  const [whiteList, setWhiteList] = useState();
  const [withdrawBanList, setWithdrawBanList] = useState();
  const [listMode, setListMode] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [bonusNug, setBonusNug] = useState([]);
  const [gemReward, setGemReward] = useState([]);
  const [userFilterText, setUserFilterText] = useState("");
  const [hackFilterText, setHackFilterText] = useState("");
  const [holderFilterText, setHolderFilterText] = useState("");
  const [whiteFilterText, setWhiteFilterText] = useState("");
  const [withdrawBanFilterText, setWithdrawBanFilterText] = useState("");
  const [hackWallet, setHackWallet] = useState("");
  const [userWallet, setUserWallet] = useState("");
  const [holderWallet, setHolderWallet] = useState("");
  const [whiteWallet, setWhiteWallet] = useState("");
  const [withdrawBanWallet, setWithdrawBanWallet] = useState("");
  const [nftAmount, setNFTAmount] = useState("");
  const [userResetPaginationToggle, setUserResetPaginationToggle] = useState(false);
  const [hackResetPaginationToggle, setHackResetPaginationToggle] = useState(false);
  const [holderResetPaginationToggle, setHolderResetPaginationToggle] = useState(false);
  const [whiteResetPaginationToggle, setWhiteResetPaginationToggle] = useState(false);
  const [withdrawBanResetPaginationToggle, setWithdrawBanResetPaginationToggle] = useState(false);

  useEffect(() => {
    getUserList();
    getHackList();
    getHolderList();
    getWhiteList();
    getWithdrawList();
  }, [])

  const getUserList = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getAllUsers`)
        .then((res) => {
          let users = [];
          res.data.map((list, key) => {
            let data = {
              avatar: list.avatar,
              id: key,
              walletAddress: list.walletAddress,
              userName: list.userName,
              nugAmount: list.nugAmount,
              gemAmount: list.gemAmount,
              bonusNugAmount: list.bonusNugAmount,
              holder: list.holder,
              deviceId: list.deviceId
            };
            users.push(data);
            if (rewards.length <= key) {
              rewards.push("");
              bonusNug.push("");
              gemReward.push("");
            }
          })
          setUserList(users);
        });
    } catch (err) {
      console.log("Error while getting userList: ", err);
      setAlerts({
        type: "error",
        content: err.message
      })
    }
  }
  const getHackList = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getAllHackers`)
        .then((res) => {
          setHackList(res.data);
        });
    } catch (err) {
      console.log("Error while getting hackerList: ", err);
      setAlerts({
        type: "error",
        content: err.message
      })
    }
  }
  const getHolderList = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getAllHolders`)
        .then((res) => {
          if (res.status) {
            setHolderList(res.data.content);
          } else {
            setAlerts({
              type: "error",
              content: "Error while getting holder list."
            })
          }
        });
    } catch (err) {
      console.log("Error while getting holderList: ", err);
      setAlerts({
        type: "error",
        content: err.message
      })
    }
  }
  const getWhiteList = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getWhiteList`)
        .then((res) => {
          if (res.status) {
            setWhiteList(res.data);
          } else {
            setAlerts({
              type: "error",
              content: "Error while getting white list."
            })
          }
        });
    } catch (err) {
      console.log("Error while getting white List: ", err);
      setAlerts({
        type: "error",
        content: err.message
      })
    }
  }
  const getWithdrawList = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getWithdrawList`)
        .then((res) => {
          if (res.status) {
            setWithdrawBanList(res.data);
          } else {
            setAlerts({
              type: "error",
              content: "Error while getting withdraw Ban list."
            })
          }
        });
    } catch (err) {
      console.log("Error while getting white List: ", err);
      setAlerts({
        type: "error",
        content: err.message
      })
    }
  }

  const changeListMode = (e) => {
    setListMode(e);
    setHolderWallet("");
    setNFTAmount("");
    setHackWallet("");
    setUserWallet("");
    setWhiteWallet("");
    setWithdrawBanWallet("");
  }

  const handleRewards = async (walletAddress, id) => {
    try {
      const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
      if (num) {
        const body = {
          host: publicKey.toBase58(),
          walletAddress: walletAddress,
          amount: rewards[id],
          num: num
        }
        const res = await axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/giveReward`, body);
        if (res.data.status) {
          getUserList();
          setAlerts({
            type: "success",
            content: "Give Rewards Succeed"
          });
        } else {
          setAlerts({
            type: "error",
            content: "Give Reward Failed"
          })
        }
      } else {
        setAlerts({
          type: "error",
          content: "Please try again."
        })
      }
    } catch (err) {
      console.log("Error while give rewards", err);
    }
  }
  const handleBRewards = async (walletAddress, id) => {
    try {
      const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
      if (num) {
        const body = {
          host: publicKey.toBase58(),
          walletAddress: walletAddress,
          amount: bonusNug[id],
          num: num
        }
        const res = await axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/giveBReward`, body);
        if (res.data.status) {
          getUserList();
          setAlerts({
            type: "success",
            content: "Give Rewards Succeed"
          });
        } else {
          setAlerts({
            type: "error",
            content: "Give Reward Failed"
          })
        }
      } else {
        setAlerts({
          type: "error",
          content: "Please try again."
        })
      }
    } catch (err) {
      console.log("Error while give rewards", err);
    }
  }
  const handleGemRewards = async (walletAddress, id) => {
    try {
      const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
      if (num) {
        const body = {
          host: publicKey.toBase58(),
          walletAddress: walletAddress,
          amount: gemReward[id],
          num: num
        }
        const res = await axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/giveGemReward`, body);
        if (res.data.status) {
          getUserList();
          setAlerts({
            type: "success",
            content: "Give Rewards Succeed"
          });
        } else {
          setAlerts({
            type: "error",
            content: "Give Reward Failed"
          })
        }
      } else {
        setAlerts({
          type: "error",
          content: "Please try again."
        })
      }
    } catch (err) {
      console.log("Error while give rewards", err);
    }
  }
  const deleteUser = async (wallet) => {
    const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
    if (num) {

      const body = {
        host: publicKey.toBase58(),
        walletAddress: wallet,
        num: num
      }
      const res = await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/deleteUser`, body)
      if (res.data.status) {
        await getUserList();
      } else {
        setAlerts({
          type: "error",
          content: "Delete User Failed"
        })
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  }
  const addUser = async () => {
    const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
    if (num) {

      const body = {
        host: publicKey.toBase58(),
        walletAddress: userWallet,
        num: num
      }
      const res = await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/addUser`, body)
      if (res.data.status) {
        await getUserList();
        setUserWallet("");
      } else {
        setAlerts({
          type: "error",
          content: "Add User Failed"
        })
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  }
  const addHacker = async () => {
    const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
    if (num) {

      const body = {
        host: publicKey.toBase58(),
        walletAddress: hackWallet,
        num: num
      }
      const res = await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/addHack`, body)
      if (res.data.status) {
        await getHackList();
        setHackWallet("");
      } else {
        setAlerts({
          type: "error",
          content: "Add hacker failed"
        })
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  }
  const deleteHacker = async (wallet) => {
    const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
    if (num) {

      const body = {
        host: publicKey.toBase58(),
        walletAddress: wallet,
        num: num
      }
      const res = await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/deleteHack`, body)
      if (res.data.status) {
        await getHackList();
      } else {
        setAlerts({
          type: "error",
          content: "Delete Hacker Failed"
        })
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  }
  const addHolder = async () => {
    const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
    if (num) {

      const body = {
        host: publicKey.toBase58(),
        walletAddress: holderWallet,
        nftAmount: nftAmount,
        num: num
      }
      const res = await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/addHolder`, body)
      if (res.data.status) {
        await getHolderList();
        setHolderWallet("");
        setNFTAmount("");
      } else {
        setAlerts({
          type: "error",
          content: "Add Holder failed"
        })
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  }
  const addWhite = async () => {
    const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
    if (num) {

      const body = {
        host: publicKey.toBase58(),
        walletAddress: whiteWallet,
        num: num
      }
      const res = await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/addWhite`, body)
      if (res.data.status) {
        await getWhiteList();
        setWhiteWallet("");
      } else {
        setAlerts({
          type: "error",
          content: "White Listing failed"
        })
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  }
  const deleteWhite = async (wallet) => {
    const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
    if (num) {
      const body = {
        host: publicKey.toBase58(),
        walletAddress: wallet,
        num: num
      }
      const res = await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/deleteWhite`, body)
      if (res.data.status) {
        await getWhiteList();
      } else {
        setAlerts({
          type: "error",
          content: "Delete White Failed"
        })
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  }
  const addWithdraw = async () => {
    const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
    if (num) {
      const body = {
        host: publicKey.toBase58(),
        walletAddress: withdrawBanWallet,
        num: num
      }
      const res = await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/addWithdrawBanWallet`, body)
      if (res.data.status) {
        await getWithdrawList();
        setWithdrawBanWallet("");
      } else {
        setAlerts({
          type: "error",
          content: "WithdrawBan Listing failed"
        })
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  }
  const deleteWithdraw = async (wallet) => {
    const num = await getNum(publicKey.toBase58(), factor1, factor2, factor3, factor4)
    if (num) {
      const body = {
        host: publicKey.toBase58(),
        walletAddress: wallet,
        num: num
      }
      const res = await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/deleteWithdraw`, body)
      if (res.data.status) {
        await getWithdrawList();
      } else {
        setAlerts({
          type: "error",
          content: "Delete Withdraw Ban Failed"
        })
      }
    } else {
      setAlerts({
        type: "error",
        content: "Please try again."
      })
    }
  }

  const userColumns = [
    {
      name: "User",
      selector: (list) => list.avatar ? <img src={list.avatar} style={{ width: "25px", height: "25px" }} alt={list.userName} /> : <img src={user} style={{ width: "25px", height: "25px" }} alt={list.userName} />,
      hide: "md",
      grow: 0.4
    },
    {
      name: "Name",
      selector: (list) => list.userName,
      sortable: true,
      grow: 0.4
    },
    {
      name: "WalletAddress",
      selector: (list) => list.walletAddress,
      sortable: true,
      grow: 1.5
    },
    {
      name: "SOL Balance",
      selector: (list) => parseFloat(parseFloat(list.nugAmount).toFixed(3)),
      sortable: true,
      grow: 0.5
    },
    {
      name: "Nug Balance",
      selector: (list) => parseFloat(parseFloat(list.bonusNugAmount).toFixed(3)),
      sortable: true,
      grow: 0.5
    },
    {
      name: "GEM Balance",
      selector: (list) => parseFloat(parseFloat(list.gemAmount).toFixed(3)),
      sortable: true,
      grow: 0.5
    },
    {
      name: "DeviceId",
      selector: (list) => list.deviceId,
      sortable: true,
      grow: 0.8
    },
    {
      name: "Is Holder?",
      selector: (list) => list.holder ? "Yes" : "No",
      sortable: true,
      grow: 0.5
    },
    {
      name: "Give SOLs",
      selector: (list) => <Box className="addNug">
        <input
          id="addNug"
          type="number"
          placeholder="Give SOLs..."
          value={rewards[list.id]}
          onChange={e => setRewards(rewards.map((reward, key) => {
            if (key === list.id) return e.target.value
            else return reward
          }))}
          style={{ width: "135px" }}
        />
        <button onClick={() => handleRewards(list.walletAddress, (list.id))}>GIVE</button>
      </Box>
    },
    {
      name: "Give Nuggets",
      selector: (list) => <Box className="addNug">
        <input
          id="addNug"
          type="number"
          placeholder="Give Nuggets..."
          value={bonusNug[list.id]}
          onChange={e => setBonusNug(bonusNug.map((bnug, key) => {
            if (key === list.id) return e.target.value
            else return bnug
          }))}
          style={{ width: "135px" }}
        />
        <button onClick={() => handleBRewards(list.walletAddress, (list.id))}>GIVE</button>
      </Box>
    },
    {
      name: "Give GEM",
      selector: (list) => <Box className="addGEM">
        <input
          id="addGEM"
          type="number"
          placeholder="Give GEM..."
          value={gemReward[list.id]}
          onChange={e => setGemReward(gemReward.map((gem, key) => {
            if (key === list.id) return e.target.value
            else return gem
          }))}
          style={{ width: "135px" }}
        />
        <button onClick={() => handleGemRewards(list.walletAddress, (list.id))}>GIVE</button>
      </Box>
    },
    {
      name: "Delete",
      selector: (list) =>
        <button onClick={() => deleteUser(list.walletAddress)}>Delete</button>,
      grow: 0.5
    }
  ];
  const holderColumns = [
    {
      name: "Holder",
      selector: (list) => list.walletAddress,
      hide: "md",
      sortable: true,
    },
    {
      name: "NFT Amount",
      selector: (list) => list.nftAmount,
      sortable: true,
      grow: 0.4
    },
    {
      name: "Player",
      selector: (list) => list.player ? "Player" : "Not Player",
      sortable: true,
      grow: 0.4
    },
  ];
  const hackColumns = [
    {
      name: "WalletAddress",
      selector: (list) => list.walletAddress,
      sortable: true,
      grow: 1
    },
    {
      name: "Reason",
      selector: (list) => list.reason,
      grow: 1
    },
    {
      name: "Date",
      selector: (list) => list.timeStamp,
      sortable: true,
    },
    {
      name: "Delete",
      selector: (list) => <button onClick={() => deleteHacker(list.walletAddress)} className="delete">Delete</button>
    }
  ];
  const whiteColumns = [
    {
      name: "WalletAddress",
      selector: (list) => list.walletAddress,
      grow: 1
    },
    {
      name: "Date",
      selector: (list) => list.timeStamp,
      sortable: true,
    },
    {
      name: "Delete",
      selector: (list) => <button onClick={() => deleteWhite(list.walletAddress)} className="delete">Delete</button>
    }
  ];
  const withdrawColumns = [
    {
      name: "WalletAddress",
      selector: (list) => list.walletAddress,
      grow: 1
    },
    {
      name: "Date",
      selector: (list) => list.timeStamp,
      sortable: true,
    },
    {
      name: "Delete",
      selector: (list) => <button onClick={() => deleteWithdraw(list.walletAddress)} className="delete">Delete</button>
    }
  ];

  const userFilteredList = userList?.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(userFilterText.toLowerCase()) !== -1
  );
  const holderFilteredList = holderList?.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(holderFilterText.toLowerCase()) !== -1
  );
  const hackFilteredList = hackList?.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(hackFilterText.toLowerCase()) !== -1
  );
  const whiteFilteredList = whiteList?.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(whiteFilterText.toLowerCase()) !== -1
  );
  const withdrawFilteredList = withdrawBanList?.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(whiteFilterText.toLowerCase()) !== -1
  );

  const userSubHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (userFilterText) {
        setUserResetPaginationToggle(!userResetPaginationToggle);
        setUserFilterText("");
      }
    };
    return (
      <Grid className="subdomain">
        <Box className="inputGroup">
          <input
            // name="hacker"
            id="user"
            type="text"
            placeholder="User wallet address..."
            value={userWallet}
            onChange={e => {
              setUserWallet(e.target.value)
            }}
          />
          <button onClick={() => addUser()}>+</button>
        </Box>
        <Box className="inputGroup">
          <input
            id="search"
            type="text"
            placeholder="Filter table data..."
            value={userFilterText}
            onChange={e => setUserFilterText(e.target.value)}
          />
          <button onClick={handleClear}>X</button>
        </Box>
      </Grid>
    );
  }, [userWallet, userFilterText, userResetPaginationToggle]);
  const holderSubHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (holderFilterText) {
        setHolderResetPaginationToggle(!holderResetPaginationToggle);
        setHolderFilterText("");
      }
    };
    return (
      <Grid className="subdomain">
        <Box className="inputGroup">
          <input
            // name="hacker"
            id="holder"
            type="text"
            placeholder="Holder wallet address..."
            value={holderWallet}
            onChange={e => {
              setHolderWallet(e.target.value)
            }}
          />
          <input
            // name="hacker"
            id="amount"
            type="number"
            placeholder="NFT Amount holder have..."
            value={nftAmount}
            onChange={e => {
              setNFTAmount(e.target.value)
            }}
          />
          <button onClick={() => addHolder()}>+</button>
        </Box>
        <Box className="inputGroup">
          <input
            id="search"
            type="text"
            placeholder="Filter table data..."
            value={holderFilterText}
            onChange={e => setHolderFilterText(e.target.value)}
          />
          <button onClick={handleClear}>X</button>
        </Box>
      </Grid>
    );
  }, [holderWallet, nftAmount, holderFilterText, holderResetPaginationToggle]);
  const hackSubHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (hackFilterText) {
        setHackResetPaginationToggle(!hackResetPaginationToggle);
        setHackFilterText("");
      }
    };
    return (
      <Grid className="subdomain">
        <Box className="inputGroup">
          <input
            // name="hacker"
            id="hacker"
            type="text"
            placeholder="Hacker wallet address..."
            value={hackWallet}
            onChange={e => {
              setHackWallet(e.target.value)
            }}
          />
          <button onClick={() => addHacker()}>+</button>
        </Box>
        <Box className="inputGroup">
          <input
            id="search"
            type="text"
            placeholder="Filter table data..."
            value={hackFilterText}
            onChange={e => setHackFilterText(e.target.value)}
          />
          <button onClick={handleClear}>X</button>
        </Box>
      </Grid>
    );
  }, [hackWallet, hackFilterText, hackResetPaginationToggle]);
  const whiteSubHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (whiteFilterText) {
        setWhiteResetPaginationToggle(!whiteResetPaginationToggle);
        setWhiteFilterText("");
      }
    };
    return (
      <Grid className="subdomain">
        <Box className="inputGroup">
          <input
            id="white"
            type="text"
            placeholder="Whitelist wallet address..."
            value={whiteWallet}
            onChange={e => {
              setWhiteWallet(e.target.value)
            }}
          />
          <button onClick={() => addWhite()}>+</button>
        </Box>
        <Box className="inputGroup">
          <input
            id="search"
            type="text"
            placeholder="Filter table data..."
            value={whiteFilterText}
            onChange={e => setWhiteFilterText(e.target.value)}
          />
          <button onClick={handleClear}>X</button>
        </Box>
      </Grid>
    );
  }, [whiteWallet, whiteFilterText, whiteResetPaginationToggle]);
  const withdrawSubHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (withdrawBanFilterText) {
        setWithdrawBanResetPaginationToggle(!withdrawBanResetPaginationToggle);
        setWithdrawBanFilterText("");
      }
    };
    return (
      <Grid className="subdomain">
        <Box className="inputGroup">
          <input
            id="withdraw"
            type="text"
            placeholder="Withdraw ban wallet address..."
            value={withdrawBanWallet}
            onChange={e => {
              setWithdrawBanWallet(e.target.value)
            }}
          />
          <button onClick={() => addWithdraw()}>+</button>
        </Box>
        <Box className="inputGroup">
          <input
            id="search"
            type="text"
            placeholder="Filter table data..."
            value={withdrawBanFilterText}
            onChange={e => setWithdrawBanFilterText(e.target.value)}
          />
          <button onClick={handleClear}>X</button>
        </Box>
      </Grid>
    );
  }, [withdrawBanWallet, withdrawBanFilterText, withdrawBanResetPaginationToggle]);

  return (
    <Grid className="home">
      <Box className="listModeGroup">
        <Typography className={listMode === 0 ? "listMode focused" : "listMode"} onClick={() => changeListMode(0)}>
          User List
        </Typography>
        <Typography className={listMode === 1 ? "listMode focused" : "listMode"} onClick={() => changeListMode(1)}>
          Holder List
        </Typography>
        <Typography className={listMode === 2 ? "listMode focused" : "listMode"} onClick={() => changeListMode(2)}>
          Hacker List
        </Typography>
        <Typography className={listMode === 4 ? "listMode focused" : "listMode"} onClick={() => changeListMode(4)}>
          Withdraw Banned List
        </Typography>
        <Typography className={listMode === 3 ? "listMode focused" : "listMode"} onClick={() => changeListMode(3)}>
          White List
        </Typography>
      </Box>

      {listMode === 0 &&
        <DataTable
          columns={userColumns}
          data={userFilteredList}
          defaultSortField="name"
          striped
          pagination
          subHeader
          subHeaderComponent={userSubHeaderComponent}
        />}
      {listMode === 1 && <DataTable
        columns={holderColumns}
        data={holderFilteredList}
        defaultSortField="name"
        striped
        pagination
        subHeader
        subHeaderComponent={holderSubHeaderComponent}
      />}
      {listMode === 2 && <DataTable
        columns={hackColumns}
        data={hackFilteredList}
        defaultSortField="name"
        striped
        pagination
        subHeader
        subHeaderComponent={hackSubHeaderComponent}
      />}
      {listMode === 3 && <DataTable
        columns={whiteColumns}
        data={whiteFilteredList}
        defaultSortField="name"
        striped
        pagination
        subHeader
        subHeaderComponent={whiteSubHeaderComponent}
      />}
      {listMode === 4 && <DataTable
        columns={withdrawColumns}
        data={withdrawFilteredList}
        defaultSortField="name"
        striped
        pagination
        subHeader
        subHeaderComponent={withdrawSubHeaderComponent}
      />}
    </Grid>
  );
}

export default User;