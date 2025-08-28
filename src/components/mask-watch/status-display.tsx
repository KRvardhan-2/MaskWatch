"use client";

import type { DetectionStatus } from '@/app/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert, ScanFace, HelpCircle, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface StatusDisplayProps {
  status: DetectionStatus | null;
}

const statusConfig = {
  mask: {
    title: "Mask Detected",
    Icon: ShieldCheck,
    badgeText: "Protected",
    description: "Looking good! The mask is worn correctly.",
    cardClasses: "border-green-500/50 bg-green-50 dark:bg-green-900/20",
    iconClasses: "text-green-500",
    badgeClasses: "bg-green-500/80 text-green-50",
  },
  'no-mask': {
    title: "No Mask Detected",
    Icon: ShieldAlert,
    badgeText: "Vulnerable",
    description: "Please wear a mask to stay protected.",
    cardClasses: "border-red-500/50 bg-red-50 dark:bg-red-900/20",
    iconClasses: "text-red-500",
    badgeClasses: "bg-red-500/80 text-red-50",
  },
  'no-face': {
    title: "No Face Detected",
    Icon: UserX,
    badgeText: "Scanning",
    description: "Point the camera towards a face to begin.",
    cardClasses: "border-yellow-500/50 bg-yellow-50 dark:bg-yellow-900/20",
    iconClasses: "text-yellow-500",
    badgeClasses: "bg-yellow-500/80 text-yellow-50",
  },
  'not-sure': {
    title: "Uncertain",
    Icon: HelpCircle,
    badgeText: "Uncertain",
    description: "Could not determine if a mask is present.",
    cardClasses: "border-gray-500/50 bg-gray-50 dark:bg-gray-900/20",
    iconClasses: "text-gray-500",
    badgeClasses: "bg-gray-500/80 text-gray-50",
  },
  detecting: {
    title: "Analyzing...",
    Icon: ScanFace,
    badgeText: "Scanning",
    description: "The AI is currently analyzing the feed.",
    cardClasses: "border-blue-500/50 bg-blue-50 dark:bg-blue-900/20",
    iconClasses: "text-blue-500 animate-pulse",
    badgeClasses: "bg-blue-500/80 text-blue-50",
  },
};

const StatusDisplay: React.FC<StatusDisplayProps> = ({ status }) => {
  const currentStatus = status ? statusConfig[status] : null;

  return (
    <Card className={cn(
      "transition-all duration-500 ease-in-out shadow-lg transform hover:scale-105",
       currentStatus ? currentStatus.cardClasses : "bg-card"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Detection Status</CardTitle>
        {currentStatus && (
          <Badge className={cn("transition-colors", currentStatus.badgeClasses)}>
            {currentStatus.badgeText}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div 
          className="flex flex-col items-center justify-center text-center p-6 min-h-[220px] overflow-hidden"
        >
          {currentStatus ? (
            <div key={status} className="animate-in fade-in-0 zoom-in-75 duration-700 space-y-3">
              <currentStatus.Icon className={cn("h-20 w-20 mx-auto drop-shadow-lg", currentStatus.iconClasses)} />
              <h2 className="text-2xl font-bold tracking-tight">{currentStatus.title}</h2>
              <p className="text-muted-foreground text-sm">{currentStatus.description}</p>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in-0 duration-500">
              <ScanFace className="h-20 w-20 text-muted-foreground/30 mx-auto" />
              <h2 className="text-2xl font-bold">Waiting</h2>
              <p className="text-muted-foreground text-sm">Awaiting camera feed to begin detection.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusDisplay;
