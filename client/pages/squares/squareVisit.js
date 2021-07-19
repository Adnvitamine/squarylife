import { useState, useEffect } from "react";
import Head from 'next/head';
import styled, { keyframes} from 'styled-components';
import styles from '../../styles/Home.module.css';
import DefaultTheme from '../sprites/themes/squareTheme';
import { useRouter } from 'next/router';
import { withRouter } from "next/router";

import MainChar, {MainCharUp, MainCharRight, MainCharLeft} from "../sprites/characters/mainChar/mainChar";
import GirlChar, {GirlCharUp, GirlCharRight, GirlCharLeft} from "../sprites/characters/girlChar/girlChar";
import MainCharAnimation from "../sprites/characters/mainChar/mainCharAnimation";
import GirlCharAnimation from "../sprites/characters/girlChar/girCharAnimation";
import ChairRight from "../sprites/furnitures/chair";
import StorageDown from "../sprites/furnitures/storage";
import Window, {WindowNcurtainRed} from "../sprites/furnitures/window";

import firebase from "firebase/app";
import "firebase/firestore";
import initFirebase from "../api/firebase";

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';


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
  const [character, setCharacter] = useState("default");
  const [tilesArray, setTilesArray] = useState([]);
  const [userId, setUserId] = useState();
  const [squareId, setSquareId] = useState();
  const [backgroundTiles] = useState("rgba(0,0,0,0)");
  const [userStorage, setUserStorage] = useState();
  const [username, setUsername] = useState("unknown");
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
  const [positionLeft, setPositionLeft] = useState(-0);
  const [mainAnimate, setMainAnimate] = useState(false);
  const [moveTop, setMoveTop] = useState(-0);
  const [moveLeft, setMoveLeft] = useState(-0);
  const [foot, setFoot] = useState("left");

  const [allowInput, setAllowInput] = useState(true);

  const [chatBox, setChatBox] = useState(false);
  const [message, setMessage] = useState("");

  //hooks for all visitors in owner's SQUARE COLLECTION in firestore
  const [visitorListQuery, setVisitorListQuery] = useState();
  const [visitorListCollection] = useCollectionData(visitorListQuery, {idField: 'id'});

  //hooks for owner in owner's SQUARE COLLECTION in firestore
  const [ownerListQuery, setOwnerListQuery] = useState();
  const [ownerListCollection] = useCollectionData(ownerListQuery, {idField: 'id'});

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

  /*
  const handleTiles = async (e, tile) =>{
    console.log(tile);
      if(tile === 46){
        if(play){
          clearInterval(play);
          const audio = document.getElementById('a1');
          audio.pause();
        }
        if(owner){
          await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(userStorage.uid).delete();
        }
        if(visitor){
          await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(userStorage.uid).delete();
        }
        history.push('../');
      }
  }
  */

  useEffect(()=>{
    const userLocal = JSON.parse(localStorage.getItem("user"));
    const visitLocal = JSON.parse(localStorage.getItem("visit"));
    const characterLocal = JSON.parse(localStorage.getItem("character"));
    if(!visitLocal){
      console.log("No Access");
      history.push('../');
    }
    else
    {
      setUserStorage(userLocal);
      const fullName = userLocal.username;
      const split = fullName.split(' ');
      const username = split[0];
      setUsername(username);
      setVisitStorage(visitLocal);
      if(!characterLocal){
        setCharacter("default")
      }else{
        setCharacter(characterLocal.character);
      }
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
            console.log("You are the owner of this square!");
            setOwner(userId);
              const fullName = userStorage.username;
              const split = fullName.split(' ');
              const firstName = split[0];
              firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(userStorage.uid).set({
                initial: 46,
                direction: "downDirection",
                positionTop: 0,
                positionLeft: 0,
                moveTop: 0,
                moveLeft: 0,
                foot: "left",
                mainAnimate: false,
                message: "",
                character: character,
                username: firstName,
                uid: userStorage.uid
                });
                const visitorListRef = firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('visitor');
                setVisitorListQuery(visitorListRef);
          }else{
            console.log("Welcome dear visitor!");
            setVisitor(userId);
            const fullName = userStorage.username;
            const split = fullName.split(' ');
            const firstName = split[0];
            firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(userStorage.uid).set({
              initial: 46,
              direction: "downDirection",
              positionTop: 0,
              positionLeft: 0,
              moveTop: 0,
              moveLeft: 0,
              foot: "left",
              mainAnimate: false,
              message: "",
              character: character,
              username: firstName,
              uid: userStorage.uid
              });
                const visitorListRef = firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor');
                setVisitorListQuery(visitorListRef);
                const ownerListRef = firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('owner');
                setOwnerListQuery(ownerListRef);
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

  useEffect(()=>{
    if(visitor){
      if(visitorListCollection){
        if(visitorListCollection.length > 1){
          firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(userStorage.uid).update({
            initial: initial,
            direction: direction,
            positionTop: positionTop,
            positionLeft: positionLeft,
            moveTop: moveTop,
            moveLeft: moveLeft,
            foot: foot,
            mainAnimate: mainAnimate,
            message: message
            });
        }
      }
    }
    if(owner){
      if(visitorListCollection){
        if(visitorListCollection.length > 0){
          firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(userStorage.uid).update({
            initial: initial,
            direction: direction,
            positionTop: positionTop,
            positionLeft: positionLeft,
            moveTop: moveTop,
            moveLeft: moveLeft,
            foot: foot,
            mainAnimate: mainAnimate,
            message: message
            });
        }
      }
    }
  }, [visitorListCollection]);

  useEffect(()=>{
    if(visitor){
      if(ownerListCollection){
        if(ownerListCollection.length > 0){
          firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(userStorage.uid).update({
            initial: initial,
            direction: direction,
            positionTop: positionTop,
            positionLeft: positionLeft,
            moveTop: moveTop,
            moveLeft: moveLeft,
            foot: foot,
            mainAnimate: mainAnimate,
            message: message
            });
        }
      }
    }
  }, [ownerListCollection]);

  const keyControl = async (event) =>{
    //event.preventDefault();
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
      const objectVerticalMapping = [];
      if(userSquareData.data){
        for(let i = 0; i < userSquareData.data.length; i++){
          objectVerticalMapping.push(userSquareData.data[i].solidVertical);
        }
      }
      /*
      if(visitorListCollection){
        console.log(visitorListCollection.length);
        if(visitorListCollection.length > 0){
          console.log("There's a visitor, ready to store owner information in firestore")
        }else{
          console.log("No one in the room, no need to store data!");
        }
      }
      */
      switch(event.key){
        case "Enter":
            if(chatBox){
              if(owner){
                if(visitorListCollection){
                  console.log(visitorListCollection.length);
                  if(visitorListCollection.length > 0){
                    console.log("There's a new visitor, ready to share owner message in firestore");
                    await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                      message: message
                      });
                  }else{
                    console.log("No one in the room, you are talking alone...");
                  }
                }
              }else if(visitor){
                if(visitorListCollection && ownerListCollection){
                  //console.log(visitorListCollection.length);
                  if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                    console.log("There's someone in the romm, ready to share visitor message in firestore");
                    await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                      message: message
                      });
                  }else{
                    console.log("No one in the room, no need to store data!");
                  }
                }
              }
              setChatBox(false);
            }else{
              setChatBox(true);
              document.getElementById("Message").focus();
            }
            break;
        case "ArrowUp":
          setMessage("");
          if(owner){
            if(visitorListCollection.length > 0){
              await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                message: ""
                });
            }
          }else if(visitor){
            if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
              await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                message: ""
                });
            }
            
          }
            if(direction === "upDirection"){
              if(areaMapping.includes(initial - 7)){
                if(!objectMapping.includes(initial - 7) && !objectVerticalMapping.includes(initial) ){
                  setAllowInput(false);
                  if(foot === "left"){
                    setFoot("right");
                    setInitial(initial - 7);
                    console.log(initial - 7);
                    setMainAnimate(true);
                    setPositionLeft(moveLeft);
                    setPositionTop(moveTop);
                    setMoveTop(moveTop - 100);
                    if(owner){
                      if(visitorListCollection.length > 0){
                        await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                        foot: "right",
                        initial: initial - 7,
                        mainAnimate: true,
                        positionLeft: moveLeft,
                        positionTop: moveTop,
                        moveTop: moveTop - 100,
                        direction: direction
                        });
                      }
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                          foot: "right",
                          initial: initial - 7,
                          mainAnimate: true,
                          positionLeft: moveLeft,
                          positionTop: moveTop,
                          moveTop: moveTop - 100,
                          direction: direction
                          });
                      }
                      
                    }
                    setTimeout(async()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                      if(owner){
                        if(visitorListCollection.length > 0){
                          await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                           mainAnimate: false,
                          });
                        }
                      }else if(visitor){
                        if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                          await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                            mainAnimate: false,
                            });
                        }
                        
                      }
                    }, 600);
                  }else if(foot === "right"){
                    setFoot("left");
                    setInitial(initial - 7);
                    console.log(initial - 7);
                    setMainAnimate(true);
                    setPositionLeft(moveLeft);
                    setPositionTop(moveTop);
                    setMoveTop(moveTop - 100);
                    if(owner){
                      if(visitorListCollection.length > 0){
                        await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                        foot: "left",
                        initial: initial - 7,
                        mainAnimate: true,
                        positionLeft: moveLeft,
                        positionTop: moveTop,
                        moveTop: moveTop - 100,
                        direction: direction
                        });
                      }
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                          foot: "left",
                          initial: initial - 7,
                          mainAnimate: true,
                          positionLeft: moveLeft,
                          positionTop: moveTop,
                          moveTop: moveTop - 100,
                          direction: direction
                          });
                      }
                      
                    }
                    setTimeout(async()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                      if(owner){
                        await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                           mainAnimate: false,
                          });
                      }else if(visitor){
                        if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                          await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                            mainAnimate: false,
                            });
                        }
                        
                      }
                    }, 600);
                  }
                }else{
                  setAllowInput(false);
                  if(foot === "left"){
                    setFoot("right");
                    setMainAnimate(true);
                    if(owner){
                      if(visitorListCollection.length > 0){
                        await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                        foot: "right",
                        mainAnimate: true,
                        direction: direction
                        });
                      }
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                          foot: "right",
                          mainAnimate: true,
                          direction: direction
                          });
                      }
                      
                    }
                    setTimeout(async()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                      if(owner){
                        if(visitorListCollection.length > 0){
                          await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                            mainAnimate: false,
                            });
                        }
                      }else if(visitor){
                        if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                          await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                            mainAnimate: false,
                            });
                        }
                        
                      }
                    }, 600);
                  }else if(foot === "right"){
                    setFoot("left");
                    setMainAnimate(true);
                    if(owner){
                      if(visitorListCollection.length > 0){
                        await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                        foot: "left",
                        mainAnimate: true,
                        direction: direction
                        });
                      }
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                          foot: "left",
                          mainAnimate: true,
                          direction: direction
                          });
                      }
                      
                    }
                    setTimeout(async()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                      if(owner){
                        if(visitorListCollection.length > 0){
                          await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                            mainAnimate: false,
                            });
                        }
                      }else if(visitor){
                        if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                          await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                            mainAnimate: false,
                            });
                        }
                        
                      }
                    }, 600);
                  }
                }
              }else{
                setAllowInput(false);
                if(foot === "left"){
                  setFoot("right");
                  setMainAnimate(true);
                  if(owner){
                    if(visitorListCollection.length > 0){
                       await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                      foot: "right",
                      mainAnimate: true,
                      direction: direction
                      }); 
                    }
                  }else if(visitor){
                    if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                      await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                        foot: "right",
                        mainAnimate: true,
                        direction: direction
                        });
                    }
                    
                  }
                  setTimeout(async()=>{
                    setMainAnimate(false);
                    setAllowInput(true);
                    if(owner){
                      if(visitorListCollection.length > 0){
                        await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                         mainAnimate: false,
                        });
                      }
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                          mainAnimate: false,
                          });
                      }
                      
                    }
                  }, 600);
                }else if(foot === "right"){
                  setFoot("left");
                  setMainAnimate(true);
                  if(owner){
                    if(visitorListCollection.length > 0){
                      await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                      foot: "left",
                      mainAnimate: true,
                      direction: direction
                      });
                    }
                  }else if(visitor){
                    if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                      await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                        foot: "left",
                        mainAnimate: true,
                        direction: direction
                        });
                    }
                    
                  }
                  setTimeout(async()=>{
                    setMainAnimate(false);
                    setAllowInput(true);
                    if(owner){
                      if(visitorListCollection.length > 0){
                        await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                         mainAnimate: false,
                        });
                      }
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                          mainAnimate: false,
                          });
                      }
                      
                    }
                  }, 600);
                }
              };
            }else{
              setDirection("upDirection");
            }
            break;
        case "ArrowDown":
          setMessage("");
          if(allowInput === true){
            if(owner){
              if(visitorListCollection.length > 0){
                  await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                message: ""
                });        
              }
            }else if(visitor){
              if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                  message: ""
                  });  
              }
              
            }
          }
            if(direction === "downDirection"){
              if(areaMapping.includes(initial + 7)){
                if(!objectMapping.includes(initial + 7) && !objectVerticalMapping.includes(initial + 7)){
                  setAllowInput(false);
                  if(foot==="left"){
                    setFoot("right");
                    setInitial(initial + 7);
                    console.log(initial + 7);
                    setMainAnimate(true);
                    setPositionLeft(moveLeft);
                    setPositionTop(moveTop);
                    setMoveTop(moveTop + 100);
                    if(owner){
                      if(visitorListCollection.length > 0){
                        await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                        foot: "right",
                        initial: initial + 7,
                        mainAnimate: true,
                        positionLeft: moveLeft,
                        positionTop: moveTop,
                        moveTop: moveTop + 100,
                        direction: direction
                        });
                      }
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                          foot: "right",
                          initial: initial + 7,
                          mainAnimate: true,
                          positionLeft: moveLeft,
                          positionTop: moveTop,
                          moveTop: moveTop + 100,
                          direction: direction
                          });
                      }
                      
                    }
                    setTimeout(async()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                      if(owner){
                        if(visitorListCollection.length > 0){
                          await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                            mainAnimate: false,
                            });
                        }
                      }else if(visitor){
                        if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                          await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                            mainAnimate: false,
                            });
                        }
                        
                      }
                    }, 600);
                  }else if(foot==="right"){
                    setFoot("left");
                    setInitial(initial + 7);
                    console.log(initial + 7);
                    setMainAnimate(true);
                    setPositionLeft(moveLeft);
                    setPositionTop(moveTop);
                    setMoveTop(moveTop + 100);
                    if(owner){
                      if(visitorListCollection.length > 0){
                        await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                        foot: "left",
                        initial: initial + 7,
                        mainAnimate: true,
                        positionLeft: moveLeft,
                        positionTop: moveTop,
                        moveTop: moveTop + 100,
                        direction: direction
                        });
                      }
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                          foot: "left",
                          initial: initial + 7,
                          mainAnimate: true,
                          positionLeft: moveLeft,
                          positionTop: moveTop,
                          moveTop: moveTop + 100,
                          direction: direction
                          });
                      }
                      
                    }
                    setTimeout(async()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                      if(owner){
                        if(visitorListCollection.length > 0){
                          await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                            mainAnimate: false,
                            });
                        }
                      }else if(visitor){
                        if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                          await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                            mainAnimate: false,
                            });
                        }
                        
                      }
                    }, 600);
                  }
                }else{
                  setAllowInput(false);
                  if(foot === "left"){
                    setFoot("right");
                    setMainAnimate(true);
                    if(owner){
                      if(visitorListCollection.length > 0){
                        await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                        foot: "right",
                        mainAnimate: true,
                        direction: direction
                        });
                      }
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                          foot: "right",
                          mainAnimate: true,
                          direction: direction
                          });
                      }
                      
                    }
                    setTimeout(async()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                      if(owner){
                        if(visitorListCollection.length > 0){
                          await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                            mainAnimate: false,
                            });
                        }
                      }else if(visitor){
                        if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                          await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                            mainAnimate: false,
                            });
                        }
                        
                      }
                    }, 600);
                  }else if(foot === "right"){
                    setFoot("left");
                    setMainAnimate(true);
                    if(owner){
                      if(visitorListCollection.length > 0){
                        await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                        foot: "left",
                        mainAnimate: true,
                        direction: direction
                        });
                      }
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                          foot: "left",
                          mainAnimate: true,
                          direction: direction
                          });
                      }
                      
                    }
                    setTimeout(async()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                      if(owner){
                        if(visitorListCollection.length > 0){
                          await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                            mainAnimate: false,
                            });
                        }
                      }else if(visitor){
                        if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                          await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                            mainAnimate: false,
                            });
                        }
                        
                      }
                    }, 600);
                  }
                }
              }else{
                if(initial === 46){
                  setAllowInput(false);
                  if(play){
                    clearInterval(play);
                    const audio = document.getElementById('a1');
                    audio.pause();
                  }
                  if(owner){
                    await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(userStorage.uid).delete();
                  }
                  if(visitor){
                    await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(userStorage.uid).delete();
                  }
                  router.push('../');
                }else{
                  setAllowInput(false);
                if(foot === "left"){
                  setFoot("right");
                  setMainAnimate(true);
                  if(owner){
                    if(visitorListCollection.length > 0){
                        await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                      foot: "right",
                      mainAnimate: true,
                      direction: direction
                      });
                    }
                  }else if(visitor){
                    if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                      await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                        foot: "right",
                        mainAnimate: true,
                        direction: direction
                        });
                    }
                    
                  }
                  setTimeout(async()=>{
                    setMainAnimate(false);
                    setAllowInput(true);
                    if(owner){
                      if(visitorListCollection.length > 0){
                        await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                         mainAnimate: false,
                        });
                      }
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                          mainAnimate: false,
                          });
                      }
                      
                    }
                  }, 600);
                }else if(foot === "right"){
                  setFoot("left");
                  setMainAnimate(true);
                  if(owner){
                    if(visitorListCollection.length > 0){
                       await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                      foot: "left",
                      mainAnimate: true,
                      direction: direction
                      }); 
                    }
                  }else if(visitor){
                    if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                      await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                        foot: "left",
                        mainAnimate: true,
                        direction: direction
                        });
                    }
                    
                  }
                  setTimeout(async()=>{
                    setMainAnimate(false);
                    setAllowInput(true);
                    if(owner){
                      if(visitorListCollection.length > 0){
                        await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                         mainAnimate: false,
                        });
                      }
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                          mainAnimate: false,
                          });
                      }
                      
                    }
                  }, 600);
                }
                }
                
              };
            }else{
              setDirection("downDirection");
            }
            break;
        case "ArrowLeft":
          setMessage("");
          if(owner){
            if(visitorListCollection.length > 0){
              await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
              message: ""
              });          
            }
          }else if(visitor){
            if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
              await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                message: ""
                });  
            }
            
          }
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
                    if(owner){
                      if(visitorListCollection.length > 0){
                         await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                        foot: "right",
                        initial: initial - 1,
                        mainAnimate: true,
                        positionLeft: moveLeft,
                        positionTop: moveTop,
                        moveLeft: moveLeft - 100,
                        direction: direction
                        });
                      }
                      
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                          foot: "right",
                          initial: initial - 1,
                          mainAnimate: true,
                          positionLeft: moveLeft,
                          positionTop: moveTop,
                          moveLeft: moveLeft - 100,
                          direction: direction
                          });
                      }
                      
                    }
                    setTimeout(async()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                      if(owner){
                        if(visitorListCollection.length > 0){
                         await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                           mainAnimate: false,
                          });
                        }
                        
                      }else if(visitor){
                        if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                          await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                            mainAnimate: false,
                            });
                        }
                        
                      }
                    }, 600);
                  }else if(foot === "right"){
                    setFoot("left");
                    setInitial(initial - 1);
                    console.log(initial - 1);
                    setMainAnimate(true);
                    setPositionTop(moveTop);
                    setPositionLeft(moveLeft);
                    setMoveLeft(moveLeft - 100);
                    if(owner){
                      if(visitorListCollection.length > 0){
                         await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                        foot: "left",
                        initial: initial - 1,
                        mainAnimate: true,
                        positionLeft: moveLeft,
                        positionTop: moveTop,
                        moveLeft: moveLeft - 100,
                        direction: direction
                        });
                      }
                      
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                          foot: "left",
                          initial: initial - 1,
                          mainAnimate: true,
                          positionLeft: moveLeft,
                          positionTop: moveTop,
                          moveLeft: moveLeft - 100,
                          direction: direction
                          });
                      }
                      
                    }
                    setTimeout(async()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                      if(owner){
                        if(visitorListCollection.length > 0){
                         await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                           mainAnimate: false,
                          });
                        }
                        
                      }else if(visitor){
                        if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                          await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                            mainAnimate: false,
                            });
                        }
                        
                      }
                    }, 600);
                  }
                }else{
                  setAllowInput(false);
                  if(foot === "left"){
                    setFoot("right");
                    setMainAnimate(true);
                    if(owner){
                      if(visitorListCollection.length > 0){
                          await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                        foot: "right",
                        mainAnimate: true,
                        direction: direction
                        });
                      }
                     
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                          foot: "right",
                          mainAnimate: true,
                          direction: direction
                          });
                      }
                      
                    }
                    setTimeout(async()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                      if(owner){
                        if(visitorListCollection.length > 0){
                         await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                           mainAnimate: false,
                          });
                        }
                        
                      }else if(visitor){
                        if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                          await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                            mainAnimate: false,
                            });
                        }
                        
                      }
                    }, 600);
                  }else if(foot === "right"){
                    setFoot("left");
                    setMainAnimate(true);
                    if(owner){
                      if(visitorListCollection.length > 0){
                         await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                        foot: "left",
                        mainAnimate: true,
                        direction: direction
                        });
                      }
                      
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
              
                      }
                      await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                        foot: "left",
                        mainAnimate: true,
                        direction: direction
                        });
                    }
                    setTimeout(async()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                      if(owner){
                        if(visitorListCollection.length > 0){
                         await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                           mainAnimate: false,
                          });
                        }
                        
                      }else if(visitor){
                        if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                          await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                            mainAnimate: false,
                            });
                        }
                        
                      }
                    }, 600);
                  }
                }
              }else{
                setAllowInput(false);
                if(foot === "left"){
                  setFoot("right");
                  setMainAnimate(true);
                  if(owner){
                    if(visitorListCollection.length > 0){
                         await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                      foot: "right",
                      mainAnimate: true,
                      direction: direction
                      });
                    }
                    
                  }else if(visitor){
                    if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                      await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                        foot: "right",
                        mainAnimate: true,
                        direction: direction
                        });
                    }
                    
                  }
                  setTimeout(async()=>{
                    setMainAnimate(false);
                    setAllowInput(true);
                    if(owner){
                      if(visitorListCollection.length > 0){
                        await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                         mainAnimate: false,
                        }); 
                      }
                      
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                          mainAnimate: false,
                          });
                      }
                      
                    }
                  }, 600);
                }else if(foot === "right"){
                  setFoot("left");
                  setMainAnimate(true);
                  if(owner){
                    if(visitorListCollection.length > 0){
                      await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                      foot: "left",
                      mainAnimate: true,
                      direction: direction
                      });  
                    }
                    
                  }else if(visitor){
                    if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                      await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                        foot: "left",
                        mainAnimate: true,
                        direction: direction
                        });
                    }
                    
                  }
                  setTimeout(async()=>{
                    setMainAnimate(false);
                    setAllowInput(true);
                    if(owner){
                      if(visitorListCollection.length > 0){
                        await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                         mainAnimate: false,
                        }); 
                      }
                      
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                                  mainAnimate: false,
                                  });
                      }
                      
                    }
                  }, 600);
                }
              };
            }else{
              setDirection("leftDirection");
            }
            break;
        case "ArrowRight":
          setMessage("");
          if(owner){
            if(visitorListCollection.length > 0){
              await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
              message: ""
              });         
            }
            
          }else if(visitor){
            if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
              await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                message: ""
                });
            }
            
          }
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
                    if(owner){
                      if(visitorListCollection.length > 0){
                         await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                        foot: "right",
                        initial: initial + 1,
                        mainAnimate: true,
                        positionLeft: moveLeft,
                        positionTop: moveTop,
                        moveLeft: moveLeft + 100,
                        direction: direction
                        });
                      }
                      
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                          foot: "right",
                          initial: initial + 1,
                          mainAnimate: true,
                          positionLeft: moveLeft,
                          positionTop: moveTop,
                          moveLeft: moveLeft + 100,
                          direction: direction
                          });
                      }
                      
                    }
                    setTimeout(async()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                      if(owner){
                        if(visitorListCollection.length > 0){
                         await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                           mainAnimate: false,
                          });
                        }
                        
                      }else if(visitor){
                        if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                          await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                            mainAnimate: false,
                            });
                        }
                        
                      }
                    }, 600);
                  }else if(foot === "right"){
                    setFoot("left");
                    setInitial(initial + 1);
                    console.log(initial + 1);
                    setMainAnimate(true);
                    setPositionTop(moveTop);
                    setPositionLeft(moveLeft);
                    setMoveLeft(moveLeft + 100);
                    if(owner){
                      if(visitorListCollection.length > 0){
                        await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                        foot: "left",
                        initial: initial + 1,
                        mainAnimate: true,
                        positionLeft: moveLeft,
                        positionTop: moveTop,
                        moveLeft: moveLeft + 100,
                        direction: direction
                        }); 
                      }
                      
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                                  foot: "left",
                                  initial: initial + 1,
                                  mainAnimate: true,
                                  positionLeft: moveLeft,
                                  positionTop: moveTop,
                                  moveLeft: moveLeft + 100,
                                  direction: direction
                                  });
                      }
                      
                    }
                    setTimeout(async()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                      if(owner){
                        if(visitorListCollection.length > 0){
                         await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                           mainAnimate: false,
                          });
                        }
                        
                      }else if(visitor){
                        if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                          await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                                      mainAnimate: false,
                                      });
                        }
                        
                      }
                    }, 600);
                  }
                }else{
                  setAllowInput(false);
                  if(foot === "left"){
                    setFoot("right");
                    setMainAnimate(true);
                    if(owner){
                      if(visitorListCollection.length > 0){
                         await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                        foot: "right",
                        mainAnimate: true,
                        direction: direction
                        });
                      }
                      
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                                  foot: "right",
                                  mainAnimate: true,
                                  direction: direction
                                  });
                      }
                      
                    }
                    setTimeout(async()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                      if(owner){
                        if(visitorListCollection.length > 0){
                         await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                           mainAnimate: false,
                          });
                        }
                        
                      }else if(visitor){
                        if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                          await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                                      mainAnimate: false,
                                      });
                        }
                        
                      }
                    }, 600);
                  }else if(foot === "right"){
                    setFoot("left");
                    setMainAnimate(true);
                    if(owner){
                      if(visitorListCollection.length > 0){
                         await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                        foot: "left",
                        mainAnimate: true,
                        direction: direction
                        });
                      }
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                                  foot: "left",
                                  mainAnimate: true,
                                  direction: direction
                                  });
                      }
                      
                    }
                    setTimeout(async()=>{
                      setMainAnimate(false);
                      setAllowInput(true);
                      if(owner){
                        if(visitorListCollection.length > 0){
                         await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                           mainAnimate: false,
                          });
                        }
                      }else if(visitor){
                        if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                          await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                                      mainAnimate: false,
                                      });
                        }
                        
                      }
                    }, 600);
                  }
                }
              }else{
                setAllowInput(false);
                if(foot === "left"){
                  setFoot("right");
                  setMainAnimate(true);
                  if(owner){
                    if(visitorListCollection.length > 0){
                        await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                      foot: "right",
                      mainAnimate: true,
                      direction: direction
                      }); 
                    }
                  }else if(visitor){
                    if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                      await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                              foot: "right",
                              mainAnimate: true,
                              direction: direction
                              });
                    }
                    
                  }
                  setTimeout(async()=>{
                    setMainAnimate(false);
                    setAllowInput(true);
                    if(owner){
                      if(visitorListCollection.length > 0){
                         await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                         mainAnimate: false,
                        });
                      }
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                                  mainAnimate: false,
                                  });
                      }
                      
                    }
                  }, 600);
                }else if(foot === "right"){
                  setFoot("left");
                  setMainAnimate(true);
                  if(owner){
                    if(visitorListCollection.length > 0){
                       await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                      foot: "left",
                      mainAnimate: true,
                      direction: direction
                      });  
                    }
                  }else if(visitor){
                    if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                      await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                              foot: "left",
                              mainAnimate: true,
                              direction: direction
                              });
                    }
                    
                  }
                  setTimeout(async()=>{
                    setMainAnimate(false);
                    setAllowInput(true);
                    if(owner){
                      if(visitorListCollection.length > 0){
                         await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${visitStorage.squareId}`).collection('owner').doc(owner).update({
                         mainAnimate: false,
                        });
                      }
                    }else if(visitor){
                      if(visitorListCollection.length > 1 || ownerListCollection.length > 0){
                        await firestore.collection('squares').doc(visitStorage.owner).collection('square').doc(`${visitStorage.squareId}`).collection('visitor').doc(visitor).update({
                                  mainAnimate: false,
                                  });
                      }
                      
                    }
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
  }, [allowInput, keyControl]);
  

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
                                                                      onMouseOver={()=>handleHoverTile(tile)}>
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
                    {/*<MainStyle key={visitors.uid} positionTop={visitors.positionTop} moveTop={visitors.moveTop} positionLeft={visitors.positionLeft} moveLeft={visitors.moveLeft} style={{zIndex: `${visitors.initial > 15 && visitors.initial < 21 && "16" || visitors.initial > 22 && visitors.initial < 28 && "26" || visitors.initial > 29 && visitors.initial < 35 && "36" || visitors.initial > 36 && visitors.initial < 42 && "46" || visitors.initial === 46 && "56"}`}}>
                                      {visitors.direction === "upDirection" && 
                                        (
                                          <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                                              {visitors.character === "default" && (visitors.mainAnimate === true && (<MainCharAnimation foot={visitors.foot} direction={visitors.direction}/>) || (<MainCharUp/>)) || visitors.character === "girlChar" && (visitors.mainAnimate === true && (<GirlCharAnimation foot={visitors.foot} direction={visitors.direction}/>) || (<GirlCharUp/>))}
                                            </div>
                                          </div>
                                        )
                                        || visitors.direction === "downDirection" &&
                                        (
                                          <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                                            {visitors.character === "default" && (visitors.mainAnimate === true && (<MainCharAnimation foot={visitors.foot} direction={visitors.direction}/>) || (<MainChar/>)) || visitors.character === "girlChar" && (visitors.mainAnimate === true && (<GirlCharAnimation foot={visitors.foot} direction={visitors.direction}/>) || (<GirlChar/>))}
                                            </div>
                                          </div>
                                        )
                                        || visitors.direction === "leftDirection" &&
                                        (
                                          <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                                            {visitors.character === "default" && (visitors.mainAnimate === true && (<MainCharAnimation foot={visitors.foot} direction={visitors.direction}/>) || (<MainCharLeft/>)) || visitors.character === "girlChar" && (visitors.mainAnimate === true && (<GirlCharAnimation foot={visitors.foot} direction={visitors.direction}/>) || (<GirlCharLeft/>))}
                                            </div>
                                          </div>
                                        )
                                        || visitors.direction === "rightDirection" &&
                                        (
                                          <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                                            {visitors.character === "default" && (visitors.mainAnimate === true && (<MainCharAnimation foot={visitors.foot} direction={visitors.direction}/>) || (<MainCharRight/>)) || visitors.character === "girlChar" && (visitors.mainAnimate === true && (<GirlCharAnimation foot={visitors.foot} direction={visitors.direction}/>) || (<GirlCharRight/>))}
                                            </div>
                                          </div>
                                        )
                                        }
                                        {visitors.message && 
                                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-80%", left: "80%", margin: "auto", zIndex: "50"}}>
                                                <div style={{position: "relative", width: "auto", maxWidth: "100%", height: "auto", backgroundColor: "white", border: "2px solid black", borderRadius: "5px", padding: "2% 5%"}}>
                                                  <p style={{wordWrap: "break-word", textTransform: "none"}}>{visitors.message}</p>
                                                </div>
                                            </div>}
                                        {visitors.username && 
                                        <div style={{position: "absolute", width: "100%", margin: "auto", top: "-75%", zIndex: "50"}}>
                                            <div style={{position: "relative", width: "100%", height: "auto", display: "flex", justifyContent: "center"}}>
                                              <div style={{position: "absolute", width: "auto", margin: "auto", backgroundColor: "RGBA(29,30,31,0.49)", padding: "2% 5%"}}>
                                                <p style={{wordWrap: "break-word", color: "RGBA(255,255,255,1)"}}>{visitors.username}</p>
                                              </div>
                                            </div>
                                        </div>}
                                    </MainStyle>*/}
                    {tile === 46 && 
                      (
                        visitorListCollection &&
                        (
                          visitorListCollection.length > 0 && 
                          (
                            visitorListCollection.map((visitors, index)=>
                              visitors.uid !== visitor && (
                                <MainStyle key={visitors.uid} positionTop={visitors.positionTop} moveTop={visitors.moveTop} positionLeft={visitors.positionLeft} moveLeft={visitors.moveLeft} style={{zIndex: `${visitors.initial > 15 && visitors.initial < 21 && "16" || visitors.initial > 22 && visitors.initial < 28 && "26" || visitors.initial > 29 && visitors.initial < 35 && "36" || visitors.initial > 36 && visitors.initial < 42 && "46" || visitors.initial === 46 && "56"}`}}>
                                      {visitors.direction === "upDirection" && 
                                        (
                                          <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                                              {visitors.character === "default" && (visitors.mainAnimate === true && (<MainCharAnimation foot={visitors.foot} direction={visitors.direction}/>) || (<MainCharUp/>)) || visitors.character === "girlChar" && (visitors.mainAnimate === true && (<GirlCharAnimation foot={visitors.foot} direction={visitors.direction}/>) || (<GirlCharUp/>))}
                                            </div>
                                          </div>
                                        )
                                        || visitors.direction === "downDirection" &&
                                        (
                                          <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                                            {visitors.character === "default" && (visitors.mainAnimate === true && (<MainCharAnimation foot={visitors.foot} direction={visitors.direction}/>) || (<MainChar/>)) || visitors.character === "girlChar" && (visitors.mainAnimate === true && (<GirlCharAnimation foot={visitors.foot} direction={visitors.direction}/>) || (<GirlChar/>))}
                                            </div>
                                          </div>
                                        )
                                        || visitors.direction === "leftDirection" &&
                                        (
                                          <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                                            {visitors.character === "default" && (visitors.mainAnimate === true && (<MainCharAnimation foot={visitors.foot} direction={visitors.direction}/>) || (<MainCharLeft/>)) || visitors.character === "girlChar" && (visitors.mainAnimate === true && (<GirlCharAnimation foot={visitors.foot} direction={visitors.direction}/>) || (<GirlCharLeft/>))}
                                            </div>
                                          </div>
                                        )
                                        || visitors.direction === "rightDirection" &&
                                        (
                                          <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                                            {visitors.character === "default" && (visitors.mainAnimate === true && (<MainCharAnimation foot={visitors.foot} direction={visitors.direction}/>) || (<MainCharRight/>)) || visitors.character === "girlChar" && (visitors.mainAnimate === true && (<GirlCharAnimation foot={visitors.foot} direction={visitors.direction}/>) || (<GirlCharRight/>))}
                                            </div>
                                          </div>
                                        )
                                        }
                                        {visitors.message && 
                                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-80%", left: "80%", margin: "auto", zIndex: "50"}}>
                                                <div style={{position: "relative", width: "auto", maxWidth: "100%", height: "auto", backgroundColor: "white", border: "2px solid black", borderRadius: "5px", padding: "2% 5%"}}>
                                                  <p style={{wordWrap: "break-word", textTransform: "none"}}>{visitors.message}</p>
                                                </div>
                                            </div>}
                                        {visitors.username && 
                                        <div style={{position: "absolute", width: "100%", margin: "auto", top: "-75%", zIndex: "50"}}>
                                            <div style={{position: "relative", width: "100%", height: "auto", display: "flex", justifyContent: "center"}}>
                                              <div style={{position: "absolute", width: "auto", margin: "auto", backgroundColor: "RGBA(29,30,31,0.49)", padding: "2% 5%"}}>
                                                <p style={{wordWrap: "break-word", color: "RGBA(255,255,255,1)"}}>{visitors.username}</p>
                                              </div>
                                            </div>
                                        </div>}
                                    </MainStyle>
                              ) 
                            )
                          )
                        )
                      )
                      }
                    {tile === 46 && 
                      (owner && (
                        <MainStyle  positionTop={positionTop} moveTop={moveTop} positionLeft={positionLeft} moveLeft={moveLeft} style={{zIndex: `${initial > 15 && initial < 21 && "16" || initial > 22 && initial < 28 && "26" || initial > 29 && initial < 35 && "36" || initial > 36 && initial < 42 && "46" || initial === 46 && "56"}`}} onClick={()=>console.log("Open Inventory")}>
                      {direction === "upDirection" && 
                        (
                          <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                              {character === "default" && (mainAnimate === true && (<MainCharAnimation foot={foot} direction={direction}/>) || (<MainCharUp/>)) || character === "girlChar" && (mainAnimate === true && (<GirlCharAnimation foot={foot} direction={direction}/>) || (<GirlCharUp/>))}
                            </div>
                          </div>
                        ) 
                        || 
                      direction === "downDirection" && 
                        (
                          <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                            {character === "default" && (mainAnimate === true && (<MainCharAnimation foot={foot} direction={direction}/>) || (<MainChar/>)) || character === "girlChar" && (mainAnimate === true && (<GirlCharAnimation foot={foot} direction={direction}/>) || (<GirlChar/>))}
                            </div>
                          </div>
                        )
                        || 
                      direction === "leftDirection" && 
                      (
                        <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                          <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%" ,margin: "auto"}}>
                          {character === "default" && (mainAnimate === true && (<MainCharAnimation foot={foot} direction={direction}/>) || (<MainCharLeft/>)) || character === "girlChar" && (mainAnimate === true && (<GirlCharAnimation foot={foot} direction={direction}/>) || (<GirlCharLeft/>))}
                          </div>
                        </div>
                      ) 
                      || 
                      direction === "rightDirection" && 
                      (
                        <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                            {character === "default" && (mainAnimate === true && (<MainCharAnimation foot={foot} direction={direction}/>) || (<MainCharRight/>)) || character === "girlChar" && (mainAnimate === true && (<GirlCharAnimation foot={foot} direction={direction}/>) || (<GirlCharRight/>))}
                            </div>
                          </div>
                      ) 
                      || 
                      (
                        <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                              {character === "default" && (<MainChar/>) || character === "girlChar" && (<GirlChar/>)}
                            </div>
                          </div>
                      )}
                      {
                        message && 
                          <div style={{position: "absolute", width: "100%", height: "100%", top: "-80%", left: "80%", margin: "auto", zIndex: "50"}}>
                              <div style={{position: "relative", width: "auto", maxWidth: "100%", height: "auto", backgroundColor: "white", border: "2px solid black", borderRadius: "5px", padding: "2% 5%"}}>
                                <p style={{wordWrap: "break-word", textTransform: "none"}}>{message}</p>
                              </div>
                          </div>
                      }
                      {
                        username && 
                          <div style={{position: "absolute", width: "100%", margin: "auto", top: "-75%", zIndex: "50"}}>
                            <div style={{position: "relative", width: "100%", height: "auto", display: "flex", justifyContent: "center"}}>
                              <div style={{position: "absolute", width: "auto", margin: "auto", backgroundColor: "RGBA(29,30,31,0.49)", padding: "2% 5%"}}>
                                <p style={{wordWrap: "break-word", color: "RGBA(255,225,0,1)"}}>{username}</p>
                              </div>
                            </div>
                          </div>
                      }
                      </MainStyle>
                      ))
                      }
                    {tile === 46 && 
                      (!owner && 
                        (
                          ownerListCollection && (
                            ownerListCollection.map((owner, index)=>
                              <MainStyle key={owner.id} positionTop={owner.positionTop} moveTop={owner.moveTop} positionLeft={owner.positionLeft} moveLeft={owner.moveLeft} style={{zIndex: `${owner.initial > 15 && owner.initial < 21 && "16" || owner.initial > 22 && owner.initial < 28 && "26" || owner.initial > 29 && owner.initial < 35 && "36" || owner.initial > 36 && owner.initial < 42 && "46" || owner.initial === 46 && "56"}`}}>
                                {owner.direction === "upDirection" && 
                                  (
                                    <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                                      <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                                      {owner.character === "default" && (owner.mainAnimate === true && (<MainCharAnimation foot={owner.foot} direction={owner.direction}/>) || (<MainCharUp/>)) || owner.character === "girlChar" && (owner.mainAnimate === true && (<GirlCharAnimation foot={owner.foot} direction={owner.direction}/>) || (<GirlCharUp/>))}
                                      </div>
                                    </div>
                                  )
                                  || owner.direction === "downDirection" &&
                                  (
                                    <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                                      <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                                      {owner.character === "default" && (owner.mainAnimate === true && (<MainCharAnimation foot={owner.foot} direction={owner.direction}/>) || (<MainChar/>)) || owner.character === "girlChar" && (owner.mainAnimate === true && (<GirlCharAnimation foot={owner.foot} direction={owner.direction}/>) || (<GirlChar/>))}
                                      </div>
                                    </div>
                                  )
                                  || owner.direction === "leftDirection" &&
                                  (
                                    <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                                      <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                                      {owner.character === "default" && (owner.mainAnimate === true && (<MainCharAnimation foot={owner.foot} direction={owner.direction}/>) || (<MainCharLeft/>)) || owner.character === "girlChar" && (owner.mainAnimate === true && (<GirlCharAnimation foot={owner.foot} direction={owner.direction}/>) || (<GirlCharLeft/>))}
                                      </div>
                                    </div>
                                  )
                                  || owner.direction === "rightDirection" &&
                                  (
                                    <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                                      <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                                      {owner.character === "default" && (owner.mainAnimate === true && (<MainCharAnimation foot={owner.foot} direction={owner.direction}/>) || (<MainCharRight/>)) || owner.character === "girlChar" && (owner.mainAnimate === true && (<GirlCharAnimation foot={owner.foot} direction={owner.direction}/>) || (<GirlCharRight/>))}
                                      </div>
                                    </div>
                                  )
                                  }
                                  {
                                    owner.message && 
                                      <div style={{position: "absolute", width: "100%", height: "100%", top: "-80%", left: "80%", margin: "auto", zIndex: "50"}}>
                                          <div style={{position: "relative", width: "auto", maxWidth: "100%", height: "auto", backgroundColor: "white", border: "2px solid black", borderRadius: "5px", padding: "2% 5%"}}>
                                            <p style={{wordWrap: "break-word", textTransform: "none"}}>{owner.message}</p>
                                          </div>
                                      </div>
                                  }
                                  {
                                    owner.username && 
                                      <div style={{position: "absolute", width: "100%", margin: "auto", top: "-75%", zIndex: "50"}}>
                                        <div style={{position: "relative", width: "100%", height: "auto", display: "flex", justifyContent: "center"}}>
                                          <div style={{position: "absolute", width: "auto", margin: "auto", backgroundColor: "RGBA(29,30,31,0.49)", padding: "2% 5%"}}>
                                            <p style={{wordWrap: "break-word", color: "RGBA(255,255,255,1)"}}>{owner.username}</p>
                                          </div>
                                        </div>
                                      </div>
                                  }
                              </MainStyle>
                              )
                          )
                        )
                      )
                      }
                    {tile === 46 && 
                      (visitor && (
                        <MainStyle  positionTop={positionTop} moveTop={moveTop} positionLeft={positionLeft} moveLeft={moveLeft} style={{zIndex: `${initial > 15 && initial < 21 && "16" || initial > 22 && initial < 28 && "26" || initial > 29 && initial < 35 && "36" || initial > 36 && initial < 42 && "46" || initial === 46 && "56"}`}}>
                      {direction === "upDirection" && 
                        (
                          <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                            {character === "default" && (mainAnimate === true && (<MainCharAnimation foot={foot} direction={direction}/>) || (<MainCharUp/>)) || character === "girlChar" && (mainAnimate === true && (<GirlCharAnimation foot={foot} direction={direction}/>) || (<GirlCharUp/>))}
                            </div>
                          </div>
                        ) 
                        || 
                      direction === "downDirection" && 
                        (
                          <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                            {character === "default" && (mainAnimate === true && (<MainCharAnimation foot={foot} direction={direction}/>) || (<MainChar/>)) || character === "girlChar" && (mainAnimate === true && (<GirlCharAnimation foot={foot} direction={direction}/>) || (<GirlChar/>))}
                            </div>
                          </div>
                        )
                        || 
                      direction === "leftDirection" && 
                      (
                        <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                          <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%" ,margin: "auto"}}>
                          {character === "default" && (mainAnimate === true && (<MainCharAnimation foot={foot} direction={direction}/>) || (<MainCharLeft/>)) || character === "girlChar" && (mainAnimate === true && (<GirlCharAnimation foot={foot} direction={direction}/>) || (<GirlCharLeft/>))}
                          </div>
                        </div>
                      ) 
                      || 
                      direction === "rightDirection" && 
                      (
                        <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                            {character === "default" && (mainAnimate === true && (<MainCharAnimation foot={foot} direction={direction}/>) || (<MainCharRight/>)) || character === "girlChar" && (mainAnimate === true && (<GirlCharAnimation foot={foot} direction={direction}/>) || (<GirlCharRight/>))}
                            </div>
                          </div>
                      ) 
                      || 
                      (
                        <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-75%", margin: "auto"}}>
                            {character === "default" && (<MainChar/>) || character === "girlChar" && (<GirlChar/>)}
                            </div>
                          </div>
                      )}
                      {
                        message && 
                          <div style={{position: "absolute", width: "100%", height: "100%", top: "-80%", left: "80%", margin: "auto", zIndex: "50"}}>
                              <div style={{position: "relative", width: "auto", maxWidth: "100%", height: "auto", backgroundColor: "white", border: "2px solid black", borderRadius: "5px", padding: "2% 5%"}}>
                                <p style={{wordWrap: "break-word", textTransform: "none"}}>{message}</p>
                              </div>
                          </div>
                      }
                      {
                        username && 
                          <div style={{position: "absolute", width: "100%", margin: "auto", top: "-75%", zIndex: "50"}}>
                            <div style={{position: "relative", width: "100%", height: "auto", display: "flex", justifyContent: "center"}}>
                              <div style={{position: "absolute", width: "auto", margin: "auto", backgroundColor: "RGBA(29,30,31,0.49)", padding: "2% 5%"}}>
                                <p style={{wordWrap: "break-word", color: "RGBA(255,225,0,1)"}}>{username}</p>
                              </div>
                            </div>
                          </div>
                      }
                      </MainStyle>
                      ))
                      }
                  </div>
                ))}
              </div>
              {chatBox && 
                <div style={{position: "absolute", width: "100%", bottom: "0", zIndex: "40"}}>
                  <input id="Message" type="text" style={{width: "100%"}} onChange={(e)=>setMessage(e.target.value)}></input>
                </div>
              }
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
          Doan Nguyen - 2021
        </a>
      </footer>
  </div>
  )
}


export default withRouter(SquareVisit);

