import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Text3D, Center, Float } from "@react-three/drei";

const FONT_URL = "/fonts/helvetiker-bold.typeface.json";

interface Props {
  onReady: () => void;
}

function ReadySignal({ onReady }: Props) {
  useEffect(onReady, [onReady]);
  return null;
}

function Scene({ onReady }: Props) {
  return (
    <>
      <ReadySignal onReady={onReady} />
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Center>
          <Text3D
            font={FONT_URL}
            size={2.5}
            height={0.5}
            bevelEnabled
            bevelThickness={0.03}
            bevelSize={0.02}
            bevelSegments={4}
          >
            404
            <meshStandardMaterial
              color="#22d3ee"
              metalness={0.3}
              roughness={0.4}
            />
          </Text3D>
        </Center>
      </Float>

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, -2, 4]} intensity={0.4} color="#22d3ee" />
    </>
  );
}

export default function NotFound3D({ onReady }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Scene onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
