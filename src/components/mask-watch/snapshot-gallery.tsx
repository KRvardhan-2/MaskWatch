"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CameraOff } from 'lucide-react';
import Image from 'next/image';

interface SnapshotGalleryProps {
  snapshots: string[];
}

const SnapshotGallery: React.FC<SnapshotGalleryProps> = ({ snapshots }) => {
  return (
    <Card className="shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
      <CardHeader>
        <CardTitle>Unmasked Snapshots</CardTitle>
        <CardDescription>Recent detections of faces without masks.</CardDescription>
      </CardHeader>
      <CardContent>
        {snapshots.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-6 text-muted-foreground bg-gray-50 dark:bg-gray-800/20 rounded-lg">
            <CameraOff className="h-16 w-16 mb-4 text-gray-400 dark:text-gray-600" />
            <p className="font-medium">No snapshots taken yet.</p>
            <p className="text-sm">Snapshots will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {snapshots.map((snapshot, index) => (
              <div key={index} className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-transparent hover:border-primary transition-all duration-300 animate-in fade-in-0 zoom-in-90">
                <Image
                  src={snapshot}
                  alt={`Unmasked snapshot ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 200px"
                  style={{ objectFit: 'cover' }}
                  className="transform -scale-x-100"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SnapshotGallery;
