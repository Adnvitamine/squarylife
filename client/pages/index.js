import { useState, useEffect } from "react";
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Start from './start';

// provider .addScope

export default function Home() {
  const maxTiles = 25;
  const [tilesArray, setTilesArray] = useState([]);
  
  
  
  useEffect(()=>{
    const array = [];
    for( let i = 1; i <= maxTiles; i++){
        array.push(i)
    }
    setTilesArray(array);
  }, [maxTiles]);

  

  return (
    <div className={styles.container}>
      <Head>
        <title>SquaryLife</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className="screenWrapper" style={{position: "relative",height: "100vh",width: "100%", margin: "auto", display: "flex", backgroundColor: "black"}}>
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
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
