"use client";

import { useEffect, useState, RefObject } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { VideoOff, Loader } from 'lucide-react';

interface CameraFeedProps {
  deviceId: string | undefined;
  videoRef: RefObject<HTMLVideoElement>;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ deviceId, videoRef }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <Card className="shadow-lg">
      <CardContent className="p-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-900">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover transform -scale-x-100"
          />
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
