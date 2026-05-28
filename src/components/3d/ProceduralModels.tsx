import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 1. CYBER DUMBBELL MODEL
export const Dumbbell3D: React.FC<{ color?: string }> = ({ color = '#9d4edd' }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Central Handle */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.2, 16]} />
        <meshStandardMaterial metalness={1} roughness={0.15} color="#cbd5e1" />
      </mesh>
      
      {/* Inner Grip Texture Rings */}
      {[-0.3, -0.1, 0.1, 0.3].map((pos, idx) => (
        <mesh key={idx} position={[0, pos, 0]}>
          <torusGeometry args={[0.09, 0.015, 8, 24]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
        </mesh>
      ))}

      {/* Left Weights */}
      <group position={[0, -0.6, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.15, 6]} />
          <meshStandardMaterial metalness={0.9} roughness={0.1} color="#0f172a" />
        </mesh>
        <mesh castShadow position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.1, 6]} />
          <meshStandardMaterial metalness={0.9} roughness={0.15} color="#1e293b" />
        </mesh>
        {/* Neon accent plate */}
        <mesh position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.31, 0.31, 0.02, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* Right Weights */}
      <group position={[0, 0.6, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.15, 6]} />
          <meshStandardMaterial metalness={0.9} roughness={0.1} color="#0f172a" />
        </mesh>
        <mesh castShadow position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.1, 6]} />
          <meshStandardMaterial metalness={0.9} roughness={0.15} color="#1e293b" />
        </mesh>
        {/* Neon accent plate */}
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.31, 0.31, 0.02, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
        </mesh>
      </group>
    </group>
  );
};

// 2. CYBER BASKETBALL MODEL
export const Basketball3D: React.FC<{ color?: string }> = ({ color = '#ff4500' }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.35;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.3;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Outer Shell */}
      <mesh castShadow>
        <sphereGeometry args={[0.6, 64, 64]} />
        <meshStandardMaterial 
          metalness={0.75} 
          roughness={0.2} 
          color="#fda4af" // Light cyber-rose base
          bumpScale={0.05}
        />
      </mesh>
      
      {/* Dynamic Wobble Core for Cyber Effect */}
      <mesh>
        <sphereGeometry args={[0.59, 32, 32]} />
        <MeshWobbleMaterial 
          factor={0.1} 
          speed={1.5} 
          color={color} 
          emissive={color} 
          emissiveIntensity={1.2}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Futuristic Seams */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.605, 0.015, 8, 64]} />
        <meshStandardMaterial color="#0f172a" metalness={1} roughness={0.1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.605, 0.015, 8, 64]} />
        <meshStandardMaterial color="#0f172a" metalness={1} roughness={0.1} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.605, 0.008, 8, 64]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.605, 0.008, 8, 64]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} />
      </mesh>
    </group>
  );
};

// 3. CYBER FOOTBALL MODEL
export const Football3D: React.FC<{ color?: string }> = ({ color = '#00f2fe' }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
      meshRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.3) * 0.25;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Solid core sphere */}
      <mesh castShadow>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial metalness={0.9} roughness={0.05} color="#cbd5e1" />
      </mesh>

      {/* Futuristic Hexagonal Glass Shell */}
      <mesh castShadow>
        <sphereGeometry args={[0.58, 20, 20]} />
        <meshStandardMaterial 
          color="#38bdf8" 
          wireframe 
          wireframeLinewidth={2}
          emissive={color}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Floating Dynamic Holographic Energy Ring */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.7, 0.01, 16, 64]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
};

