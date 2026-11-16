import React, { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

// Preload the model for faster rendering
useGLTF.preload("/robot.glb");

function RobotScene({ currentAnim, onAnimationsLoaded }: { currentAnim: string, onAnimationsLoaded: (names: string[]) => void }) {
    const group = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF("/robot.glb");
    const { actions } = useAnimations(animations, group);

    // Report available animations to parent
    useEffect(() => {
        if (actions) {
            const animNames = Object.keys(actions);
            onAnimationsLoaded(animNames);
        }
    }, [actions, onAnimationsLoaded]);

    // Handle animation switching
    useEffect(() => {
        if (actions && currentAnim && actions[currentAnim]) {
            // Fade out all other animations
            Object.values(actions).forEach(action => action?.fadeOut(0.5));
            // Fade in and play the requested one
            actions[currentAnim]?.reset().fadeIn(0.5).play();
        }
    }, [actions, currentAnim]);

    return (
        <group ref={group} dispose={null}>
            <primitive object={scene} scale={1.5} position={[0, -2.5, 0]} />
        </group>
    );
}

export default function RobotModel() {
    const [animNames, setAnimNames] = useState<string[]>([]);
    const [currentAnim, setCurrentAnim] = useState<string>("");

    // Automatically pick the first animation when loaded if none is selected
    const handleAnimationsLoaded = (names: string[]) => {
        setAnimNames(names);
        if (!currentAnim && names.length > 0) {
            // Prefer idle, walk, or fly if available
            const preferred = names.find(n => n.toLowerCase().includes('idle')) ||
                names.find(n => n.toLowerCase().includes('fly')) ||
                names.find(n => n.toLowerCase().includes('walk')) ||
                names[0];
            setCurrentAnim(preferred);
        }
    };

    return (
        <div className="w-full h-[600px] md:h-[800px] xl:h-[900px] relative">

            {/* Interactive Control Panel */}
            {animNames.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-wrap justify-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-200">
                    {animNames.map(name => (
                        <button
                            key={name}
                            onClick={() => setCurrentAnim(name)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${currentAnim === name
                                ? 'bg-indigo-600 text-white'
                                : 'bg-transparent text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {name.replace(/_/g, ' ')}
                        </button>
                    ))}
                </div>
            )}

            <div className="w-full h-full cursor-grab active:cursor-grabbing">
                <Canvas
                    camera={{ position: [0, 1, 10], fov: 45 }}
                >
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                    <directionalLight position={[-10, 5, -5]} intensity={0.5} />

                    {/* 
                      OrbitControls allows the user to rotate the model.
                    */}
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        minPolarAngle={Math.PI / 3}
                        maxPolarAngle={Math.PI / 2}
                    />

                    <RobotScene
                        currentAnim={currentAnim}
                        onAnimationsLoaded={handleAnimationsLoaded}
                    />

                </Canvas>
            </div>
        </div>
    );
}
