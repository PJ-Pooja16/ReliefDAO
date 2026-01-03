

'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Wind,
  Droplets,
  Waves,
  Mountain,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const alerts = [
  {
    id: 'alert-1',
    type: 'Cyclone',
    severity: 'Severe',
    location: 'Bay of Bengal, approaching Odisha coast',
    time: '2 hours ago',
    icon: Wind,
    color: 'border-red-500 bg-red-500/10 text-red-500',
    details: 'Cyclone "Amphan" has intensified to Category 4. Expected landfall in 12 hours. High wind speeds and storm surge expected.',
  },
  {
    id: 'alert-2',
    type: 'Flash Flood',
    severity: 'Moderate',
    location: 'Uttarakhand, India',
    time: '5 hours ago',
    icon: Droplets,
    color: 'border-orange-500 bg-orange-500/10 text-orange-500',
    details: 'Heavy rainfall has led to flash flood warnings in several districts. River levels are rising rapidly.',
  },
  {
    id: 'alert-3',
    type: 'Tsunami Watch',
    severity: 'Low',
    location: 'Indian Ocean, near Andaman Islands',
    time: '8 hours ago',
    icon: Waves,
    color: 'border-yellow-500 bg-yellow-500/10 text-yellow-500',
    details: 'An undersea earthquake of magnitude 7.1 has been reported. A tsunami watch is in effect for coastal regions.',
  },
   {
    id: 'alert-4',
    type: 'Landslide Warning',
    severity: 'High',
    location: 'Western Ghats, Kerala',
    time: '1 day ago',
    icon: Mountain,
    color: 'border-red-500 bg-red-500/10 text-red-500',
    details: 'Saturated soil from prolonged monsoon rains has triggered a high-risk landslide warning for Idukki and Wayanad districts.',
  }
];

export default function EmergencyFeedPage() {
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
              {alerts.map((alert, index) => (
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
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
