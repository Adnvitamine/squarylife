import { useState, useEffect } from "react";

// SquareList Component Import
import SquareList from "./squares/squareList";

// Sprites Component Import
import SquaryLife from "./sprites/banner/squaryLife";
import MainChar, {MainCharUp, MainCharRight, MainCharLeft} from "./sprites/characters/mainChar/mainChar";
import GirlChar, {GirlCharUp, GirlCharLeft, GirlCharRight} from "./sprites/characters/girlChar/girlChar";

// Material UI Component Import
import {Button} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// All Needed Firebase Component Import
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import initFirebase from "./api/firebase";
import { useCollectionData } from 'react-firebase-hooks/firestore';
// We could import useAuthState from React Firebase Hooks for auth, but in our case, it won't be necessary
//import { useAuthState } from 'react-firebase-hooks/auth';

// Initialisation for Firebase
initFirebase();

// Connection to Cloud Firestore
//const auth = firebase.auth();
const firestore = firebase.firestore();

const Start = () => {

  //const [userAuth] = useAuthState(auth);
  const [userStorage, setUserStorage] = useState();
  const [openDialog, setOpenDialog] = useState(false);

  // hooks for REGISTERED USERS COLLECTION in firestore
  const usersRef = firestore.collection('users');
  const usersQuery = usersRef.orderBy('name');
  const [usersCollection] = useCollectionData(usersQuery, {idField: 'id'});

  // hooks for ONLINE-USERS COLLECTION in firestore
  const onlineUsersRef = firestore.collection('online-users');
  const onlineUsersQuery = onlineUsersRef.orderBy('name');
  const [onlineUsersCollection] = useCollectionData(onlineUsersQuery, {idField: 'id'});

  // hooks for all USERS in SQUARES COLLECTION in firestore
  const squaresRef = firestore.collection('squares');
  const squaresQuery = squaresRef.orderBy('uid');
  const [squaresCollection] = useCollectionData(squaresQuery, {idField: 'id'});
  
  // hooks for all Squares in USER's SQUARE COLLECTION in firestore
  const [squareListQuery, setSquareListQuery] = useState();
  const [squareListCollection] = useCollectionData(squareListQuery, {idField: 'id'});

  //
  
  const [character, setCharacter] = useState("default");
  const [direction, setDirection] = useState("downDirection");
  
  const switchChar = () =>{
    if(character){
      if(character === "default"){
        setCharacter("girlChar");
      }else if(character === "girlChar"){
        setCharacter("default");
      }
    }
  }

  const confirmChar = () =>{
    if(character){
      const updateData = {
        character: character
      };
      localStorage.setItem("character", JSON.stringify(updateData));
    }
  }

  const handleAuthentication = async (e) =>{
    //e.preventDefault();
    // GOOGLE AUTHENTIFICATION WITH POPUP
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      const { user, credentials } = result;
      console.log(user);
      if (!user){
        throw new Error('Issue Authorising');
      }

    // REGISTER USER INFORMATION FROM GOOGLE IN LOCALSTORAGE (UID, USERNAME, EMAIL)
      const uid = user.uid;
      const updateData = {
        uid: uid,
        username: user.displayName,
        email: user.email,
      };
      setUserStorage(updateData);
      localStorage.setItem("user", JSON.stringify(updateData));
      
    // CHECK IF USER IS IN USER COLLECTION ELSE REGISTER THE USER IN THE COLLECTION
      if(usersCollection){
      const listUid = [];
        try {
        // LOOP THROUGH THE COLLECTION AND PUSH ALL USERS IN listUid ARRAY
          for(let i = 0; i < usersCollection.length; i++){
          console.log(usersCollection[i].uid);
          listUid.push(usersCollection[i].uid);
          }
        // COMPARE IF USER UID IS IN THE LIST ELSE CREATE THE USER
          if(listUid.includes(user.uid) === true){
            console.log("user already in Database");
          }
          else{
            console.log("create User");
            await usersRef.doc(`${uid}`).set({
              uid: user.uid,
              name: user.displayName,
              email: user.email,
            });
          }
        } catch (error) {
          console.error(error.message);
        }
      }else{
        console.log("no usersCollection");
      }
    
    // CHECK IF USER IS IN SQUARES COLLECTION ELSE REGISTER USER
      if(squaresCollection){
        const listUid = [];
          try {
          // LOOP THROUGH THE COLLECTION AND PUSH ALL USERS IN listuid ARRAY
            for(let i = 0; i < squaresCollection.length; i++){
            console.log(squaresCollection[i].uid);
            listUid.push(squaresCollection[i].uid);
          }
          // COMPARE IF USER UID IS IN THE COLLECTION ELSE CREATE THE USER
            if(listUid.includes(user.uid) === true){
              console.log("user already in Database");
            }
            else{
              console.log("create User");
              await squaresRef.doc(`${uid}`).set({
                uid: user.uid
              });
            }
          } catch (error) {
            console.error(error.message);
          }
        }else{
          console.log("no squaresCollection");
        }

    // CHECK IF USER IS IN ONLINE-USERS COLLECTION ELSE REGISTER THE USER AS ONLINE
      if(onlineUsersCollection){
        const listUid = [];
          try {
          // LOOP THROUGH ONLINE-USERS COLLECTION AND PUSH ALL USERS IN listUid ARRAY
            for(let i = 0; i < onlineUsersCollection.length; i++){
            console.log(onlineUsersCollection[i].uid);
            listUid.push(onlineUsersCollection[i].uid);
          }
          // COMPARE IF USER UID IS IN THE COLLECTION ELSE CREATE USER
            if(listUid.includes(user.uid) === true ){
              console.log("user already in Database");
            }else{
              console.log("create onlineUser");
              await onlineUsersRef.doc(`${uid}`).set({
                uid: user.uid,
                name: user.displayName,
                email: user.email,
              });
            }
          } catch (error) {
          console.error(error.message);
          }
      }else{
        console.log("no OnlineUsersCollection");
      }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  
  // Unsubscribe Function to delete user from USERS COLLECTION, ONLINE-USERS COLLECTION, SQUARES COLLECTION && USERSQUARE COLLECTIONs
  const DeleteUser = async () =>{
    setOpenDialog(false);
    if(userStorage){
      if(squareListCollection){
        console.log(squareListCollection.length);
        for(let i = 0; i < squareListCollection.length; i++){
          const squareUid = userStorage.uid + (i+1);
          console.log(squareUid);
          await squaresRef.doc(userStorage.uid).collection('square').doc(squareUid).delete();
        }
      }
      await squaresRef.doc(userStorage.uid).delete();
      await usersRef.doc(userStorage.uid).delete();
      await onlineUsersRef.doc(userStorage.uid).delete();
      setUserStorage();
      localStorage.removeItem("user");
    }else{
      console.log("something whent wrong")
    }
  }

  // Logout handler
  const handleLogOut = async () =>{
    await onlineUsersRef.doc(userStorage.uid).delete();
    await firebase.auth().signOut();
    setUserStorage();
    localStorage.removeItem("user");
    localStorage.removeItem("edit");
    localStorage.removeItem("visit");
    localStorage.removeItem("character");
  }

  const keyControl = (event) =>{
    console.log(event);
    if(!event.repeat){
      switch(event.key){
        case "ArrowUp":
            if(direction){
              setDirection("upDirection");
            }
            break;
        case "ArrowDown":
            if(direction){
              setDirection("downDirection");
            }
            break;
        case "ArrowLeft":
            if(direction){
              setDirection("leftDirection");
            }
            break;
        case "ArrowRight":
            if(direction){
              setDirection("rightDirection");
            }
            break;
        default:
      }
    }
  }
  
  
  useEffect(()=>{
      window.addEventListener('keydown', keyControl);
    return () => window.removeEventListener('keydown', keyControl);
    
  }, [ keyControl ]);

  // useEffect to get localStorage from user in case of refresh
  useEffect(()=>{
    const local = JSON.parse(localStorage.getItem("user"));
    const characterLocal = JSON.parse(localStorage.getItem("character"));
    console.log(local);
    setUserStorage(local);
    if(!characterLocal){
      setCharacter("default");
    }else{
      setCharacter(characterLocal.character);
    }
  }, []);


  useEffect(() => {
    if (userStorage) {
      console.log(userStorage);
      const squareListRef = firestore.collection('squares').doc(userStorage.uid).collection('square');
      const squareListQuery = squareListRef.orderBy('name');
      setSquareListQuery(squareListQuery);
      }
  }, [userStorage]);

    return(
        <>
        <div className="squareAppTitle" style={{width: "100%", padding: "1%", backgroundColor: "RGBA(0,196,255,0.50)"}}>
                <SquaryLife/>
                <p>{usersCollection && (
                        usersCollection.length < 2 && (
                        `${usersCollection.length} user subscribed`
                        )
                      ||
                        usersCollection.length > 1 && (
                        `${usersCollection.length} users subscribed`
                      )
                    )}
                    , Online users: {onlineUsersCollection && onlineUsersCollection.length}</p>
              </div>
              <div className="userScreen" style={{
                                                  position: "relative",
                                                   height: "90%",
                                                    width: "100%",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    backgroundColor: "white",
                                                     alignItems: "center",
                                                    justifyContent: "center"
                                                  }}>
                {userStorage && (
                  <div className="userPanel">
                      <div className="userInfoPanel" style={{
                                                              position: "relative",
                                                              width: "100%",
                                                              height: "100%",
                                                              display: "flex",
                                                              borderRadius: "1%",
                                                              flexDirection: "column"
                                                              }}>
                        <div className="UserLog" style={{position: "relative", textAlign: "center", width: "100%", height: "50%", display: "flex", flexDirection: "column", backgroundColor: "RGBA(0,196,255,0.50)"}}>
                          <h2 style={{margin: "1% 0%", color: "white"}}>Log Square</h2>
                          <p>{userStorage  && (`Welcome ${userStorage.username}`)}</p>
                          <p>{userStorage  && (`Square_id: ${userStorage.uid}`)}</p>
                          <div className="avatarPreview" style={{position: "relative", width: "10%", margin: "auto", marginTop: "1%",marginBottom: "1%", paddingBottom: "10%", backgroundColor: "white", boxShadow: "1px 0px 3px 1px rgba(0,0,0,0.50)"}}>
                              <div style={{position: "absolute", height: "100%", width: "100%", margin: "0", display: "flex"}} onClick={()=>switchChar()}>
                                  {direction === "upDirection" && 
                                        (
                                        character === "default" && (<MainCharUp/>) || character === "girlChar" && (<GirlCharUp/>)
                                        ) 
                                        || 
                                      direction === "downDirection" && 
                                        (
                                        character === "default" && (<MainChar/>) || character === "girlChar" && (<GirlChar/>)
                                        )
                                        || 
                                      direction === "leftDirection" && 
                                      (
                                        character === "default" && (<MainCharLeft/>) || character === "girlChar" && (<GirlCharLeft/>)
                                      ) 
                                      || 
                                      direction === "rightDirection" && 
                                      (
                                        character === "default" && (<MainCharRight/>) || character === "girlChar" && (<GirlCharRight/>)
                                      ) 
                                      || 
                                      (
                                        character === "default" && (<MainChar/>) || character === "girlChar" && (<GirlChar/>)
                                      )
                                    }
                              </div>
                          </div>
                          <div className="userAddFriendButton" style={{
                                                                        position: "relative", 
                                                                        textAlign: "center", 
                                                                        width: "100%", 
                                                                        display: "flex", 
                                                                        alignItems: "center", 
                                                                        justifyContent: "space-evenly",
                                                                        margin: "1% 0% 0% 0%"}}>
                            <Button variant="contained" style={{backgroundColor: "orange"}} onClick={()=>confirmChar()} ><p>Confirm Avatar</p></Button>
                          </div>
                          <div className="userDeleteButton" style={{
                                                                    position: "relative",
                                                                    textAlign: "center", 
                                                                    width: "100%", 
                                                                    display: "flex", 
                                                                    alignItems: "center", 
                                                                    justifyContent: "space-evenly",
                                                                    margin: "1% 0% 0% 0%"}}>
                            <Button variant="contained" color="secondary" onClick={()=>handleOpenDialog()}><p>Delete User</p></Button>
                            <Dialog
                              open={openDialog}
                              onClose={handleCloseDialog}
                              aria-labelledby="alert-dialog-title"
                              aria-describedby="alert-dialog-description"
                            >
                              <DialogTitle id="alert-dialog-title">{"Delete Account?"}</DialogTitle>
                              <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                  Are you sure you want to delete your account and all your informations?
                                </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={()=>DeleteUser()} color="primary" autoFocus>
                                  <p>Agree</p>
                                </Button>
                                <Button onClick={handleCloseDialog} color="secondary">
                                  <p>Disagree</p>
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </div>
                        </div>
                        {userStorage &&(<SquareList uid={userStorage.uid} />)}
                      </div>
                  </div>
                )}
              </div>
              
              <div style={{position: "relative", textAlign: "center", height: "10%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "RGBA(0,196,255,0.50)"}}>
                
                {userStorage && (<Button variant="contained" color="secondary" onClick={()=>handleLogOut()} ><p>Logout</p></Button>)
                ||
                (<Button variant="contained" color="primary" onClick={(e)=>handleAuthentication(e)} ><p>Login</p></Button>)}
              </div>
        </>
    )

}

export default Start;