import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DefaultTheme from "../sprites/themes/squareTheme";
import {Button} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import firebase from "firebase/app";
import "firebase/firestore";
import initFirebase from "../api/firebase";
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';


initFirebase();

const firestore = firebase.firestore();



const SquareList = ({uid}) =>{
  const router = useRouter();
  const userSquareRef = firestore.collection('squares').doc(uid);
  const userSquareQuery = userSquareRef;
  const [userSquareCollection] = useDocumentData(userSquareQuery, {idField: 'id'});
  const [userData, setUserData] = useState();
  
  const squareListRef = firestore.collection('squares').doc(uid).collection('square');
  const [squareListCollection] = useCollectionData(squareListRef, {idField: 'id'});
  // hook for createSquare
  const [squarePanel, setSquarePanel] = useState();
  const [nameSquare, setNameSquare] = useState("");
  const [themeSquare, setThemeSquare] = useState("");
  const [errorName, setErrorName] = useState();
  const [errorTheme, setErrorTheme] = useState();
  const [joinSquareMode, setJoinSquareMode] = useState(true);

  // hook for visitSquare
  const [visitPanel, setVisitPanel] = useState();
  const [urlVisit, setUrlVisit] = useState("");
  const [errorUrl, setErrorUrl] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [errorId, setErrorId] = useState("");
  
  useEffect(()=>{
    const visit = JSON.parse(localStorage.getItem("visit"));
    if(!visit){
      setJoinSquareMode(true);
    }
    else
    {
      setJoinSquareMode(false);
    }
  }, []);

  useEffect(() => {
      if (userSquareCollection) {
        setUserData(userSquareCollection);
        }
  }, [userSquareCollection]);

  const openSquarePanel = async () =>{
    setSquarePanel(true);
  }

  const openVisitPanel = async () =>{
    setVisitPanel(true);
  }

  const handleCloseVisitPanel = () =>{
    setUrlVisit("");
    setOwnerId("");
    setVisitPanel(false);
  }

  const handleClosePanel = () =>{
    setThemeSquare("");
    setNameSquare("");
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
        if(!userData.quantity){
          const userId = uid;
          const quantity = 1; 
          const squareId = userId + quantity;
          console.log(squareId);
          await userSquareRef.update({
            quantity: quantity
          });
          await userSquareRef.collection('square').doc(`${squareId}`).set({
            id: `${squareId}`,
            owner: `${userId}`,
            name: nameSquare,
            theme: themeSquare,
            status: false
          });
          setThemeSquare("");
          setNameSquare("");
          setSquarePanel(false);
        }
        else
        {
          const userId = uid;
          const quantity = userData.quantity + 1; 
          const squareId = userId + quantity;
          console.log(squareId);
          await userSquareRef.update({
            quantity: quantity
          });
          await userSquareRef.collection('square').doc(`${squareId}`).set({
            id: `${squareId}`,
            owner: `${userId}`,
            name: nameSquare,
            theme: themeSquare,
            status: false
          });
          setThemeSquare("");
          setNameSquare("");
          setSquarePanel(false);
        }
      }
    }
  }

  const editSquare = (squareId) =>{
    const updateData = {
      mode: "edit",
      squareId: squareId,
    }
    localStorage.setItem("edit", JSON.stringify(updateData));
    console.log(squareId);
    router.push({
      pathname: '/squares/squareEdit'
    });
  }

  const deleteSquare = async (squareId) =>{
    if(squareId){
      await squareListRef.doc(squareId).delete();
      if(userData.quantity){
        const quantity = userData.quantity - 1;
        await userSquareRef.update({
          quantity: quantity
        });
      }
    }
  }

  const visitSquare = () =>{
    if(!ownerId){
      setErrorId("Owner Id is required!");
    }else if(!urlVisit){
      setErrorUrl("Square Link is required!");
    }else{
      console.log(urlVisit);
      console.log(ownerId);
      const updateData = {
        mode: "visit",
        squareId: urlVisit,
        owner: ownerId
      }
      localStorage.setItem("visit", JSON.stringify(updateData));
      router.push({
        pathname: '/squares/squareVisit'
      });
    }
  }

  const ToggleJoinSquare = () =>{
    if(joinSquareMode){
      setJoinSquareMode();
    }else{
      localStorage.removeItem("visit");
      setJoinSquareMode(true);
    }
    
  }

  const joinSquare = (squareId) =>{
    const updateData = {
      mode: "visit",
      squareId: squareId,
      owner: uid
    }
    localStorage.setItem("visit", JSON.stringify(updateData));
    console.log(squareId);
    router.push({
      pathname: '/squares/squareVisit'
    });
  }

  return(
    <>
    {visitPanel && 
      (
        <div className="squarePanel" style={{
                                              position: "absolute", display: "flex", flexDirection: "column", margin: "auto", width: "100%",
                                              height: "100%", alignItems: "center", zIndex: "15", backgroundColor: "white"
                                            }}>
          <div className="squareFormPanel" style={{position: "relative", width: "100%",height: "90%",display: "flex", flexDirection: "column",
                                                    backgroundColor: "#99f35e"}}>
            <h1 style={{color: "rgb(50, 225, 50)"}} >
              Visit Square
            </h1>
            <div style={{position: "relative", width: "50%", margin: "auto", marginTop: "0", marginBottom: "0",display: "flex", flexDirection: "column"}}>
              <FormControl>
                <TextField id="outlined-basic" label="Square ID" variant="outlined" value={ownerId} onChange={(e)=>{setOwnerId(e.target.value)}} />
                {errorId && <div className="alert alert-danger" role="alert" style={{color: "red"}}>{errorId}</div>}
              </FormControl>
              <FormControl style={{marginTop: "5%"}}>
                <TextField id="outlined-basic1" label="Square Link" variant="outlined" value={urlVisit} onChange={(e)=>{setUrlVisit(e.target.value)}} />
                {errorUrl && <div className="alert alert-danger" role="alert" style={{color: "red"}}>{errorUrl}</div>}
              </FormControl>
            </div>
            {themeSquare && (
              <div className="themePreview" style={{position: "relative", width: "20%", margin: "auto", marginTop: "0", paddingBottom: "20%"}}>
                <div style={{position: "absolute"}} ><DefaultTheme /></div>
              </div>
            )}
          </div>
          <div className="squareButtonPanel" style={{
            position: "relative", textAlign: "center", height: "10%", width: "100%", display: "flex",
            alignItems: "center", justifyContent: "space-evenly", backgroundColor: "rgb(50, 225, 50)"
          }}>  
            <Button variant="contained" color="primary" onClick={()=>visitSquare()}>
              Visit
            </Button>
            <Button variant="contained" color="secondary" onClick={()=>handleCloseVisitPanel()}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      {squarePanel && 
        (
          <div className="squarePanel" style={{
                                                position: "absolute", display: "flex", flexDirection: "column", margin: "auto", width: "100%",
                                                height: "100%", alignItems: "center", zIndex: "15", backgroundColor: "white"
                                              }}>
            <div className="squareFormPanel" style={{position: "relative", width: "100%",height: "90%",display: "flex", flexDirection: "column",
                                                      backgroundColor: "rgba(252, 235, 0, 0.589)"}}>
              <h1 style={{color: "rgba(252, 164, 0, 0.493)"}} >
                Create Square
              </h1>
              <div style={{position: "relative", width: "50%", margin: "auto", marginTop: "0", marginBottom: "0",display: "flex", flexDirection: "column"}}>
                <FormControl>
                  <TextField id="outlined-basic" label="Square Name" variant="outlined" value={nameSquare} onChange={(e)=>{setNameSquare(e.target.value)}} />
                  {errorName && <div className="alert alert-danger" role="alert" style={{color: "red"}}>{errorName}</div>}
                </FormControl>
                <FormControl>
                  <InputLabel>Theme</InputLabel>
                  <Select value={themeSquare} onChange={(e)=>{setThemeSquare(e.target.value)}} >
                    <MenuItem value="default" >Default</MenuItem>
                  </Select>
                  <FormHelperText>Choose a theme</FormHelperText>
                  {errorTheme && <div className="alert alert-danger" role="alert" style={{color: "red"}}>{errorTheme}</div>}
                </FormControl>
              </div>
              {themeSquare && (
                <div className="themePreview" style={{position: "relative", width: "20%", margin: "auto", marginTop: "0", paddingBottom: "20%"}}>
                  <div style={{position: "absolute"}} ><DefaultTheme /></div>
                </div>
              )}
            </div>
            <div className="squareButtonPanel" style={{
              position: "relative", textAlign: "center", height: "10%", width: "100%", display: "flex",
              alignItems: "center", justifyContent: "space-evenly", backgroundColor: "rgba(252, 164, 0, 0.493)"
            }}>  
              <Button variant="contained" color="primary" onClick={()=>createSquare()}>
                Create
              </Button>
              <Button variant="contained" color="secondary" onClick={()=>handleClosePanel()}>
                Cancel
              </Button>
            </div>
          </div>
        )}
          <div className="createSquareButton" style={{
                                                      position: "relative", textAlign: "center", width: "100%",height: "10%", 
                                                      display: "flex", alignItems: "center", justifyContent: "space-evenly", 
                                                      backgroundColor: "rgba(999, 999, 999, 1)"}}>
            <Button variant="contained" style={{backgroundColor: `${joinSquareMode && "#99f35e" || "yellow"}`}} onClick={(e)=>ToggleJoinSquare()}>
              {joinSquareMode && "Join Square" || "Edit Square"}
            </Button>
            <Button variant="contained" style={{backgroundColor: "orange"}}>
              Join Friend Square
            </Button>
          </div>
          <div className="squareList" style={{position: "relative", textAlign: "center", height: "40%", width: "100%", display: "flex",
                                              alignItems: "center", backgroundColor: "black", overflow: "auto"}}>
              <div style={{position: "relative", width: "100%", display: "flex",flexDirection: "row",backgroundColor: "black", alignItems: "center"}}>
                <div style={{position: "relative", width: "24%", minWidth: "24%", paddingBottom: "24%", margin: "auto", backgroundColor: "rgb(57, 57, 83)", 
                             display: "flex", justifyContent: "center"}}>
                  <div style={{position: "absolute", width: "100%", height: "100%", margin: "auto", display: "flex", justifyContent: "center", alignItems: "center", 
                               border: `${joinSquareMode && "1px solid yellow" || "1px solid #99f35e"}`}}>
                    {userData && 
                      (
                        !userData.quantity && (
                          <Button variant="contained" style={{backgroundColor: `${joinSquareMode && "yellow" || "#99f35e" }`}} onClick={()=>openSquarePanel()} >
                            {joinSquareMode && "My first Square" || "Visit a Square"}
                          </Button>
                        )
                      ||
                        (
                          <Button variant="contained" style={{backgroundColor: `${joinSquareMode && "yellow" || "#99f35e" }`}} onClick={joinSquareMode && (()=>openSquarePanel()) || (()=>openVisitPanel())} >
                            {joinSquareMode && "+ Create Square" || "Visit a Square"}
                          </Button>
                        )
                      )
                    }
                  </div>
                </div>
                {squareListCollection && 
                  (squareListCollection.map(square=>
                    <div key={square.id}  style={{position: "relative", width: "24%", minWidth: "24%", paddingBottom: "24%", margin: "auto", marginLeft: "1%",
                                                  backgroundColor: "white", display: "flex", justifyContent: "center"}}>
                      <div style={{position: "absolute", width: "100%", margin: "auto"}}>
                        <DefaultTheme/>
                      </div>
                      <div style={{position: "absolute", width: "95%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", flexWrap: "wrap"}}>
                        <div style={{position: "relative", width: "100%", height: "50%", display: "flex", flexDirection: "column", alignItems: "center"}} >
                          <p style={{border: `1px solid ${joinSquareMode && "yellow" || "#99f35e" }`,backgroundColor: `${joinSquareMode && "rgba(255, 255, 0, 0.7)" || "#9af35e9f" }`,
                                     padding: "2% 5%"}}>
                            {square.name}
                          </p>
                        </div>
                        <div style={{position: "relative", width: "100%", height: "50%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                          {
                            joinSquareMode && 
                              <Button variant="contained" color="secondary" style={{width: "80%", borderRadius: "3px", padding: "0 5%", marginBottom: "1%"}}
                                onClick={()=>deleteSquare(square.id)}>
                                  Delete
                              </Button>
                          }
                          <Button variant="contained" style={{width: "80%", backgroundColor: `${joinSquareMode && "yellow" || "#99f35e" }`, borderRadius: "3px", padding: "0 5%"}} 
                            onClick={joinSquareMode && (()=>editSquare(square.id)) || (()=>joinSquare(square.id))}>
                              {joinSquareMode && "Edit" || "Enter"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
          </div>
    </>
  )

}

export default SquareList;