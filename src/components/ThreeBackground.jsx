import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'
import * as THREE from 'three'

function ParticleSwarm(props) {
  const ref = useRef()
  // Generate random points in a sphere
  const sphere = useMemo(() => {
    const data = new Float32Array(3000)
    return random.inSphere(data, { radius: 1.5 })
  }, [])
  
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    // Slow rotation
    if (ref.current) {
      ref.current.rotation.x -= delta / 10
      ref.current.rotation.y -= delta / 15
      
      // Gentle bobbing
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      
      // Interactive mouse follow
      if (hovered) {
        ref.current.rotation.x += (state.pointer.y * 0.2 - ref.current.rotation.x) * 0.05
        ref.current.rotation.y += (state.pointer.x * 0.2 - ref.current.rotation.y) * 0.05
      }
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points 
        ref={ref} 
        positions={sphere} 
        stride={3} 
        frustumCulled={false} 
        {...props}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <PointMaterial
          transparent
          color="#9333ea"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  )
}

function ConnectionLines() {
  const lineRef = useRef()
  
  const lineGeometry = useMemo(() => {
    // Creating a few interconnecting lines to simulate dependency graphs
    const points = []
    for(let i=0; i<30; i++) {
      points.push(new THREE.Vector3(
        (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 2.5
      ))
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    return geometry
  }, [])

  useFrame((state, delta) => {
    if (lineRef.current) {
      lineRef.current.rotation.x -= delta / 20
      lineRef.current.rotation.y += delta / 25
    }
  })

  return (
    <lineSegments ref={lineRef} geometry={lineGeometry}>
      <lineBasicMaterial color="#06b6d4" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
    </lineSegments>
  )
}

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <fog attach="fog" args={['#09090b', 2, 5]} />
        <ParticleSwarm />
        <ConnectionLines />
      </Canvas>
    </div>
  )
}
