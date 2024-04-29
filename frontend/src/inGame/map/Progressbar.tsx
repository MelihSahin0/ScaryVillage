import {Player} from "../PlayerManager";
import React, {useEffect, useState} from "react";
import * as THREE from "three";

type Props = {
    progress: number
    myPlayer: Player | undefined
}

export default function Progressbar({progress, myPlayer}: Props){
    const [x, setX] = useState<number>(0)
    const [y, setY] = useState<number>(0)
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    useEffect(() => {
        setX((myPlayer ? myPlayer.x  : 0) - (windowSize.width / 1010 - progress/4));
        setY((myPlayer ? myPlayer.y  : 0) + windowSize.height / 1100);
    }, [progress, windowSize.height, windowSize.width, myPlayer]);

    return (
        <group>
            <mesh position={[x, y, 1]}>
                <boxGeometry args={[progress / 2, windowSize.height / 8000, 0.1]}/>
                <meshBasicMaterial attach="material" color="green"/>
            </mesh>
            <group>
                <lineSegments position={[(myPlayer ? myPlayer.x  : 0) - (windowSize.width / 1010 - 1/4), y, 1]}>
                    <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1/2, windowSize.height / 8000, 0.1)]}/>
                    <lineBasicMaterial attach="material" color={0x000000}/>
                </lineSegments>
            </group>
        </group>
    );
}
