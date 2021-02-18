import { useState, useEffect } from 'react';
import {Button} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import firebase from "firebase/app";
import "firebase/firestore";
import initFirebase from "../services/firebase";
import DefaultTheme from "../sprites/themes/squareTheme";

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';


initFirebase();

const firestore = firebase.firestore();



const SquareList = ({uid}) =>{
  const userSquareRef = firestore.collection('squares').doc(uid);
  const userSquareQuery = userSquareRef;
  const [userSquareCollection] = useDocumentData(userSquareQuery, {idField: 'id'});
  const [userData, setUserData] = useState();
  const [squarePanel, setSquarePanel] = useState();
  const squareListRef = firestore.collection('squares').doc(uid).collection('square');
  const squareListQuery = squareListRef.orderBy('name');
  const [squareListCollection] = useCollectionData(squareListQuery, {idField: 'id'});
  // hook for createSquare
  const [nameSquare, setNameSquare] = useState("");
  const [themeSquare, setThemeSquare] = useState("");
  const [errorName, setErrorName] = useState();
  const [errorTheme, setErrorTheme] = useState();
    //const data = squareDocument.data();
    //console.log(data);
    
    useEffect(() => {
      if (userSquareCollection) {
        setUserData(userSquareCollection);
        }
    }, [userSquareCollection]);
    /*
    
    const getSquareList = (uid) => {
        return firestore.collection('squares')
        .doc(uid)
        .get();
    };
    
      <p>Squares created: {userSquareCollection && (userSquareCollection.quantity)}</p>
    */
     // Pop the squarePanel to create a Square

  const openSquarePanel = async () =>{
    setSquarePanel(true);
  }
  const handleClosePanel = async () =>{
    setSquarePanel(false);
  }

  const createSquare = async ()=>{
    if(userData){
      if(!nameSquare){
        setErrorName("Square name cannot be empty!")
      }else if(nameSquare.length > 20){
          setErrorName("Square name cannot exceed 10 chars.")
      }else if(!themeSquare){
          setErrorTheme("Please choose a Square theme!")
      }else{
      const userId = uid;
      const quantity = userData.quantity + 1; 
      const squareId = userId + quantity;
      console.log(squareId);
      await userSquareRef.update({
        quantity: quantity
      });
      await userSquareRef.collection('square').doc(`${squareId}`).set({
        id: `${squareId}`,
        name: nameSquare,
        theme: themeSquare,
        status: false
      });
      
      setSquarePanel(false);
      }
      
    }
  }

  return(
      <>
      {squarePanel && (
        <div className="squarePanel" style={{position: "absolute", display: "flex", flexDirection: "column", margin: "auto", width: "100%", height: "100%", alignItems: "center", borderRadius: "1%", zIndex: "15", backgroundColor: "white"}}>
        <div className="squareFormPanel" style={{position: "relative", width: "100%",height: "90%",display: "flex", flexDirection: "column", backgroundColor: "rgba(252, 235, 0, 0.589)"}}>
          <h1>Create Square</h1>
          <div style={{position: "relative", width: "50%", margin: "auto", marginTop: "0", marginBottom: "0",display: "flex", flexDirection: "column"}}>
          <FormControl>
          <TextField id="outlined-basic" label="Square Name" variant="outlined" value={nameSquare} onChange={(e)=>{setNameSquare(e.target.value)}} />
          {errorName && <div className="alert alert-danger" role="alert">{errorName}</div>}
          </FormControl>
          <FormControl>
          <InputLabel>Theme</InputLabel>
          <Select value={themeSquare} onChange={(e)=>{setThemeSquare(e.target.value)}} >
            <MenuItem value="default" >Default</MenuItem>
          </Select>
          <FormHelperText>Choose a theme</FormHelperText>
          {errorTheme && <div className="alert alert-danger" role="alert">{errorTheme}</div>}
          </FormControl>
          </div>
          <div className="themePreview" style={{position: "relative", width: "20%", margin: "auto", marginTop: "0", paddingBottom: "20%",border: "1px solid black"}}><DefaultTheme /></div>
        </div>
        <div className="squareButtonPanel" style={{position: "relative", textAlign: "center", height: "10%", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-evenly", backgroundColor: "rgba(252, 164, 0, 0.493)"}}>
          
        <Button variant="contained" color="primary" onClick={()=>createSquare()}>
            Create
          </Button>
          <Button variant="contained" color="secondary" onClick={()=>handleClosePanel()}>
            Cancel
          </Button>
        </div>
        </div>
      )}
      <div className="createSquareButton" style={{position: "relative", textAlign: "center", width: "100%",height: "10%", display: "flex", alignItems: "center", justifyContent: "space-evenly"}}>
      {userData && (
        userData.quantity === 0 && (
        <Button variant="contained" color="primary" onClick={()=>openSquarePanel()} >
           My first Square
        </Button>
        )
        ||(
          <Button variant="contained" color="primary" onClick={()=>openSquarePanel()} >Create Square</Button>
        )
          )}
          <Button variant="contained" style={{backgroundColor: "yellow"}}>
           Join Square
        </Button>
        <Button variant="contained" style={{backgroundColor: "orange"}}>
           Join Friend Square
        </Button>
      </div>
      <div className="squareList" style={{position: "relative", textAlign: "center", height: "40%", width: "100%", display: "flex", alignItems: "center", backgroundColor: "blue"}}>
          <div style={{position: "relative", width: "100%", display: "flex",flexDirection: "row", backgroundColor: "red",overflow: "auto"}}>
          {squareListCollection && (squareListCollection.map(square=>
                  <div key={square.id}  style={{position: "relative", minWidth: "25%", paddingBottom: "25%", backgroundColor: "white", margin: "auto"}}>
                  <div style={{position: "absolute", width: "100%", height: "100%", border: "1px solid black"}}>
                  </div>
                </div>
                ))}
          
          </div>
      </div>
      </>
    )

}

export default SquareList;