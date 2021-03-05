import { useState, useEffect } from "react";
import Head from 'next/head';
import styled, { keyframes} from 'styled-components';
import styles from '../../styles/Home.module.css';
import DefaultTheme from '../sprites/themes/squareTheme';
import { useRouter } from 'next/router';
import { withRouter } from "next/router";

import MainChar, {MainCharUp, MainCharRight, MainCharLeft} from "../sprites/characters/mainChar/mainChar";
import MainCharAnimation from "../sprites/characters/mainChar/mainCharAnimation";
import ChairRight from "../sprites/furnitures/chair";
import StorageDown from "../sprites/furnitures/storage";
import Window, {WindowNcurtainRed} from "../sprites/furnitures/window";

import firebase from "firebase/app";
import "firebase/firestore";
import initFirebase from "../api/firebase";

import { useDocumentData } from 'react-firebase-hooks/firestore';


initFirebase();

//const auth = firebase.auth();
const firestore = firebase.firestore();

const animeUp = ( positionTop, moveTop, positionLeft, moveLeft) => keyframes`
from { top: ${positionTop}%; left: ${positionLeft}%;}
to {  top: ${moveTop}%; left: ${moveLeft}%;} `


const MainStyle = styled.div`
position: absolute; 
width: 100%; 
height: 100%; 
display: flex;
animation: ${props=> animeUp( props.positionTop, props.moveTop, props.positionLeft, props.moveLeft)} 0.5s forwards linear;`;

