import React, {useState, useEffect} from 'react'
import ReactAudioPlayer from 'react-audio-player'

import cashoutsound from '../../../assets/audios/CashoutSound.mp3'
import coinsound from '../../../assets/audios/CoinSound.mp3'
import hitbombsound from '../../../assets/audios/HitBomb.mp3'
import playgamesound from '../../../assets/audios/PlayGame.mp3'


const  PlayMusic = () => {
    useEffect(()=>{
    }, [])
    
    return (
        <>
            {/* <ReactAudioPlayer id="cashoutsound" src={cashoutsound} controls />
            <ReactAudioPlayer id="hitbombsound" src={hitbombsound} controls />
            <ReactAudioPlayer id="coinsound" src={coinsound} controls />
            <ReactAudioPlayer id="playgamesound" src={playgamesound} controls /> */}
        </>
    )
}
export default PlayMusic