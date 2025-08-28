"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Dispatch, SetStateAction } from 'react';

interface SettingsSheetProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  cameras: MediaDeviceInfo[];
  selectedCamera: string | undefined;
  setSelectedCamera: Dispatch<SetStateAction<string | undefined>>;
  sensitivity: number;
  setSensitivity: Dispatch<SetStateAction<number>>;
}

const SettingsSheet: React.FC<SettingsSheetProps> = ({
  isOpen,
  setIsOpen,
  cameras,
  selectedCamera,
  setSelectedCamera,
  sensitivity,
  setSensitivity,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Adjust camera and detection settings.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="grid gap-3">
            <Label htmlFor="camera">Camera</Label>
            <Select
              value={selectedCamera}
              onValueChange={setSelectedCamera}
              disabled={cameras.length === 0}
            >
              <SelectTrigger id="camera">
                <SelectValue placeholder="Select a camera" />
              </SelectTrigger>
              <SelectContent>
                {cameras.map((camera) => (
                  <SelectItem key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sensitivity">Detection Sensitivity</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="sensitivity"
                min={0}
                max={100}
                step={1}
                value={[sensitivity]}
                onValueChange={(value) => setSensitivity(value[0])}
              />
              <span className="text-sm font-medium w-12 text-center">
                {sensitivity}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Higher values make detection stricter. (Simulation)
            </p>
          </div>
        </div>
        <SheetFooter>
          <Button onClick={() => setIsOpen(false)}>Done</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSheet;
