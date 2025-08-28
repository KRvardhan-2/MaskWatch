"use client";

import type { DetectionStatus } from '@/app/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, ScanFace, ShieldCheck, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface StatusDisplayProps {
  status: DetectionStatus | null;
}

const statusConfig = {
  mask: {
    title: "Mask Detected",
    Icon: ShieldCheck,
    badgeVariant: "default",
    badgeText: "Protected",
    description: "The individual is wearing a mask correctly.",
    colorClasses: "bg-green-100/50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    badgeColorClasses: "bg-green-600 hover:bg-green-700 text-white",
  },
  'no-mask': {
    title: "No Mask Detected",
    Icon: ShieldAlert,
    badgeVariant: "destructive",
    badgeText: "Vulnerable",
    description: "The individual is not wearing a mask.",
    colorClasses: "bg-red-100/50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    badgeColorClasses: "bg-red-600 hover:bg-red-700 text-white",
  },
  detecting: {
    title: "Detecting...",
    Icon: ScanFace,
    badgeVariant: "secondary",
    badgeText: "Scanning",
    description: "Analyzing the camera feed for faces and masks.",
    colorClasses: "bg-blue-100/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    badgeColorClasses: "bg-blue-600 hover:bg-blue-700 text-white",
  },
};

const StatusDisplay: React.FC<StatusDisplayProps> = ({ status }) => {
  const currentStatus = status ? statusConfig[status] : null;
  
  return (
    <Card className={cn(
      "transition-all duration-500 ease-in-out",
       currentStatus ? currentStatus.colorClasses : "bg-card"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Detection Status</CardTitle>
        {currentStatus && (
          <Badge className={cn("transition-colors", currentStatus.badgeColorClasses)}>
            {currentStatus.badgeText}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div 
          className="flex flex-col items-center justify-center text-center p-6 min-h-[180px]"
        >
          {currentStatus ? (
            <div key={status} className="animate-in fade-in-50 duration-500">
              <currentStatus.Icon className="h-16 w-16 mx-auto" />
              <h2 className="text-2xl font-bold mt-4">{currentStatus.title}</h2>
              <p className="text-muted-foreground mt-2">{currentStatus.description}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <ScanFace className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground mt-2">Awaiting camera feed...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusDisplay;
