import React, {useEffect, useRef} from 'react';
import {Canvas, useFrame, useLoader, useThree} from '@react-three/fiber';
import {Mesh, TextureLoader} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OrthographicCamera} from "@react-three/drei";

export default function App() {
  return (
      <div id="canvas-container">
        <Canvas style={{ background: 'black', height: '97vh' }}>
          <ambientLight/>
          <pointLight position={[10, 10, 10]} />
            <Box/>
            <ImagePlane/>
            <Modell3D/>
            <OrthographicCamera position={[0,0,10]} makeDefault zoom={30} />
        </Canvas>
      </div>
  );
}

function Box(){
    const meshRef = useRef<Mesh>();

    useFrame(() => {

        if (meshRef.current) {
            meshRef.current.position.x += 0.01;
        }
    });

    return<mesh ref={meshRef}>
        <boxGeometry/>
        <meshStandardMaterial color="orange" />
    </mesh>
}

function Modell3D(){
    const gltf = useLoader(GLTFLoader, 'src/Dwarf.glb');
    const modelRef = useRef<Mesh>();

    useFrame(() => {

        if (modelRef.current) {
            modelRef.current.position.x -= 0.01;

            modelRef.current.rotation.y = Math.PI / 2;
        }
    });
    return <primitive object={gltf.scene} ref={modelRef} />;
}

function useKeyboard() {
    const keyMap = useRef({})

    useEffect(() => {
        const onDocumentKey = (e) => {
            keyMap.current[e.code] = e.type === 'keydown'
        }
        document.addEventListener('keydown', onDocumentKey)
        document.addEventListener('keyup', onDocumentKey)
        return () => {
            document.removeEventListener('keydown', onDocumentKey)
            document.removeEventListener('keyup', onDocumentKey)
        }
    }, [])

    return keyMap.current
}

function ImagePlane() {
    const texture = useLoader(TextureLoader, 'src/Purple.jpg');
    const imageRef = useRef<Mesh>();

    const keyMap = useKeyboard()

    useFrame((_, delta) => {
        keyMap['KeyA'] && (imageRef.current.position.x -= delta)
        keyMap['KeyD'] && (imageRef.current.position.x += delta)
        keyMap['KeyW'] && (imageRef.current.position.y += delta)
        keyMap['KeyS'] && (imageRef.current.position.y -= delta)
    })

    return (
        <mesh ref={imageRef}>
            <planeGeometry args={[5, 5]} />
            <meshBasicMaterial map={texture} />
        </mesh>
    );
}

function CameraMovement() {
    const {camera} = useThree();

    React.useLayoutEffect(() => {
        camera.rotation.order = 'YXZ'
        camera.rotation.y = -Math.PI / 4
        camera.rotation.x = Math.atan(-1 / Math.sqrt(2))
        camera.translateZ(100)
    }, [camera]);

    // Move the camera
    useFrame(() => {
        if (camera && camera.position) { // Ensure camera and camera.position are not null
            camera.position.x += 0;
        }
    });

    return null;
}