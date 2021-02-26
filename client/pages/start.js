import { useState, useEffect } from "react";
import {Button} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import initFirebase from "./api/firebase";

//import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import SquareList from "./squares/squareList";
import MainChar from "./sprites/characters/mainCharacter/mainChar";

initFirebase();

//const auth = firebase.auth();
const firestore = firebase.firestore();

const Start = () => {

  //const [userAuth] = useAuthState(auth);
  const [userStorage, setUserStorage] = useState();
  const [open, setOpen] = useState(false);
  // reference for registered users collection in firestore
  const usersRef = firestore.collection('users');
  const usersQuery = usersRef.orderBy('name');
  const [usersCollection] = useCollectionData(usersQuery, {idField: 'id'});

  // reference for online-users in firestore
  const onlineUsersRef = firestore.collection('online-users');
  const onlineUsersQuery = onlineUsersRef.orderBy('name');
  const [onlineUsersCollection] = useCollectionData(onlineUsersQuery, {idField: 'id'});

  // Reference to user squares in firestore
  const squaresRef = firestore.collection('squares');
  const squaresQuery = squaresRef.orderBy('uid');
  const [squaresCollection] = useCollectionData(squaresQuery, {idField: 'id'});
  
  const [squareListQuery, setSquareListQuery] = useState();
  const [squareListCollection] = useCollectionData(squareListQuery, {idField: 'id'});
  

  const handleAuthentication = async (e) =>{
      
      e.preventDefault();
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      const { user, credentials } = result;
      console.log(user);
      const uid = user.uid;
      const updateData = {
        uid: user.uid,
        username: user.displayName,
        email: user.email,
      };
      setUserStorage(updateData);
      localStorage.setItem("user", JSON.stringify(updateData));
      
      if(usersCollection){
      const listUid = [];
      //e.preventDefault();
        try {
        for(let i = 0; i < usersCollection.length; i++){
        console.log(usersCollection[i].uid);
        listUid.push(usersCollection[i].uid);
        }

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

      if(squaresCollection){
        const listUid = [];
        //e.preventDefault();
          try {
          for(let i = 0; i < squaresCollection.length; i++){
          console.log(squaresCollection[i].uid);
          listUid.push(squaresCollection[i].uid);
          }
  
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


      if(onlineUsersCollection){
      const listUid = [];
      //e.preventDefault();
        try {
          
          for(let i = 0; i < onlineUsersCollection.length; i++){
          console.log(onlineUsersCollection[i].uid);
          listUid.push(onlineUsersCollection[i].uid);
          }
          
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

      if (!user){
        throw new Error('Issue Authorising');
      }
  };

 
  
  // Unsubscribe Function to delete user from database and online User and later all squaresInformation
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const DeleteUser = async () =>{
    setOpen(false);

    console.log(squareListCollection.length);
    if(userStorage){
      if(squareListCollection){
        for(let i = 0; i < squareListCollection.length; i++){
          const squareUid = userStorage.uid + (i+1);
          console.log(squareUid);
          
          const deleteUserSquareCollection = await squaresRef.doc(userStorage.uid).collection('square').doc(squareUid).delete();
        }
      }
    
      const deleteUserSquare = await squaresRef.doc(userStorage.uid).delete();
      const deleteUser = await usersRef.doc(userStorage.uid).delete();
      const deleteOnlineUser = await onlineUsersRef.doc(userStorage.uid).delete();
      setUserStorage();
      localStorage.removeItem("user");
    }else{
      console.log("something when wrong")
    }
    /*
    const deleteUserSquare = await squaresRef.doc(userStorage.uid).delete();
    const deleteUser = await usersRef.doc(userStorage.uid).delete();
    const deleteOnlineUser = await onlineUsersRef.doc(userStorage.uid).delete();
    setUserStorage();
    localStorage.removeItem("user");
    */
    
  }

  // Logout handler
  const handleLogOut = async () =>{
    const deleteOnlineUser = await onlineUsersRef.doc(userStorage.uid).delete();
    const logOutGoogle = await firebase.auth().signOut();
    setUserStorage();
    localStorage.removeItem("user");
    localStorage.removeItem("edit");
    // window.location = "";
  }

  // useEffect to get localStorage from user in case of refresh
  useEffect(()=>{
    const local = JSON.parse(localStorage.getItem("user"));
    console.log(local);
    setUserStorage(local);
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
        <div className="squareAppTitle">
                <h1 style={{marginBottom:"0"}}>SquaryLife</h1>
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
                                                    border: "1px solid black",
                                                     alignItems: "center",
                                                    justifyContent: "center"
                                                  }}>
                {userStorage && (
                  <div className="userPanel" style={{
                                                    position: "relative",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    margin: "auto",
                                                    width: "90%",
                                                    height: "90%",
                                                    border: "2px solid black",
                                                    borderRadius: "1%",
                                                    alignItems: "center"}}>
                      <div className="userInfoPanel" style={{
                                                              position: "relative",
                                                              width: "100%",
                                                              height: "100%",
                                                              display: "flex", 
                                                              flexDirection: "column", 
                                                              backgroundColor: "rgba(252, 235, 0, 0.589)"}}>
                        <div className="UserLog" style={{position: "relative", textAlign: "center", width: "100%", height: "50%", display: "flex", flexDirection: "column", border: "1px solid black"}}>
                          <h1 style={{margin: "1% 0%"}}>Log Square</h1>
                          <p>{userStorage  && (`Welcome ${userStorage.username}`)}</p>
                          <p>{userStorage  && (`Square_id: ${userStorage.uid}`)}</p>
                          <div className="avatarPreview" style={{position: "relative", width: "10%", margin: "auto", marginTop: "0",marginBottom: "0", paddingBottom: "10%",border: "1px solid black"}}>
                            <div style={{position: "absolute", height: "100%", width: "100%", margin: "0", display: "flex"}}><MainChar/></div>
                          </div>
                          <div className="userAddFriendButton" style={{
                                                                        position: "relative", 
                                                                        textAlign: "center", 
                                                                        width: "100%", 
                                                                        display: "flex", 
                                                                        alignItems: "center", 
                                                                        justifyContent: "space-evenly",
                                                                        margin: "1% 0% 0% 0%"}}>
                            <Button variant="contained" style={{backgroundColor: "orange"}}>Change Avatar</Button>
                          </div>
                          <div className="userDeleteButton" style={{
                                                                    position: "relative",
                                                                    textAlign: "center", 
                                                                    width: "100%", 
                                                                    display: "flex", 
                                                                    alignItems: "center", 
                                                                    justifyContent: "space-evenly",
                                                                    margin: "1% 0% 0% 0%"}}>
                            <Button variant="contained" color="secondary" onClick={()=>handleClickOpen()}>Delete User</Button>
                            <Dialog
                              open={open}
                              onClose={handleClose}
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
                                  Agree
                                </Button>
                                <Button onClick={handleClose} color="primary">
                                  Disagree
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
              
              <div style={{position: "relative", textAlign: "center", height: "10%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid black"}}>
                
                {userStorage && (<Button variant="contained" color="secondary" onClick={()=>handleLogOut()} >Logout</Button>)
                ||
                (<Button variant="contained" color="primary" onClick={(e)=>handleAuthentication(e)} >Login</Button>)}
              </div>
        </>
    )

}

export default Start;