// 4. CYBER TENNIS RACKET MODEL
export const TennisRacket3D: React.FC<{ color?: string }> = ({ color = '#39ff14' }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.4;
    }
  });

  return (
    <group ref={meshRef} scale={0.75}>
      {/* Handle Grip */}
      <mesh castShadow position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      {/* Handle Core Shaft */}
      <mesh castShadow position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 16]} />
        <meshStandardMaterial metalness={1} roughness={0.1} color="#cbd5e1" />
      </mesh>
      
      {/* Neon throat support */}
      <mesh position={[0, -0.15, 0]}>
        <torusGeometry args={[0.08, 0.015, 8, 16, Math.PI]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
      </mesh>

      {/* Racket Oval Frame */}
      <group position={[0, 0.2, 0]} scale={[0.8, 1, 1]}>
        <mesh castShadow>
          <torusGeometry args={[0.35, 0.025, 12, 48]} />
          <meshStandardMaterial metalness={0.9} roughness={0.1} color="#0f172a" />
        </mesh>
        
        {/* Glow inner line */}
        <mesh>
          <torusGeometry args={[0.34, 0.005, 8, 48]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
        </mesh>

        {/* String Grid (Procedural) */}
        {[-0.24, -0.18, -0.12, -0.06, 0, 0.06, 0.12, 0.18, 0.24].map((offset, idx) => (
          <React.Fragment key={idx}>
            {/* Vertical Strings */}
            <mesh position={[offset, 0, 0]}>
              <cylinderGeometry args={[0.003, 0.003, 0.65 - Math.abs(offset) * 0.8, 8]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
            </mesh>
            {/* Horizontal Strings */}
            <mesh position={[0, offset * 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.003, 0.003, 0.52 - Math.abs(offset) * 0.8, 8]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
            </mesh>
          </React.Fragment>
        ))}
      </group>
    </group>
  );
};

// 5. CYBER GYM KETTLEBELL
export const Kettlebell3D: React.FC<{ color?: string }> = ({ color = '#0066ff' }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.45;
      meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.25) * 0.15;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Kettlebell Body */}
      <mesh castShadow position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.48, 32, 32]} />
        <meshStandardMaterial metalness={0.9} roughness={0.1} color="#0f172a" />
      </mesh>
      
      {/* Energy core plate inside Kettlebell */}
      <mesh position={[0, -0.1, 0.485]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.01, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
      </mesh>

      {/* Kettlebell Handle */}
      <mesh castShadow position={[0, 0.28, 0]}>
        <torusGeometry args={[0.26, 0.06, 12, 32, Math.PI]} />
        <meshStandardMaterial metalness={0.9} roughness={0.15} color="#1e293b" />
      </mesh>
      {/* Handle vertical posts */}
      <mesh castShadow position={[-0.26, 0.14, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.28, 16]} />
        <meshStandardMaterial metalness={0.9} roughness={0.15} color="#1e293b" />
      </mesh>
      <mesh castShadow position={[0.26, 0.14, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.28, 16]} />
        <meshStandardMaterial metalness={0.9} roughness={0.15} color="#1e293b" />
      </mesh>
    </group>
  );
};

