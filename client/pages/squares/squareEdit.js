import { useState, useEffect } from "react";
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import DefaultTheme from '../sprites/themes/squareTheme';
import { useRouter } from 'next/router';
import { withRouter } from "next/router";

import ChairRight from "../sprites/furnitures/chair";
import StorageDown from "../sprites/furnitures/storage";

import firebase from "firebase/app";
import "firebase/firestore";
import initFirebase from "../api/firebase";

import { useDocumentData } from 'react-firebase-hooks/firestore';


initFirebase();

//const auth = firebase.auth();
const firestore = firebase.firestore();

const SquareEdit = ({router}) => {
  const history = useRouter();
  const maxTiles = 49;
  const [tilesArray, setTilesArray] = useState([]);
  const [userId, setUserId] = useState();
  const [squareId, setSquareId] = useState();
  const [helperVisibility, setHelperVisibility] = useState("visible");
  const [objectVisibility, setObjectVisibility] = useState("hidden");
  const [objectHeight, setObjectHeight] = useState();
  const [editor, setEditor] = useState(false);
  const [backgroundTiles, setBackgroundTiles] = useState("rgba(21,21,21,0.9)");
  const [userStorage, setUserStorage] = useState();
  const [editStorage, setEditStorage] = useState();
  const [focusTile, setFocusTile] = useState();
  const [hoverTile, setHoverTile] = useState();
  const [objectBar, setObjectBar] = useState(["",""]);
  const [objectPlacement, setObjectPlacement] = useState([]);
  const [squareListQuery, setSquareListQuery] = useState();
  const [userSquareData] = useDocumentData(squareListQuery, {idField: 'id'});
  
  useEffect(()=>{
    const userLocal = JSON.parse(localStorage.getItem("user"));
    const editLocal = JSON.parse(localStorage.getItem("edit"));
    if(!editLocal){
      console.log("No Access")
      console.log(editLocal);
      history.push('../')
    }else{
      setUserStorage(userLocal);
      setEditStorage(editLocal);
    }
  }, []);

  useEffect(() => {
    if (userStorage && editStorage) {
      console.log(userStorage);
      console.log(editStorage);
      const squareListRef = firestore.collection('squares').doc(userStorage.uid).collection('square').doc(editStorage.squareId);

      setSquareListQuery(squareListRef);
      }
  }, [userStorage, editStorage]);

  useEffect(() => {
    if (userSquareData) {
      if(userSquareData.data){
        
      setObjectPlacement(userSquareData.data);
      }
      }
  }, [userSquareData]);
  /*
  
  useEffect(()=>{
    if(router){
    if(router.query.user){
      setUserId(router.query.user);
      console.log(router.query.user);
    }else{
      console.log("something wrong happen!");
    }
    if(router.query.squareId){
      setSquareId(router.query.squareId);
      console.log(router.query.squareId);
    }else{
      console.log("something wrong happen!")
    }
    }
  }, []);
  
  router.push({
      pathname: '/squares/squareEdit',
      query: {user: uid,
              squareId: squareId,
            }
    });
  */
  useEffect(()=>{
    const array = [];
    for( let i = 1; i <= maxTiles; i++){
        array.push(i)
    }
    setTilesArray(array);
  }, [maxTiles]);

  const editObject = (tile) =>{
    
    const rowOne = [2,3,4,5,6];
    const rowTwo = [9,10,11,12,13];
    const rowThree = [
                      16,17,18,19,20,
                      23,24,25,26,27,
                      30,31,32,33,34,
                      37,38,39,40,41  
                    ];
    const totalRow = rowOne.concat(rowTwo).concat(rowThree);
    const objectTile = ["empty","chair", "storage"];
    if(tile){
      if(totalRow.includes(tile)){
        if(rowThree.includes(tile)){
          setFocusTile(tile);
          setObjectVisibility("visible");
          setObjectHeight("15%");
          setObjectBar(objectTile);
        }else{
          setFocusTile(tile);
          setObjectVisibility("visible");
          setObjectHeight("15%");
          setObjectBar(["","",""]);
        }
      }
    }

  }


  const handleTiles = async (tile) =>{
    if(helperVisibility){
      if(helperVisibility === "visible"){
        setHelperVisibility("hidden");
        setBackgroundTiles("rgba(0,0,0,0)")
        setEditor(true);
      }else{
        if(focusTile){
          /*if(objectPlacement){
            const data = [...objectPlacement];
            const i = data.findIndex(object => object.position === focusTile);
            console.log(data[i].position);
            console.log(focusTile);
            if(data && data[i].position === focusTile){
              console.log("change Direction");
            }
          }*/
          if(objectPlacement){
            const data = [...objectPlacement];
            const i = data.findIndex(object => object.position === focusTile);
            console.log(data[i]);
            console.log(focusTile);
            if(data[i]){
              if(data[i].position === tile){
                console.log(data[i].position);
                console.log(data[i].type);
                console.log(tile);
                console.log("change Direction");
              }else{
              setObjectHeight("0%");
              setObjectVisibility("hidden");
              setFocusTile();
              }
            }else{
              setObjectHeight("0%");
              setObjectVisibility("hidden");
              setFocusTile();
            }
            
          
          }

        }else{
          
          if(tile){
          if(tile === 46){
            if(objectPlacement){
              console.log(userStorage.uid);
              console.log(editStorage.squareId);
              await firestore.collection('squares').doc(userStorage.uid).collection('square').doc(`${editStorage.squareId}`).update({
               data: objectPlacement
              });
            }
            history.push('../');
          }else{
            console.log(tile);
            editObject(tile);

          if(editor === true ){
            console.log("start editor");
          }

         }
        }
        }
      }
    }
  }

  const handleHoverTile = (tile) =>{
   if(editor){
    if(tile){
      setHoverTile(tile);
    }
   }
  }

  const placeObject = (focusTile, object) =>{
    if(focusTile && object){
      console.log(focusTile);
      console.log(object);
      //const objectData = objectPlacement;
      
      if(objectPlacement){
        const data = [...objectPlacement];
        const i = data.findIndex(object => object.position === focusTile);
        console.log(i);
        if (data[i]){
           data[i] = {position: focusTile,
           type: object};
          
          } else {
            data.push({position: focusTile,
              type: object});
          }
        console.log(data);
        setObjectPlacement(data);
        
      }
      //setObjectPlacement(objectData);
      //setObjectType(object);
    }
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>Edit Square</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className="screenWrapper" style={{position: "relative",height: "100vh",width: "100%", margin: "auto", display: "flex", backgroundColor: "black"}}>
          <div className={styles.screen} style={{ position: "relative", display: "flex", flexDirection: "row", flexWrap: "wrap", width: "90vh", margin: "auto"}}>
            <div className="tiles" style={{position: "absolute", display: "flex",flexDirection: "row", flexWrap: "wrap", width: "100%", zIndex: "10"}}>
              {tilesArray.map((tile)=>(
                  <div className={styles.soloTile} key={tile} style={{position: "relative" ,width: "14.28%", paddingBottom: "14.28%", 
                                                                      backgroundColor: `${tile === focusTile && "rgba(49,200,51,0.39)" 
                                                                      || tile === hoverTile && "rgba(49,48,51,0.39)" 
                                                                      || backgroundTiles}`, zIndex: "15", 
                                                                      transition: "background-color 0.5s linear"}} 
                                                                      onMouseOver={()=>handleHoverTile(tile)} onClick={()=>handleTiles(tile)}>
                  {objectPlacement && (objectPlacement.map((object, index)=> <div key={index} style={{position: "absolute", width: "100%", height: "100%",margin: "auto"}}>
                    {tile === object.position && 
                      (
                          (object.type === "chair" && 
                          <div style={{position: "relative", width: "100%", height: "100%",display: "flex", justifyContent: "center"}}>
                            <div style={{position: "absolute", width: "100%", height: "100%", top: "-60%", margin: "auto"}}>
                            <ChairRight/>
                            </div>
                          </div>
                          )
                          ||
                          (object.type === "empty" && 
                            <div style={{position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center"}}>
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
                      ) 
                    }
                      </div>
                      ))}
                  </div>
                ))}
              </div>

            {objectVisibility && (
              <div className="objectVisibility" style={{position: "absolute", width: `100%`, height: `21.42%`, top: "0%", left: "0%", display: "flex", alignItems: "center",
                                                        visibility: `${objectVisibility}`, transition: "visibility 0.5s linear"}}>
                
                <div className="objectListPanel" style={{position: "relative", width: "100%",display: "flex",
                               flexDirection: "row", overflow: "auto",  backgroundColor: "rgba(999,999,999,0.4)", zIndex: "20", transition: "height 0.5s linear"}}>
                
                {objectBar && (objectBar.map((object,index)=>
                        <div key={index} style={{position: "relative", minWidth: "15%", 
                                                  paddingBottom: `${objectHeight && objectHeight || "0%"}`, 
                                                  margin: "1%", backgroundColor: "white", transition: "padding-bottom 0.5s linear"}} >
                              {object === "chair" && 
                                (
                                  <div style={{position: "absolute", width: "100%", height: "100%",margin: "auto"}}>
                                    <div style={{position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center"}} onClick={()=>placeObject(focusTile, object)}>
                                      <ChairRight/>
                                    </div>
                                  </div>
                                )
                                || object === "storage" && (
                                  <div style={{position: "absolute", width: "100%", height: "100%",margin: "auto"}}>
                                    <div style={{position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center"}} onClick={()=>placeObject(focusTile, object)}>
                                      <StorageDown/>
                                    </div>
                                  </div>
                                )|| object === "empty" && (
                                  <div style={{position: "absolute", width: "100%", height: "100%",margin: "auto"}}>
                                    <div style={{position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center"}} onClick={()=>placeObject(focusTile, object)}>
                                      
                                    </div>
                                  </div>
                                )}
                        </div>
                  ))}
                </div>
                  

                </div>
              )}
            {helperVisibility && (<div className="helperVisibility" style={{position: "absolute", width: `60%`, top: "40%", left: "20%", display: "flex",
                                                        justifyContent: "center", alignItems: "center", textAlign: "center",
                                                        padding: "1%", backgroundColor: "white", zIndex: "20", borderRadius: "10px", border: "4px solid black", visibility: `${helperVisibility}`, transition: "visibility 0.5s linear"}}>
                <h1>Click on a tile to customise your square</h1>
                </div>
              )}
            <div className="themeSquare" style={{ position: "relative", width: "100%",display: "flex"}}>
              <DefaultTheme/>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powefocus by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}


export default withRouter(SquareEdit);

