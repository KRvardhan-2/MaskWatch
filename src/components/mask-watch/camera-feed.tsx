"use client";

import { useEffect, useState, RefObject, useRef } from 'react';
import type { DetectionStatus, BoundingBox } from '@/app/page';
import { Card, CardContent } from '@/components/ui/card';
import { VideoOff, Loader } from 'lucide-react';

interface CameraFeedProps {
  deviceId: string | undefined;
  videoRef: RefObject<HTMLVideoElement>;
  boundingBox: BoundingBox | null;
  detectionStatus: DetectionStatus | null;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ deviceId, videoRef, boundingBox, detectionStatus }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let stream: MediaStream;
    async function setupCamera() {
      setIsLoading(true);
      setError(null);
      if (videoRef.current) {
        try {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Camera not available on this browser');
          }

          const constraints: MediaStreamConstraints = {
            video: {
              deviceId: deviceId ? { exact: deviceId } : undefined,
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          };

          stream = await navigator.mediaDevices.getUserMedia(constraints);
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsLoading(false);
          };
        } catch (err) {
          console.error("Error accessing camera:", err);
          if (err instanceof Error) {
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
              setError("Camera access denied. Please allow camera access in your browser settings.");
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
              setError("No camera found. Please ensure a camera is connected.");
            } else {
              setError("Could not start camera. Please try again.");
            }
          }
          setIsLoading(false);
        }
      }
    }

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [deviceId, videoRef]);

  const getBoundingBoxStyle = (): React.CSSProperties => {
    if (!boundingBox || !containerRef.current) {
      return { display: 'none' };
    }

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    const color = detectionStatus === 'mask' ? 'border-green-500' : 'border-red-500';

    return {
      position: 'absolute',
      left: `${boundingBox.x * containerWidth}px`,
      top: `${boundingBox.y * containerHeight}px`,
      width: `${boundingBox.width * containerWidth}px`,
      height: `${boundingBox.height * containerHeight}px`,
      border: `4px solid ${detectionStatus === 'mask' ? '#22c55e' : '#ef4444'}`,
      transform: 'scaleX(-1)',
      borderRadius: '8px',
      boxShadow: '0 0 15px rgba(0,0,0,0.5)',
      transition: 'all 0.3s ease',
    };
  };
  
  return (
    <Card className="shadow-lg">
      <CardContent className="p-2">
        <div ref={containerRef} className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-900">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover transform -scale-x-100"
          />
          {boundingBox && (detectionStatus === 'mask' || detectionStatus === 'no-mask') && <div style={getBoundingBoxStyle()} />}

          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white">
              <Loader className="h-12 w-12 animate-spin" />
              <p className="mt-4 text-lg">Starting Camera...</p>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white p-4 text-center">
              <VideoOff className="h-12 w-12" />
              <p className="mt-4 text-lg font-semibold">Camera Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraFeed;