// 6. CYBER RUNNING SHOE / FLUID SPRINT PLATE (Advanced Procedural Design)
export const RunningShoe3D: React.FC<{ color?: string }> = ({ color = '#00f2fe' }) => {
  const groupRef = useRef<THREE.Group>(null);
  const bottomSoleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = elapsed * 0.4;
      groupRef.current.position.y = Math.sin(elapsed * 1.5) * 0.06;
    }
    if (bottomSoleRef.current) {
      // Create visual compression wave on bottom plate
      bottomSoleRef.current.scale.x = 1 + Math.sin(elapsed * 2) * 0.02;
    }
  });

  return (
    <group ref={groupRef} scale={1.1}>
      {/* Aerodynamic Bottom Carbon Sole Plate */}
      <mesh ref={bottomSoleRef} castShadow position={[0, -0.25, 0]}>
        <boxGeometry args={[1.1, 0.06, 0.38]} />
        <meshStandardMaterial color="#0f172a" metalness={1} roughness={0.2} />
      </mesh>

      {/* Floating dynamic cyan energy cushion structure */}
      <mesh position={[0, -0.16, 0]}>
        <boxGeometry args={[0.9, 0.12, 0.32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} transparent opacity={0.8} />
      </mesh>

      {/* Midsole glass structure */}
      <mesh position={[0, -0.06, 0]} castShadow>
        <boxGeometry args={[0.96, 0.08, 0.34]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.02} transparent opacity={0.65} />
      </mesh>

      {/* Upper Shoe Body (Streamlined Geometric mesh) */}
      <mesh castShadow position={[-0.05, 0.1, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.16, 0.22, 0.4, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.4} />
      </mesh>

      <mesh castShadow position={[0.25, 0.04, 0]}>
        <boxGeometry args={[0.6, 0.2, 0.3]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Glowing Neon Cyber Stripe */}
      <mesh position={[0.05, 0.06, 0.16]}>
        <boxGeometry args={[0.6, 0.02, 0.01]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
      </mesh>

      {/* Holographic Ankle Ring Halo */}
      <mesh position={[-0.2, 0.26, 0]} rotation={[Math.PI / 2, 0.4, 0]}>
        <torusGeometry args={[0.18, 0.015, 8, 32]} />
        <meshStandardMaterial color="#9d4edd" emissive="#9d4edd" emissiveIntensity={2} />
      </mesh>

      {/* Front Dynamic Toe Cap */}
      <mesh castShadow position={[0.5, -0.08, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

// 7. HERO COMPOSITE INTERACTIVE 3D COMPONENT (Large center visual with rotating holographic particles)
export const HeroScene3D: React.FC = () => {
  const mainRef = useRef<THREE.Group>(null);
  const orbitalRef1 = useRef<THREE.Mesh>(null);
  const orbitalRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (mainRef.current) {
      // Inertia mouse drift follow
      const mouseX = state.mouse.x * 0.3;
      const mouseY = state.mouse.y * 0.3;
      mainRef.current.rotation.y = THREE.MathUtils.lerp(mainRef.current.rotation.y, mouseX + elapsed * 0.2, 0.05);
      mainRef.current.rotation.x = THREE.MathUtils.lerp(mainRef.current.rotation.x, mouseY + Math.sin(elapsed * 0.5) * 0.15, 0.05);
    }
    
    // Animate orbital holographic rings
    if (orbitalRef1.current) {
      orbitalRef1.current.rotation.x = elapsed * 0.5;
      orbitalRef1.current.rotation.y = elapsed * 0.8;
    }
    if (orbitalRef2.current) {
      orbitalRef2.current.rotation.y = -elapsed * 0.6;
      orbitalRef2.current.rotation.z = elapsed * 0.4;
    }
  });

  return (
    <group ref={mainRef}>
      {/* Floating main model (a highly reflective premium running shoe) */}
      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.8}>
        <RunningShoe3D color="#00f2fe" />
      </Float>

      {/* Holographic Ring 1 */}
      <mesh ref={orbitalRef1}>
        <torusGeometry args={[1.5, 0.012, 16, 100]} />
        <meshBasicMaterial color="#00f2fe" transparent opacity={0.6} wireframe />
      </mesh>
      
      {/* Holographic Ring 2 */}
      <mesh ref={orbitalRef2} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.65, 0.008, 16, 100]} />
        <meshBasicMaterial color="#9d4edd" transparent opacity={0.5} wireframe />
      </mesh>

      {/* Background Particle Spray inside the canvas */}
      {Array.from({ length: 40 }).map((_, i) => {
        const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
        const phi = THREE.MathUtils.randFloat(0, Math.PI);
        const radius = THREE.MathUtils.randFloat(1.8, 2.8);
        const pos: [number, number, number] = [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ];
        const scale = THREE.MathUtils.randFloat(0.015, 0.035);
        const neonColors = ['#00f2fe', '#9d4edd', '#39ff14', '#0066ff'];
        const pColor = neonColors[Math.floor(Math.random() * neonColors.length)];

        return (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[scale, 8, 8]} />
            <meshBasicMaterial color={pColor} transparent opacity={0.8} />
          </mesh>
        );
      })}

      {/* Spot and Point Light Rigs inside Canvas for beautiful chrome gloss */}
      <pointLight position={[2, 2, 2]} intensity={2.5} color="#00f2fe" />
      <pointLight position={[-2, -2, -2]} intensity={2} color="#9d4edd" />
      <directionalLight position={[0, 4, 2]} intensity={3} color="#ffffff" />
    </group>
  );
};
