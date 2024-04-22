import * as THREE from 'three';
import {useLoader} from "@react-three/fiber";
import {TextureLoader} from "three";
import BellMesh from "./interactableMap/Emergency";
import {Player} from "./PlayerManager";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
}

export default function Map({lobbyId, myPlayerId, myPlayer}: Props){

    const texture = useLoader(TextureLoader, 'src/Images/newMap.png');
    return (
        <group>
            <mesh position={new THREE.Vector3(0, 0, 0)}>
                <boxGeometry args={[9, 5, 0.1]}/>
                <meshBasicMaterial map={texture}/>
            </mesh>
            <BellMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer}/>
        </group>
    )
}