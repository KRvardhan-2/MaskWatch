"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Settings, Upload } from 'lucide-react';
import { detectMask, DetectMaskOutput } from '@/ai/flows/detect-mask';

import CameraFeed from '@/components/mask-watch/camera-feed';
import StatusDisplay from '@/components/mask-watch/status-display';
import SettingsSheet from '@/components/mask-watch/settings-sheet';
import SnapshotGallery from '@/components/mask-watch/snapshot-gallery';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type DetectionStatus = 'mask' | 'no-mask' | 'detecting' | 'not-sure' | 'no-face';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function Home() {
  const [status, setStatus] = useState<DetectionStatus | null>(null);
  const [sensitivity, setSensitivity] = useState(50);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | undefined>(undefined);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(null);
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const captureAndDetect = useCallback(async () => {
    if (isDetecting || !videoRef.current || !canvasRef.current) {
      return;
    }

    setIsDetecting(true);
    if (status !== 'detecting') setStatus('detecting');

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
        setIsDetecting(false);
        return;
    };

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUri = canvas.toDataURL('image/jpeg');

    try {
      const result: DetectMaskOutput = await detectMask({ imageDataUri });
      setStatus(result.detection);
      
      if (result.box && result.box.x && result.box.y && result.box.width && result.box.height) {
        setBoundingBox(result.box as BoundingBox);
      } else {
        setBoundingBox(null);
      }

      if (result.detection === 'no-mask') {
        setSnapshots(prev => [imageDataUri, ...prev.slice(0, 5)]);
      }

    } catch (error) {
      console.error('Detection error:', error);
      setStatus(null);
      setBoundingBox(null);
      toast({
        variant: 'destructive',
        title: 'Detection Failed',
        description: 'Could not analyze the image.',
      });
    } finally {
      setIsDetecting(false);
    }
  }, [isDetecting, toast, status]);


  useEffect(() => {
    const detectionInterval = setInterval(() => {
      captureAndDetect();
    }, 2500);

    return () => clearInterval(detectionInterval);
  }, [captureAndDetect]);

  useEffect(() => {
    async function getCameras() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          throw new Error("Media devices API not available.");
        }
        await navigator.mediaDevices.getUserMedia({ video: true });
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        setCameras(videoDevices);
        if (videoDevices.length > 0 && !selectedCamera) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error("Could not get camera list:", err);
        toast({
          variant: "destructive",
          title: "Camera Error",
          description: "Could not access camera. Please check permissions and try again.",
        });
      }
    }
    getCameras();
  }, [selectedCamera, toast]);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const imageDataUri = e.target?.result as string;
        if (imageDataUri) {
            setIsDetecting(true);
            setStatus('detecting');
            setBoundingBox(null);
            try {
                const result = await detectMask({ imageDataUri });
                setStatus(result.detection);
                if (result.box && result.box.x && result.box.y && result.box.width && result.box.height) {
                  setBoundingBox(result.box as BoundingBox);
                } else {
                  setBoundingBox(null);
                }
            } catch (error) {
                console.error("Detection error:", error);
                setStatus(null);
                toast({
                    variant: 'destructive',
                    title: 'Detection Failed',
                    description: 'Could not analyze the image.',
                });
            } finally {
                setIsDetecting(false);
            }
        }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-full">
                <Camera className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                MaskWatch
              </h1>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="h-6 w-6" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <CameraFeed deviceId={selectedCamera} videoRef={videoRef} boundingBox={boundingBox} detectionStatus={status} />
            <Card>
                <CardContent className="p-4 flex items-center justify-center">
                    <Label htmlFor="upload-image" className="flex flex-col items-center gap-2 cursor-pointer">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-muted-foreground">Upload an Image for Detection</span>
                    </Label>
                    <Input id="upload-image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 sticky top-24 space-y-6">
            <StatusDisplay status={status} />
            <SnapshotGallery snapshots={snapshots} />
          </div>
        </div>
      </main>
      
      <canvas ref={canvasRef} className="hidden"></canvas>

      <SettingsSheet
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
        cameras={cameras}
        selectedCamera={selectedCamera}
        setSelectedCamera={setSelectedCamera}
        sensitivity={sensitivity}
        setSensitivity={setSensitivity}
      />
    </div>
  );
}
