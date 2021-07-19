import { useState, useEffect } from "react";
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Start from './start';

// provider .addScope

export default function Home() {
  const maxTiles = 25;
  const [tilesArray, setTilesArray] = useState([]);
  const [audio, setAudio] = useState(false);
  
  
  useEffect(()=>{
    const array = [];
    for( let i = 1; i <= maxTiles; i++){
        array.push(i)
    }
    setTilesArray(array);
  }, [maxTiles]);

  const playAudio = (e) =>{
    
    if(e.target !== e.currentTarget){
        return;
      }else{
        if(audio === false){
          setAudio(true);
            const audio = document.getElementById('a1');
              audio.play();
        }else if(audio === true){
          setAudio(false);
          const audio = document.getElementById('a1');
          audio.pause();
        }    
      }
    
  }

  

  return (
    <div className={styles.container}>
      <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <title>SquaryLife</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <audio id='a1' src='/song2.mp3'></audio>
        <div className="screenWrapper" style={{position: "relative",height: "100vh",width: "100%", margin: "auto", display: "flex", backgroundColor: "black"}} onClick={(e)=>playAudio(e)} >
          <div className={styles.screen} style={{ position: "relative", display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100vh", margin: "auto"}}>
        
            <div className="startScreen" style={{ position: "absolute", margin: "0", display: "flex", width: "100%", height: "100%", zIndex: "10", flexDirection:"column", alignItems: "center", border: "1px solid black", textAlign: "center"}}>
              <Start/>
              </div>

            {tilesArray.map((tiles, index)=>(
            <div key={tiles} style={{position: "relative", minWidth: "20%", paddingBottom: "20%", backgroundColor: "white"}}>
               
            </div>
            ))}
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
