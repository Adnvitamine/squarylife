import {useState, useEffect} from "react";

import MoveUp, {MoveUpTwo, MoveUpThree, MoveUpFour, MoveUpFive, MoveUpSix, MoveUpSeven, MoveUpEight, } from "./animation/moveUp";
import MoveDown, {MoveDownTwo, MoveDownThree, MoveDownFour, MoveDownFive, MoveDownSix, MoveDownSeven, MoveDownEight, } from "./animation/moveDown";
import MoveLeft, {MoveLeftTwo, MoveLeftThree, MoveLeftFour, MoveLeftFive, MoveLeftSix, MoveLeftSeven, MoveLeftEight, } from "./animation/moveLeft";
import MoveRight, {MoveRightTwo, MoveRightThree, MoveRightFour, MoveRightFive, MoveRightSix, MoveRightSeven, MoveRightEight, } from "./animation/moveRight";

const MainCharAnimation = ({foot, direction}) => {
    
    const [animation, setAnimation] = useState(1);

    useEffect(()=>{
        if(direction){
            //console.log(direction);
            //console.log(foot);
            switch(direction){
                case "upDirection": 
                    if(foot){
                        switch(foot){
                            case "right":
                                if(animation === 1){
                                    setTimeout(()=>{
                                        setAnimation(2);
                                    }, 60);
                                    setTimeout(()=>{
                                        setAnimation(3);
                                    }, 120);
                                    setTimeout(()=>{
                                        setAnimation(4);
                                    }, 180);
                                    setTimeout(()=>{
                                        setAnimation(5);
                                    }, 240);
                                    setTimeout(()=>{
                                        setAnimation(6);
                                    }, 300);
                                    setTimeout(()=>{
                                        setAnimation(7);
                                    }, 360);
                                    setTimeout(()=>{
                                        setAnimation(8);
                                    }, 420);
                                    setTimeout(()=>{
                                        setAnimation(5);
                                    }, 550);
                                }
                                break;
                            case "left":
                                if(animation === 1){
                                    setTimeout(()=>{
                                        setAnimation(8);
                                    }, 60);
                                    setTimeout(()=>{
                                        setAnimation(7);
                                    }, 120);
                                    setTimeout(()=>{
                                        setAnimation(6);
                                    }, 180);
                                    setTimeout(()=>{
                                        setAnimation(5);
                                    }, 240);
                                    setTimeout(()=>{
                                        setAnimation(4);
                                    }, 300);
                                    setTimeout(()=>{
                                        setAnimation(3);
                                    }, 360);
                                    setTimeout(()=>{
                                        setAnimation(2);
                                    }, 420);
                                    setTimeout(()=>{
                                        setAnimation(5);
                                    }, 550);
                                }
                                break;
                        }
                    }
                    break;
                case "downDirection": 
                    if(foot){
                        switch(foot){
                            case "right":
                                if(animation === 1){
                                    setTimeout(()=>{
                                        setAnimation(2);
                                    }, 60);
                                    setTimeout(()=>{
                                        setAnimation(3);
                                    }, 120);
                                    setTimeout(()=>{
                                        setAnimation(4);
                                    }, 180);
                                    setTimeout(()=>{
                                        setAnimation(5);
                                    }, 240);
                                    setTimeout(()=>{
                                        setAnimation(6);
                                    }, 300);
                                    setTimeout(()=>{
                                        setAnimation(7);
                                    }, 360);
                                    setTimeout(()=>{
                                        setAnimation(8);
                                    }, 420);
                                    setTimeout(()=>{
                                        setAnimation(5);
                                    }, 550);
                                }
                                break;
                            case "left":
                                if(animation === 1){
                                    setTimeout(()=>{
                                        setAnimation(8);
                                    }, 60);
                                    setTimeout(()=>{
                                        setAnimation(7);
                                    }, 120);
                                    setTimeout(()=>{
                                        setAnimation(6);
                                    }, 180);
                                    setTimeout(()=>{
                                        setAnimation(5);
                                    }, 240);
                                    setTimeout(()=>{
                                        setAnimation(4);
                                    }, 300);
                                    setTimeout(()=>{
                                        setAnimation(3);
                                    }, 360);
                                    setTimeout(()=>{
                                        setAnimation(2);
                                    }, 420);
                                    setTimeout(()=>{
                                        setAnimation(5);
                                    }, 550);
                                }
                                break;
                        }
                    }
                    break;
                case "leftDirection": 
                    if(foot){
                        switch(foot){
                            case "right":
                                if(animation === 1){
                                    setTimeout(()=>{
                                        setAnimation(2);
                                    }, 60);
                                    setTimeout(()=>{
                                        setAnimation(3);
                                    }, 120);
                                    setTimeout(()=>{
                                        setAnimation(4);
                                    }, 180);
                                    setTimeout(()=>{
                                        setAnimation(5);
                                    }, 240);
                                    setTimeout(()=>{
                                        setAnimation(6);
                                    }, 300);
                                    setTimeout(()=>{
                                        setAnimation(7);
                                    }, 360);
                                    setTimeout(()=>{
                                        setAnimation(8);
                                    }, 420);
                                    setTimeout(()=>{
                                        setAnimation(5);
                                    }, 550);
                                }
                                break;
                            case "left":
                                if(animation === 1){
                                    setTimeout(()=>{
                                        setAnimation(6);
                                    }, 60);
                                    setTimeout(()=>{
                                        setAnimation(5);
                                    }, 120);
                                    setTimeout(()=>{
                                        setAnimation(4);
                                    }, 180);
                                    setTimeout(()=>{
                                        setAnimation(3);
                                    }, 240);
                                    setTimeout(()=>{
                                        setAnimation(2);
                                    }, 300);
                                    setTimeout(()=>{
                                        setAnimation(8);
                                    }, 360);
                                    setTimeout(()=>{
                                        setAnimation(7);
                                    }, 420);
                                    setTimeout(()=>{
                                        setAnimation(6);
                                    }, 550);
                                }
                                break;
                        }
                    }
                    break;
                case "rightDirection":  
                    if(foot){
                        switch(foot){
                            case "right":
                                if(animation === 1){
                                    setTimeout(()=>{
                                        setAnimation(2);
                                    }, 60);
                                    setTimeout(()=>{
                                        setAnimation(3);
                                    }, 120);
                                    setTimeout(()=>{
                                        setAnimation(4);
                                    }, 180);
                                    setTimeout(()=>{
                                        setAnimation(5);
                                    }, 240);
                                    setTimeout(()=>{
                                        setAnimation(6);
                                    }, 300);
                                    setTimeout(()=>{
                                        setAnimation(7);
                                    }, 360);
                                    setTimeout(()=>{
                                        setAnimation(8);
                                    }, 420);
                                    setTimeout(()=>{
                                        setAnimation(5);
                                    }, 550);
                                }
                                break;
                            case "left":
                                if(animation === 1){
                                    setTimeout(()=>{
                                        setAnimation(3);
                                    }, 60);
                                    setTimeout(()=>{
                                        setAnimation(4);
                                    }, 120);
                                    setTimeout(()=>{
                                        setAnimation(5);
                                    }, 180);
                                    setTimeout(()=>{
                                        setAnimation(6);
                                    }, 240);
                                    setTimeout(()=>{
                                        setAnimation(7);
                                    }, 300);
                                    setTimeout(()=>{
                                        setAnimation(8);
                                    }, 360);
                                    setTimeout(()=>{
                                        setAnimation(2);
                                    }, 420);
                                    setTimeout(()=>{
                                        setAnimation(3);
                                    }, 550);
                                }
                                break;
                        }
                    }
                    break;
            }
        }
    }, [direction, foot, animation]);



    return(
        <>
        {direction && direction === "upDirection" && (
            animation && 
            (
                animation === 1 && 
                (
                    <MoveUp/>
                )
                ||
                animation === 2 &&  
                (
                    <MoveUpTwo/>
                )
                ||
                animation === 3 &&  
                (
                    <MoveUpThree/>
                )
                ||
                animation === 4 &&  
                (
                    <MoveUpFour/>
                )
                ||
                animation === 5 &&  
                (
                    <MoveUpFive/>
                )
                ||
                animation === 6 &&  
                (
                    <MoveUpSix/>
                )
                ||
                animation === 7 &&  
                (
                    <MoveUpSeven/>
                )
                ||
                animation === 8 &&  
                (
                    <MoveUpEight/>
                )     
            )
        )
        || direction === "downDirection" && (
            animation && 
            (
                animation === 1 && 
                (
                    <MoveDown/>
                )
                ||
                animation === 2 &&  
                (
                    <MoveDownTwo/>
                )
                ||
                animation === 3 &&  
                (
                    <MoveDownThree/>
                )
                ||
                animation === 4 &&  
                (
                    <MoveDownFour/>
                )
                ||
                animation === 5 &&  
                (
                    <MoveDownFive/>
                )
                ||
                animation === 6 &&  
                (
                    <MoveDownSix/>
                )
                ||
                animation === 7 &&  
                (
                    <MoveDownSeven/>
                )
                ||
                animation === 8 &&  
                (
                    <MoveDownEight/>
                )     
            )
            
        )
        || direction === "leftDirection" && (
            animation && 
            (
                animation === 1 && 
                (
                    <MoveLeft/>
                )
                ||
                animation === 2 &&  
                (
                    <MoveLeftTwo/>
                )
                ||
                animation === 3 &&  
                (
                    <MoveLeftThree/>
                )
                ||
                animation === 4 &&  
                (
                    <MoveLeftFour/>
                )
                ||
                animation === 5 &&  
                (
                    <MoveLeftFive/>
                )
                ||
                animation === 6 &&  
                (
                    <MoveLeftSix/>
                )
                ||
                animation === 7 &&  
                (
                    <MoveLeftSeven/>
                )
                ||
                animation === 8 &&  
                (
                    <MoveLeftEight/>
                )     
            )
            
        )
        || direction === "rightDirection" && (
            animation && 
            (
                animation === 1 && 
                (
                    <MoveRight/>
                )
                ||
                animation === 2 &&  
                (
                    <MoveRightTwo/>
                )
                ||
                animation === 3 &&  
                (
                    <MoveRightThree/>
                )
                ||
                animation === 4 &&  
                (
                    <MoveRightFour/>
                )
                ||
                animation === 5 &&  
                (
                    <MoveRightFive/>
                )
                ||
                animation === 6 &&  
                (
                    <MoveRightSix/>
                )
                ||
                animation === 7 &&  
                (
                    <MoveRightSeven/>
                )
                ||
                animation === 8 &&  
                (
                    <MoveRightEight/>
                )     
            )
            
        )
        }
        </>
    )
}

export default MainCharAnimation;