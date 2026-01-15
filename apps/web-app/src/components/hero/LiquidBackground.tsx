'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';

function LiquidSphere() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Subtle rotation
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <Sphere args={[1, 64, 64]} scale={2.4} ref={meshRef}>
                <MeshDistortMaterial
                    color="#D4AF37" // Gold
                    attach="material"
                    distort={0.4} // Strength of distortion
                    speed={2} // Speed of distortion
                    roughness={0.2}
                    metalness={1}
                    bumpScale={0.005}
                />
            </Sphere>
        </Float>
    );
}

export default function LiquidGoldBackground() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full overflow-hidden opacity-10 mix-blend-multiply pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={2} />
                <directionalLight position={[10, 10, 5]} intensity={3} color="#D4AF37" />
                <pointLight position={[-10, -10, -5]} intensity={1.2} color="#FFFFFF" />
                <LiquidSphere />
            </Canvas>
        </div>
    );
}
