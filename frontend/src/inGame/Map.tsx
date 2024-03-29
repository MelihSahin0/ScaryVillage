import * as THREE from 'three';

export default function Map(){

    return (
        <>
            <mesh position={new THREE.Vector3(-5, -5, 0)}>
                <boxGeometry args={[5, 5, 0.1]}/>
                <meshBasicMaterial color="white"/>
            </mesh>
            <mesh position={new THREE.Vector3(0, -5, 0)}>
                <boxGeometry args={[5, 5, 0.1]}/>
                <meshBasicMaterial color="black"/>
            </mesh>
            <mesh position={new THREE.Vector3(5, -5, 0)}>
                <boxGeometry args={[5, 5, 0.1]}/>
                <meshBasicMaterial color="white"/>
            </mesh>
            <mesh position={new THREE.Vector3(-5, 0, 0)}>
                <boxGeometry args={[5, 5, 0.1]}/>
                <meshBasicMaterial color="black"/>
            </mesh>
            <mesh position={new THREE.Vector3(0, 0, 0)}>
                <boxGeometry args={[5, 5, 0.1]}/>
                <meshBasicMaterial color="white"/>
            </mesh>
            <mesh position={new THREE.Vector3(5, 0, 0)}>
                <boxGeometry args={[5, 5, 0.1]}/>
                <meshBasicMaterial color="black"/>
            </mesh>
            <mesh position={new THREE.Vector3(-5, 5, 0)}>
                <boxGeometry args={[5, 5, 0.1]}/>
                <meshBasicMaterial color="white"/>
            </mesh>
            <mesh position={new THREE.Vector3(0, 5, 0)}>
                <boxGeometry args={[5, 5, 0.1]}/>
                <meshBasicMaterial color="black"/>
            </mesh>
            <mesh position={new THREE.Vector3(5, 5, 0)}>
                <boxGeometry args={[5, 5, 0.1]}/>
                <meshBasicMaterial color="white"/>
            </mesh>
        </>
    )
}