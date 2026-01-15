'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function LiquidMetal() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();
        // Subtle morphing animation
        meshRef.current.rotation.x = Math.sin(time / 4) * 0.2;
        meshRef.current.rotation.y = Math.sin(time / 2) * 0.2;
        meshRef.current.position.y = Math.sin(time / 2) * 0.1;
    });

    const geometry = useMemo(() => new THREE.TorusKnotGeometry(1, 0.3, 128, 32), []);

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={meshRef} geometry={geometry}>
                <MeshTransmissionMaterial
                    backside
                    samples={4}
                    thickness={2}
                    roughness={0}
                    chromaticAberration={0.2}
                    anisotropy={1}
                    distortion={1}
                    distortionScale={1}
                    temporalDistortion={0.2}
                    color="#D4AF37"
                    background={new THREE.Color("black")}
                />
            </mesh>
        </Float>
    );
}

function Particles() {
    return (
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
    )
}

export default function TitaniumBackground() {
    return (
        <div className="fixed inset-0 -z-10 bg-[#FFFFFF]">
            {/* Pure White Base */}
            <div className="absolute inset-0 bg-white" />

            {/* Subtle Gold/Warm Glows for Premium Feel - High Key */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] mix-blend-multiply opacity-50 animate-pulse" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-slate-100/50 rounded-full blur-[120px] mix-blend-multiply" />

            <div className="absolute inset-0 opacity-60">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                    <ambientLight intensity={1.5} />
                    <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} color="#D4AF37" />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="#FFFFFF" />
                    <pointLight position={[0, 0, 10]} intensity={0.8} color="#FFF5C3" />
                </Canvas>
            </div>
        </div>
    );
}
