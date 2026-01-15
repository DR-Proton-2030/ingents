"use client";
import React, { Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Stars, Sparkles, Cloud, Float, Sky } from '@react-three/drei';
import * as THREE from 'three';

interface SimulationBackgroundProps {
    environment: 'forest' | 'home' | 'space' | 'cyber' | 'ocean';
    cameraOffset?: { x: number, y: number };
}

const CameraParallax: React.FC<{ offset?: { x: number, y: number } }> = ({ offset }) => {
    const { camera, mouse } = useThree();
    useFrame(() => {
        // Use camera tracking offset if available, otherwise fallback to mouse
        const targetX = offset ? offset.x * 3 : mouse.x * 1.5;
        const targetY = offset ? offset.y * 2 : mouse.y * 1.0;

        // Smoothly interpolate camera position
        camera.position.x += (targetX - camera.position.x) * 0.1;
        camera.position.y += (targetY - camera.position.y) * 0.1;
        camera.lookAt(0, 0, 0);
    });
    return null;
};

const ForestScene = () => {
    const trees = React.useMemo(() => {
        return [...Array(30)].map((_, i) => {
            const x = (Math.random() - 0.5) * 40;
            const z = (Math.random() - 0.5) * 40 - 5;
            const height = 4 + Math.random() * 6;
            const shouldRender = Math.abs(x) >= 3 || Math.abs(z) >= 3;
            return { x, z, height, shouldRender, id: i };
        });
    }, []);

    return (
        <>
            <color attach="background" args={['#051105']} />
            <fog attach="fog" args={['#051505', 0, 25]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[-5, 10, -5]} intensity={0.8} color="#aaddaa" />

            <Environment preset="park" />

            <Sparkles count={400} scale={15} size={4} speed={0.4} opacity={0.8} color="#aaffaa" />

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#0a220a" roughness={1} />
            </mesh>

            <group>
                {trees.map((tree) => {
                    if (!tree.shouldRender) return null;
                    return (
                        <group key={tree.id} position={[tree.x, -2, tree.z]}>
                            <mesh position={[0, tree.height / 2, 0]}>
                                <cylinderGeometry args={[0.1, 0.3, tree.height]} />
                                <meshStandardMaterial color="#3d2c1d" />
                            </mesh>
                            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                                <mesh position={[0, tree.height, 0]}>
                                    <coneGeometry args={[1.5, 3, 6]} />
                                    <meshStandardMaterial color="#0a3d0a" />
                                </mesh>
                            </Float>
                        </group>
                    )
                })}
            </group>

            <Cloud opacity={0.3} speed={0.1} segments={20} position={[0, 8, -10]} />
        </>
    );
};

const HomeScene = () => (
    <>
        <Environment preset="city" background />
        <ambientLight intensity={0.8} />
        <pointLight position={[0, 3, 0]} intensity={0.5} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#554433" roughness={0.2} metalness={0.1} />
        </mesh>
        <gridHelper args={[20, 20, 0x000000, 0x332211]} position={[0, -1.99, 0]} />

        <group position={[0, 3, 0]}>
            <mesh position={[0, 0, -10]}>
                <boxGeometry args={[20, 10, 0.5]} />
                <meshStandardMaterial color="#dddddd" />
            </mesh>
            <mesh position={[-10, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[20, 10, 0.5]} />
                <meshStandardMaterial color="#cccccc" />
            </mesh>
            <mesh position={[10, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[20, 10, 0.5]} />
                <meshStandardMaterial color="#cccccc" />
            </mesh>
            <mesh position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <boxGeometry args={[20, 20, 0.5]} />
                <meshStandardMaterial color="#eeeeee" />
            </mesh>
        </group>

        <mesh position={[0, -1.5, -5]}>
            <boxGeometry args={[3, 1, 1]} />
            <meshStandardMaterial color="#222" />
        </mesh>
    </>
);

const SpaceScene = () => (
    <>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#aaaaff" />

        <Stars radius={100} depth={50} count={7000} factor={4} saturation={1} fade speed={1} />
        <Sparkles count={500} scale={12} size={2} speed={0.2} opacity={0.5} color="#8888ff" />

        <mesh position={[15, 5, -20]}>
            <sphereGeometry args={[5, 32, 32]} />
            <meshStandardMaterial color="#4422aa" roughness={0.7} emissive="#110033" />
        </mesh>

        <gridHelper args={[60, 20, 0x444444, 0x111111]} position={[0, -5, 0]} />
    </>
);

const CyberScene = () => (
    <>
        <color attach="background" args={['#020205']} />
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 10, 0]} intensity={2} color="#ff00ff" />
        <pointLight position={[10, 0, 10]} intensity={2} color="#00ffff" />

        <Sparkles count={300} scale={20} size={2} speed={0.5} opacity={0.3} color="#ff00ff" />
        <gridHelper args={[100, 50, 0xff00ff, 0x220022]} position={[0, -2, 0]} />

        <group>
            {[...Array(20)].map((_, i) => {
                const x = (Math.random() - 0.5) * 40;
                const z = (Math.random() - 0.5) * 40 - 10;
                const h = 2 + Math.random() * 8;
                return (
                    <mesh key={i} position={[x, h / 2 - 2, z]}>
                        <boxGeometry args={[1, h, 1]} />
                        <meshStandardMaterial color="#111111" emissive={i % 2 === 0 ? "#ff00ff" : "#00ffff"} emissiveIntensity={0.5} />
                    </mesh>
                )
            })}
        </group>
    </>
);

const OceanScene = () => (
    <>
        <Sky sunPosition={[100, 10, -100]} turbidity={0.1} rayleigh={2} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffaa55" />

        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
                <planeGeometry args={[200, 200]} />
                <meshStandardMaterial color="#0077be" roughness={0.1} metalness={0.2} transparent opacity={0.8} />
            </mesh>
        </Float>

        <Sparkles count={200} scale={20} size={5} speed={0.1} opacity={0.4} color="#ffffff" />
    </>
);

const SimulationBackground: React.FC<SimulationBackgroundProps> = ({ environment, cameraOffset }) => {
    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ preserveDrawingBuffer: true }}>
                <Suspense fallback={null}>
                    <CameraParallax offset={cameraOffset} />
                    {environment === 'forest' && <ForestScene />}
                    {environment === 'home' && <HomeScene />}
                    {environment === 'space' && <SpaceScene />}
                    {environment === 'cyber' && <CyberScene />}
                    {environment === 'ocean' && <OceanScene />}
                </Suspense>
            </Canvas>
        </div>
    );
};

export default SimulationBackground;
