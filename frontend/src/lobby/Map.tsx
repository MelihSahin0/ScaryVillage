import {Canvas} from "@react-three/fiber";
import {OrthographicCamera} from "@react-three/drei";
import React from "react";
import * as THREE from "three";

export default function Map(){

    return (
        <mesh position={new THREE.Vector3(0, 0, 0)}>
            <boxGeometry args={[5, 5, 0.1]}/>
            <meshBasicMaterial color="white"/>
        </mesh>
    )
}