"use client";

import { useState, useEffect } from 'react';
import { Camera, Settings } from 'lucide-react';

import CameraFeed from '@/components/mask-watch/camera-feed';
import StatusDisplay from '@/components/mask-watch/status-display';
import SettingsSheet from '@/components/mask-watch/settings-sheet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export type DetectionStatus = 'mask' | 'no-mask' | 'detecting';

export default function Home() {
  const [status, setStatus] = useState<DetectionStatus | null>(null);
  const [sensitivity, setSensitivity] = useState(80);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | undefined>(undefined);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const statuses: DetectionStatus[] = ['mask', 'no-mask', 'detecting'];
    let currentIndex = 0;
    
    const detectionInterval = setInterval(() => {
      const random = Math.random();
      if (random < 0.05) {
        setStatus('detecting');
      } else if (random < 0.6) {
        setStatus('mask');
      } else {
        setStatus('no-mask');
      }
    }, 2500);

    return () => clearInterval(detectionInterval);
  }, []);

  useEffect(() => {
    async function getCameras() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          throw new Error("Media devices API not available.");
        }
        // Request permission to get camera labels
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Stop the track immediately after getting permission
        stream.getTracks().forEach(track => track.stop());
        
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Camera className="h-7 w-7 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight font-headline text-foreground">
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3">
            <CameraFeed deviceId={selectedCamera} />
          </div>
          <div className="lg:col-span-2 sticky top-24">
            <StatusDisplay status={status} />
          </div>
        </div>
      </main>

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
