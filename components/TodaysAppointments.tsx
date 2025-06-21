import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Badge } from './ui/badge';

interface Appointment {
  id: number;
  title: string;
  time: string;
  duration: string;
  location?: string;
  attendees?: number;
  type: 'meeting' | 'call' | 'event' | 'personal';
  color: string;
}

const mockAppointments: Appointment[] = [
  {
    id: 1,
    title: "Team Standup",
    time: "09:00",
    duration: "30 min",
    location: "Conference Room A",
    attendees: 8,
    type: "meeting",
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Client Call - Project Review",
    time: "11:30",
    duration: "1 hour",
    attendees: 4,
    type: "call",
    color: "bg-green-500"
  },
  {
    id: 3,
    title: "Lunch with Sarah",
    time: "12:30",
    duration: "1 hour",
    location: "Café Downtown",
    type: "personal",
    color: "bg-purple-500"
  },
  {
    id: 4,
    title: "Design Workshop",
    time: "14:00",
    duration: "2 hours",
    location: "Design Studio",
    attendees: 12,
    type: "event",
    color: "bg-orange-500"
  },
  {
    id: 5,
    title: "Product Demo",
    time: "16:30",
    duration: "45 min",
    attendees: 15,
    type: "meeting",
    color: "bg-red-500"
  }
];

const getCurrentTime = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

const getTimeInMinutes = (timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

export function TodaysAppointments() {
  const currentTimeInMinutes = getCurrentTime();
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="h-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <Calendar className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-white">Today's Schedule</h3>
          <p className="text-white/70 text-sm">{today}</p>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3 overflow-y-auto max-h-[calc(100%-120px)]">
        {mockAppointments.map((appointment) => {
          const appointmentTime = getTimeInMinutes(appointment.time);
          const isUpcoming = appointmentTime > currentTimeInMinutes;
          const isHappening = Math.abs(appointmentTime - currentTimeInMinutes) < 30;

          return (
            <div
              key={appointment.id}
              className={`relative p-4 rounded-2xl border transition-all ${
                isHappening
                  ? 'bg-white/20 border-white/30'
                  : isUpcoming
                  ? 'bg-white/10 border-white/20 hover:bg-white/15'
                  : 'bg-white/5 border-white/10 opacity-60'
              }`}
            >
              {/* Color indicator */}
              <div className={`absolute left-0 top-4 w-1 h-8 rounded-r ${appointment.color}`} />
              
              <div className="ml-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white text-sm leading-tight">{appointment.title}</h4>
                  {isHappening && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                      Live
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-white/70 text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{appointment.time}</span>
                    <span>•</span>
                    <span>{appointment.duration}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-white/60 text-xs">
                  {appointment.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{appointment.location}</span>
                    </div>
                  )}
                  
                  {appointment.attendees && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{appointment.attendees} people</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-white/50 text-xs text-center">
          Connected to Google Calendar
        </p>
      </div>
    </div>
  );
}