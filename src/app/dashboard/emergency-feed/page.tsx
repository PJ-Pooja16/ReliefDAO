
'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Wind,
  Droplets,
  Waves,
  Mountain,
  LucideIcon,
  Loader2,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type Alert = {
    id: string;
    type: string;
    severity: string;
    location: string;
    details: string;
    time: string;
    icon: LucideIcon;
    color: string;
};

const staticAlerts: Omit<Alert, 'icon' | 'color'>[] = [
    {
        id: 'bay-of-bengal-approaching-odisha-coast',
        type: 'Cyclone',
        severity: 'Severe',
        location: 'Bay of Bengal, approaching Odisha coast',
        details: 'Tropical Cyclone "Amphan" expected to make landfall in 12 hours. Evacuations in progress.',
        time: 'Just now',
    },
    {
        id: 'uttarakhand-india',
        type: 'Flash Flood Watch',
        severity: 'High',
        location: 'Uttarakhand, India',
        details: 'Heavy thunderstorms in the region may lead to flash floods and landslides. High-risk areas are being monitored.',
        time: '15 minutes ago',
    },
    {
        id: 'indian-ocean-near-andaman-islands',
        type: 'Tsunami Watch',
        severity: 'Moderate',
        location: 'Indian Ocean, near Andaman Islands',
        details: 'A 7.1 magnitude undersea earthquake has been detected. A tsunami watch is in effect for coastal areas.',
        time: '32 minutes ago',
    },
    {
        id: 'western-ghats-kerala',
        type: 'Landslide Alert',
        severity: 'Moderate',
        location: 'Western Ghats, Kerala',
        details: 'Continuous heavy rainfall has saturated soil, increasing the risk of landslides in mountainous terrain.',
        time: '1 hour ago',
    },
];


const getAlertConfig = (type: string, severity: string) => {
    let icon: LucideIcon = AlertTriangle;
    if (type.includes('Cyclone')) icon = Wind;
    if (type.includes('Flood')) icon = Droplets;
    if (type.includes('Tsunami')) icon = Waves;
    if (type.includes('Landslide')) icon = Mountain;

    let color = 'border-yellow-500 bg-yellow-500/10 text-yellow-500';
    if (severity === 'Severe' || severity === 'High') {
        color = 'border-red-500 bg-red-500/10 text-red-500';
    } else if (severity === 'Moderate') {
        color = 'border-orange-500 bg-orange-500/10 text-orange-500';
    }
    return { icon, color };
};


export default function EmergencyFeedPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const loadAlerts = () => {
      setIsLoading(true);
      const formattedAlerts = staticAlerts.map(alert => ({
          ...alert,
          ...getAlertConfig(alert.type, alert.severity)
      }));
      setAlerts(formattedAlerts);
      setIsLoading(false);
    };

    loadAlerts();
  }, []);

  return (
    <>
      <PageHeader
        title="Emergency Feed"
        description="Real-time alerts and updates from global monitoring systems."
      />
      <div className="container pb-8 grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-150px)]">
        <div className="lg:col-span-2 h-full">
          <Card className="h-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15783321.42390011!2d68.1097894107147!3d22.3424888277259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sus!4v1678886453120!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            ></iframe>
          </Card>
        </div>
        <div className="h-full overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle>Live Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                 <div className="flex items-center justify-center p-10">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="ml-4 text-muted-foreground">Loading alerts...</span>
                </div>
              ) : alerts.length > 0 ? (
                alerts.map((alert, index) => (
                  <div key={alert.id}>
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 p-2 rounded-full ${alert.color}`}>
                         <alert.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">{alert.type}</h4>
                           <Badge variant={
                             alert.severity === 'Severe' || alert.severity === 'High' ? 'destructive' : alert.severity === 'Moderate' ? 'secondary' : 'outline'
                           }>{alert.severity}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.location}</p>
                        <p className="text-sm mt-2">{alert.details}</p>
                         <p className="text-xs text-muted-foreground mt-2">{alert.time}</p>
                      </div>
                    </div>
                    {index < alerts.length - 1 && <Separator className="my-4" />}
                  </div>
                ))
              ) : (
                <div className="text-center p-10 text-muted-foreground">
                    No active alerts at this time.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
