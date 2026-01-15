'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download } from 'lucide-react';

export default function CalendarIntegration() {
    const exportToGoogleCalendar = () => {
        // Create Google Calendar event URL
        const event = {
            text: 'Séance TitanFit',
            dates: '20240115T180000/20240115T190000',
            details: 'Entraînement Push - TitanFit App',
            location: 'Salle de sport'
        };

        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.text)}&dates=${event.dates}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}`;
        window.open(url, '_blank');
    };

    const downloadICalFile = () => {
        // Generate iCal file content
        const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TitanFit//EN
BEGIN:VEVENT
UID:titanfit-workout-${Date.now()}@titanfit.app
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:20240115T180000Z
DTEND:20240115T190000Z
SUMMARY:Séance TitanFit - Push
DESCRIPTION:Entraînement programmé via TitanFit
LOCATION:Salle de sport
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icalContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'titanfit-workout.ics';
        link.click();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Synchroniser Calendrier
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                    Ajoutez vos séances d'entraînement à votre calendrier pour ne jamais les oublier.
                </p>

                <Button
                    onClick={exportToGoogleCalendar}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19,4H18V2H16V4H8V2H6V4H5A2,2 0 0,0 3,6V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V6A2,2 0 0,0 19,4M19,20H5V10H19V20Z" />
                    </svg>
                    Ajouter à Google Calendar
                </Button>

                <Button
                    onClick={downloadICalFile}
                    variant="outline"
                    className="w-full"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger fichier iCal
                </Button>

                <div className="mt-4 p-3 bg-purple-50 rounded-lg text-xs text-gray-600">
                    <p className="font-semibold mb-1">📅 Compatible avec :</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Google Calendar</li>
                        <li>Apple Calendar (iCal)</li>
                        <li>Outlook</li>
                        <li>Tout autre calendrier supportant .ics</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
