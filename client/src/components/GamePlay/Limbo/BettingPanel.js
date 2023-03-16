import React, { useState, useEffect, useContext} from "react";
import { StoreContext } from "../../../store";
import useGameStore from "../../../GameStore";
import { Box, FormControl } from '@mui/material';
import {  Button } from "@mui/material";
import axios from "axios";

import './limbo.css'
import eth from '../../../assets/images/eth.png'
import gem from '../../../assets/images/gem.png'
import nugget from '../../../assets/images/nugget.png'



const LimboPanel = (props) => {
    const { launch, setLaunch, success ,setSuccess } = props;
    const global = useContext(StoreContext)
    const { nugAmount, bonusNugAmount, gemAmount, limboWord } = useGameStore();
    const { setNugAmount, setBonusNugAmount, setGemAmount, setLimboWord } = useGameStore();
    const { currencyMode, setAlerts } = useGameStore();
    const [ coinImage, setCoinImage ] = useState('');
    const [percent, setPercent] = useState('0.00');

    useEffect(() => {
        if ( currencyMode === 'mainNug') {
            setCoinImage(eth)
        } else if ( currencyMode === 'bonusNug') {
            setCoinImage(nugget)
        } else {
            setCoinImage(gem)
        }
    },[currencyMode])
    
    const inputAmount = (e) => {
        global.setDepositAmount(parseFloat(parseFloat(e.target.value).toFixed(4)));

      }
    
    const inputValue = (e) => {
        global.setPayout(parseFloat(parseFloat(e.target.value).toFixed(4)));
        let tempPercent = 99/(parseFloat(e.target.value));
        if (e.target.value === '' ) {
            setPercent(0);
        } else 
            setPercent(tempPercent.toFixed(2));
    }

    const clickBet = async () => {
        global.setStart(true);
        if (!global.walletAddress) {
            setAlerts({
                type: "error",
                content: 'Please connect your wallet!'
              })
            return
        }

        if (!global.depositAmount || !global.payout) {
            setAlerts({
                type: "error",
                content: 'Please fill input field!'
              })
            return
        }


        if (parseFloat(global.depositAmount) > nugAmount || parseFloat(global.depositAmount) > bonusNugAmount  || parseFloat(global.depositAmount) > gemAmount) {
            return
        }
        setLaunch(true);
        const object = {
            amount: parseFloat(global.depositAmount),
            currencyMode: parseFloat(global.depositAmount),
            payout: global.payout,
            walletAddress: global.walletAddress,
        }

       try {
        await axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/api/play/limboDeposit`, object)
          .then((res) => {
           if(res.data.status) {
                console.log("limbo", res.data.content.limboWord)
                setLimboWord(res.data.content.limboWord)
                if(currencyMode === "mainNug") {
                    setNugAmount(res.data.content.playAmount)
                } else if (currencyMode === "bonusNug") {
                    setBonusNugAmount(res.data.content.playAmount)
                } else {
                    setGemAmount(res.data.content.playAmount)
                }

                

                let history = [...global.limboHistory];
                history.unshift(
                    <Box className = {parseFloat(global.payout) > parseFloat(res.data.content.limboWord) ? "fail card" : "doubled card"}>
                        x{res.data.content.limboWord}
                    </Box>
                )

                if (parseFloat(global.payout) > parseFloat(res.data.content.limboWord)) {
                    setSuccess(true)
                } else {
                    setSuccess(false)

                }

                global.setLimboHistory(history);

                setTimeout(() => {
                    setLaunch(false);
                }, 800)

           } else {
                setTimeout(() => {
                    setLaunch(false);
                }, 800)
                console.log("Error in play limbo", res.data.content)
           }
          });
      } catch (err) {
        setTimeout(() => {
            setLaunch(false);
        }, 800)
        console.log("Error while getting hackerList: ", err);
        setAlerts({
          type: "error",
          content: err.message
        })
      }
    }

    return (
        <>
        <FormControl>
            <img src={coinImage} alt='coin' id="coin"/>
            <label htmlFor='inputAmount' className="text-label" style={{ textAlign: 'left', color: 'grey'}}>Amount</label>
            <input type="number" value={global.depositAmount} onChange={inputAmount} id = 'inputAmount'/>
            <label htmlFor='inputValue' className="text-label">
                <span style={{ textAlign: 'left', color: 'grey'}}>Payout</span>
                <span style={{ textAlign: 'right', color: 'grey'}}>Chance &nbsp;  { percent }%</span>
            </label>
            <input type="number" value={global.payout} onChange={inputValue} id = 'inputValue'/>
            <Button className="betButton" onClick={clickBet}>
                BET NOW
            </Button>
        </FormControl>
        </>
    )
}

export default LimboPanel;