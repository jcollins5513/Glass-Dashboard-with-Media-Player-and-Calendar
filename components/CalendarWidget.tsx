// This component will display the Google Calendar events.
'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

interface CalendarEvent {
  summary: string;
  start: {
    dateTime: string;
  };
}

const CalendarWidget = () => {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (status === 'authenticated') {
        try {
          setLoading(true);
          const response = await fetch('/api/google/calendar');
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch events');
          }
          const data = await response.json();
          setEvents(data.events || []);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setLoading(false);
        }
      }
    };

    if (status !== 'loading') {
      fetchEvents();
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-white">
        <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
        <p>Loading session...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-white flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
        <p className="mb-4">Please sign in to view your calendar.</p>
        <button
          onClick={() => signIn('google')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-white">
      <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}
      {!loading && !error && (
        <ul className="space-y-2">
          {events.length > 0 ? (
            events.map((event, index) => (
              <li key={index} className="p-2 bg-white/5 rounded-md">
                <p className="font-semibold">{event.summary}</p>
                <p className="text-sm text-gray-300">
                  {new Date(event.start.dateTime).toLocaleString()}
                </p>
              </li>
            ))
          ) : (
            <p>No upcoming appointments found.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default CalendarWidget;