const SquareVisit = ({router}) => {
  const history = useRouter();
  const [audio, setAudio] = useState(false);
  const [play, setPlay] = useState();  
  const maxTiles = 49;
  const [tilesArray, setTilesArray] = useState([]);
  const [userId, setUserId] = useState();
  const [squareId, setSquareId] = useState();
  const [backgroundTiles] = useState("rgba(0,0,0,0)");
  const [userStorage, setUserStorage] = useState();
  const [visitStorage, setVisitStorage] = useState();
  const [hoverTile, setHoverTile] = useState();
  const [objectPlacement, setObjectPlacement] = useState([]);
  const [squareListQuery, setSquareListQuery] = useState();
  const [userSquareData] = useDocumentData(squareListQuery, {idField: 'id'});
  const [owner, setOwner] = useState();
  const [visitor, setVisitor] = useState();
  const [initial, setInitial] = useState(46);
  const [direction, setDirection] = useState("downDirection");
  const [positionTop, setPositionTop] = useState(-0);
  const [moveTop, setMoveTop] = useState(-0);
  const [positionLeft, setPositionLeft] = useState(-0);
  const [moveLeft, setMoveLeft] = useState(-0);

  const [allowInput, setAllowInput] = useState(true);
  const [mainAnimate, setMainAnimate] = useState(false);
  const [foot, setFoot] = useState("left");

  const playAudio = (e) =>{
    
    if(e.target !== e.currentTarget){
        return;
      }else{
        if(audio === false){
          setAudio(true);
            const audio = document.getElementById('a1');
            const interval = setInterval(()=>{
              audio.play();
            }, 1000);
            setPlay(interval);
            
        }else if(audio === true){
          clearInterval(play);
          setAudio(false);
          const audio = document.getElementById('a1');
          audio.pause();
        }    
      }
    
  }

  const handleHoverTile = (tile) =>{
    if(tile){
        setHoverTile(tile);
      }
  }

  const handleTiles = (tile) =>{
      if(tile === 46){
        if(play){
          clearInterval(play);
          const audio = document.getElementById('a1');
          audio.pause();
        }
        history.push('../');
      }
  }

  useEffect(()=>{
    const userLocal = JSON.parse(localStorage.getItem("user"));
    const visitLocal = JSON.parse(localStorage.getItem("visit"));
    if(!visitLocal){
      console.log("No Access")
      history.push('../')
    }
    else
    {
      setUserStorage(userLocal);
      setVisitStorage(visitLocal);
    }
  }, []);

  useEffect(() => {
    if (userStorage && visitStorage) {
      console.log(userStorage);
      console.log(visitStorage);
      console.log(visitStorage.owner);
      const squareListRef = firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(visitStorage.squareId);
        
      setUserId(userStorage.uid);
      setSquareId(visitStorage.squareId)
      setSquareListQuery(squareListRef);
    }
  }, [userStorage, visitStorage]);

  useEffect(()=>{
      if(userId && userSquareData){
          if(userSquareData.owner === userId){
              console.log("Square owner!")
              setOwner(userId);
          }else{
              console.log("Visitor");
              setVisitor(userId);
          }
      }
  }, [userId, userSquareData])

  useEffect(() => {
    if (userSquareData) {
      if(userSquareData.data){ 
        setObjectPlacement(userSquareData.data);
      }
    }
  }, [userSquareData]);

  useEffect(()=>{
    const array = [];
    for( let i = 1; i <= maxTiles; i++){
        array.push(i)
    }
    setTilesArray(array);
  }, [maxTiles]);

  

  const keyControl = (event) =>{
    event.preventDefault();
    console.log(event);
    if(!event.repeat){
      const areaMapping = [
        16,17,18,19,20,
        23,24,25,26,27,
        30,31,32,33,34,
        37,38,39,40,41,
        46  
      ];
      const objectMapping = [];
      if(userSquareData.data){
        for(let i = 0; i < userSquareData.data.length; i++){
          objectMapping.push(userSquareData.data[i].solid);
        }
      }
      switch(event.key){
        case "ArrowUp":
            if(direction === "upDirection"){
              if(areaMapping.includes(initial - 7)){
                if(!objectMapping.includes(initial - 7)){
                  setAllowInput(false);
                  if(foot === "left"){
                    setFoot("right");
                    setInitial(initial - 7);
                    console.log(initial - 7);
                    setMainAnimate(true);
                    setPositionLeft(moveLeft);
                    setPositionTop(moveTop);
                    setMoveTop(moveTop - 100);
                    setTimeout(()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                    }, 600);
                  }else if(foot === "right"){
                    setFoot("left");
                    setInitial(initial - 7);
                    console.log(initial - 7);
                    setMainAnimate(true);
                    setPositionLeft(moveLeft);
                    setPositionTop(moveTop);
                    setMoveTop(moveTop - 100);
                    setTimeout(()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                    }, 600);
                  }
                }else{
                  setAllowInput(false);
                  if(foot === "left"){
                    setFoot("right");
                    setMainAnimate(true);
                    setTimeout(()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                    }, 600);
                  }else if(foot === "right"){
                    setFoot("left");
                    setMainAnimate(true);
                    setTimeout(()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                    }, 600);
                  }
                }
              }else{
                setAllowInput(false);
                if(foot === "left"){
                  setFoot("right");
                  setMainAnimate(true);
                  setTimeout(()=>{
                    setMainAnimate(false);
                    setAllowInput(true);
                  }, 600);
                }else if(foot === "right"){
                  setFoot("left");
                  setMainAnimate(true);
                  setTimeout(()=>{
                    setMainAnimate(false);
                    setAllowInput(true);
                  }, 600);
                }
              };
            }else{
              setDirection("upDirection");
            }
            break;
        case "ArrowDown":
            if(direction === "downDirection"){
              if(initial === 46){
                if(play){
                  clearInterval(play);
                  const audio = document.getElementById('a1');
                  audio.pause();
                }
                router.push('../');
              }
              if(initial + 7 === 46){
                setAllowInput(false);
                  if(foot==="left"){
                    setFoot("right");
                    setInitial(initial + 7);
                    console.log(initial + 7);
                    setMainAnimate(true);
                    setPositionLeft(moveLeft);
                    setPositionTop(moveTop);
                    setMoveTop(moveTop + 100);
                    setTimeout(()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                    }, 600);
                  }else if(foot==="right"){
                    setFoot("left");
                    setInitial(initial + 7);
                    console.log(initial + 7);
                    setMainAnimate(true);
                    setPositionLeft(moveLeft);
                    setPositionTop(moveTop);
                    setMoveTop(moveTop + 100);
                    setTimeout(()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                    }, 600);
                  }
              }
              if(areaMapping.includes(initial + 7)){
                if(!objectMapping.includes(initial + 7)){
                  setAllowInput(false);
                  if(foot==="left"){
                    setFoot("right");
                    setInitial(initial + 7);
                    console.log(initial + 7);
                    setMainAnimate(true);
                    setPositionLeft(moveLeft);
                    setPositionTop(moveTop);
                    setMoveTop(moveTop + 100);
                    setTimeout(()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                    }, 600);
                  }else if(foot==="right"){
                    setFoot("left");
                    setInitial(initial + 7);
                    console.log(initial + 7);
                    setMainAnimate(true);
                    setPositionLeft(moveLeft);
                    setPositionTop(moveTop);
                    setMoveTop(moveTop + 100);
                    setTimeout(()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                    }, 600);
                  }
                }else{
                  setAllowInput(false);
                  if(foot === "left"){
                    setFoot("right");
                    setMainAnimate(true);
                    setTimeout(()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                    }, 600);
                  }else if(foot === "right"){
                    setFoot("left");
                    setMainAnimate(true);
                    setTimeout(()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                    }, 600);
                  }
                }
              }else{
                setAllowInput(false);
                if(foot === "left"){
                  setFoot("right");
                  setMainAnimate(true);
                  setTimeout(()=>{
                    setMainAnimate(false);
                    setAllowInput(true);
                  }, 600);
                }else if(foot === "right"){
                  setFoot("left");
                  setMainAnimate(true);
                  setTimeout(()=>{
                    setMainAnimate(false);
                    setAllowInput(true);
                  }, 600);
                }
              };
            }else{
              setDirection("downDirection");
            }
            break;
        case "ArrowLeft":
            if(direction === "leftDirection"){
              if(areaMapping.includes(initial - 1)){
                if(!objectMapping.includes(initial - 1)){
                  setAllowInput(false);
                  if(foot === "left"){
                    setFoot("right");
                    setInitial(initial - 1);
                    console.log(initial - 1);
                    setMainAnimate(true);
                    setPositionTop(moveTop);
                    setPositionLeft(moveLeft);
                    setMoveLeft(moveLeft - 100);
                    setTimeout(()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                    }, 600);
                  }else if(foot === "right"){
                    setFoot("left");
                    setInitial(initial - 1);
                    console.log(initial - 1);
                    setMainAnimate(true);
                    setPositionTop(moveTop);
                    setPositionLeft(moveLeft);
                    setMoveLeft(moveLeft - 100);
                    setTimeout(()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                    }, 600);
                  }
                }else{
                  setAllowInput(false);
                  if(foot === "left"){
                    setFoot("right");
                    setMainAnimate(true);
                    setTimeout(()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                    }, 600);
                  }else if(foot === "right"){
                    setFoot("left");
                    setMainAnimate(true);
                    setTimeout(()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                    }, 600);
                  }
                }
              }else{
                setAllowInput(false);
                if(foot === "left"){
                  setFoot("right");
                  setMainAnimate(true);
                  setTimeout(()=>{
                    setMainAnimate(false);
                    setAllowInput(true);
                  }, 600);
                }else if(foot === "right"){
                  setFoot("left");
                  setMainAnimate(true);
                  setTimeout(()=>{
                    setMainAnimate(false);
                    setAllowInput(true);
                  }, 600);
                }
              };
            }else{
              setDirection("leftDirection");
            }
            break;
        case "ArrowRight":
            if(direction === "rightDirection"){
              if(areaMapping.includes(initial + 1)){
                if(!objectMapping.includes(initial + 1)){
                  setAllowInput(false);
                  if(foot === "left"){
                    setFoot("right");
                    setInitial(initial + 1);
                    console.log(initial + 1);
                    setMainAnimate(true);
                    setPositionTop(moveTop);
                    setPositionLeft(moveLeft);
                    setMoveLeft(moveLeft + 100);
                    setTimeout(()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                    }, 600);
                  }else if(foot === "right"){
                    setFoot("left");
                    setInitial(initial + 1);
                    console.log(initial + 1);
                    setMainAnimate(true);
                    setPositionTop(moveTop);
                    setPositionLeft(moveLeft);
                    setMoveLeft(moveLeft + 100);
                    setTimeout(()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                    }, 600);
                  }
                }else{
                  setAllowInput(false);
                  if(foot === "left"){
                    setFoot("right");
                    setMainAnimate(true);
                    setTimeout(()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                    }, 600);
                  }else if(foot === "right"){
                    setFoot("left");
                    setMainAnimate(true);
                    setTimeout(()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                    }, 600);
                  }
                }
              }else{
                setAllowInput(false);
                if(foot === "left"){
                  setFoot("right");
                  setMainAnimate(true);
                  setTimeout(()=>{
                    setMainAnimate(false);
                    setAllowInput(true);
                  }, 600);
                }else if(foot === "right"){
                  setFoot("left");
                  setMainAnimate(true);
                  setTimeout(()=>{
                    setMainAnimate(false);
                    setAllowInput(true);
                  }, 600);
                }
              };
            }else{
              setDirection("rightDirection");
            }
            break;
        default:
      }
      
  
    }
  }

  useEffect(()=>{
    if(allowInput === true){
      window.addEventListener('keydown', keyControl);
    return () => window.removeEventListener('keydown', keyControl);
    }
}, [keyControl]);
  

  return (
    <div className={styles.container}>
      <Head>
        <title>Visit Square</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
          <audio id='a1' src='/song3.mp3'></audio>
          <div className="screenWrapper" style={{position: "relative",height: "100vh",width: "100%", margin: "auto", display: "flex", backgroundColor: "black"}} onClick={(e)=>playAudio(e)}>
            <div className={styles.screen} style={{ position: "relative", display: "flex", flexDirection: "row", flexWrap: "wrap", width: "90vh", margin: "auto"}}>
              <div className="tiles" style={{position: "absolute", display: "flex",flexDirection: "row", flexWrap: "wrap", width: "100%", zIndex: "10"}}>
                {tilesArray.map((tile)=>(
                  <div className="soloTile" key={tile} style={{position: "relative" ,width: "14.28%", paddingBottom: "14.28%", 
                                                                      backgroundColor: `${tile === hoverTile && "rgba(49,48,51,0.39)"|| backgroundTiles}`,
                                                                      transition: "background-color 0.5s linear"}} 
                                                                      onMouseOver={()=>handleHoverTile(tile)} onClick={()=>handleTiles(tile)}>
                    {objectPlacement && (objectPlacement.map((object, index)=> 
                     <div key={index} style={{position: "absolute", width: "100%", height: "100%",margin: "auto", zIndex: `${tile > 15 && tile < 21 && "15" || tile > 22 && tile < 28 && "25" || tile > 29 && tile < 35 && "35" || tile > 36 && tile < 42 && "46"}` }}>
                      {tile === object.position && 
                         (  
                            (object.type === "empty" && 
                            <div style={{position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center"}}>
                            </div>
                            )
                            ||
                            (object.type === "chair" &&
                            <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                              <div style={{position: "absolute", width: "100%", height: "100%", top: "-60%", margin: "auto"}}>
                                <ChairRight/>
                              </div>
                            </div> 
                            )
                            ||
                            (object.type === "storage" &&
                            <div style={{position: "relative", width: "100%", height: "100%", top: "-75%", display: "flex", justifyContent: "center"}}>
                              <div style={{position: "absolute", width: "100%", height: "100%", margin: "auto"}}>
                                <StorageDown/>
                              </div>
                            </div> 
                            )
                            ||
                            (object.type === "window" &&
                            <div style={{position: "relative", width: "100%", height: "100%", top: "-50%", display: "flex", justifyContent: "center"}}>
                              <div style={{position: "absolute", width: "100%", height: "100%", margin: "auto"}}>
                                <Window/>
                              </div>
                            </div> 
                            )
                            ||
                            (object.type === "windowNcurtainRed" &&
                            <div style={{position: "relative", width: "100%", height: "100%", top: "-40%", left: "-12%",display: "flex", justifyContent: "center"}}>
                              <div style={{position: "absolute", width: "100%", height: "100%", margin: "auto"}}>
                                <WindowNcurtainRed/>
                              </div>
                            </div> 
                            )
                          ) 
                       }
                     </div>
                    ))}
                    {tile === 46 && 
                      (<MainStyle  positionTop={positionTop} moveTop={moveTop} positionLeft={positionLeft} moveLeft={moveLeft} style={{zIndex: `${initial > 15 && initial < 21 && "16" || initial > 22 && initial < 28 && "26" || initial > 29 && initial < 35 && "36" || initial > 36 && initial < 42 && "46"}`}}>
                      {direction === "upDirection" && 
                        (
                          <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                              {mainAnimate === true && <MainCharAnimation foot={foot} direction={direction}/> || <MainCharUp/>}
                            </div>
                          </div>
                        ) 
                        || 
                      direction === "downDirection" && 
                        (
                          <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                            {mainAnimate === true && <MainCharAnimation foot={foot} direction={direction}/> || <MainChar/>}
                            </div>
                          </div>
                        )
                        || 
                      direction === "leftDirection" && 
                      (
                        <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                          <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%" ,margin: "auto"}}>
                          {mainAnimate === true && <MainCharAnimation foot={foot} direction={direction}/> || <MainCharLeft/>}
                          </div>
                        </div>
                      ) 
                      || 
                      direction === "rightDirection" && 
                      (
                        <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                            {mainAnimate === true && <MainCharAnimation foot={foot} direction={direction}/> || <MainCharRight/>}
                            </div>
                          </div>
                      ) 
                      || 
                      (
                        <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                              <MainChar/>
                            </div>
                          </div>
                      )}
                      </MainStyle>)
                      }
                  </div>
                ))}
              </div>
              {/*<div className="CharacterScreen" style={{position: "absolute", display: "flex",flexDirection: "row", flexWrap: "wrap", width: "100%", zIndex: "9"}}>
                {tilesArray.map((tile)=>(
                  <div className="soloTile" key={tile} style={{position: "relative" ,width: "14.28%", paddingBottom: "14.28%", 
                                                                      backgroundColor: `${tile === hoverTile && "rgba(49,48,51,0.39)"|| backgroundTiles}`, 
                                                                      transition: "background-color 0.5s linear"}} 
                                                                      onMouseOver={()=>handleHoverTile(tile)} onClick={()=>handleTiles(tile)}>
                    
                  </div>
                ))}
              </div>*/}
              <div className="themeSquare" style={{ position: "relative", width: "100%",display: "flex"}}>
                <DefaultTheme/>
              </div>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
        <a
          href="https://doanstack.herokuapp.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          Doan Nguyen
        </a>
      </footer>
  </div>
  )
}


export default withRouter(SquareVisit);

