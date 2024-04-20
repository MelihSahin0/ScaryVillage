import * as THREE from 'three';
import {useLoader} from "@react-three/fiber";
import {TextureLoader} from "three";
import BellMesh from "./interactableMap/emergency";

type Props = {
    lobbyId: string;
    myPlayerId: string;
}

export default function Map({lobbyId, myPlayerId}: Props){

    const texture = useLoader(TextureLoader, 'src/Images/newMap.png');
    return (
        <group>
            <mesh position={new THREE.Vector3(0, 0, 0)}>
                <boxGeometry args={[9, 5, 0.1]}/>
                <meshBasicMaterial map={texture}/>
            </mesh>
            <BellMesh lobbyId={lobbyId} myPlayerId={myPlayerId}/>
        </group>
    )
}