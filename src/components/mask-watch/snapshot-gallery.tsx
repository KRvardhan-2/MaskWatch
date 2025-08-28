"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CameraOff } from 'lucide-react';
import Image from 'next/image';

interface SnapshotGalleryProps {
  snapshots: string[];
}

const SnapshotGallery: React.FC<SnapshotGalleryProps> = ({ snapshots }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Unmasked Snapshots</CardTitle>
      </CardHeader>
      <CardContent>
        {snapshots.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
            <CameraOff className="h-16 w-16 mb-4" />
            <p>No snapshots taken yet.</p>
            <p className="text-sm">Snapshots of unmasked faces will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {snapshots.map((snapshot, index) => (
              <div key={index} className="relative aspect-square w-full overflow-hidden rounded-md border">
                <Image
                  src={snapshot}
                  alt={`Unmasked snapshot ${index + 1}`}
                  fill
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
