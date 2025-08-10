import React from "react";
import { Helmet } from "react-helmet-async";
import { EventCard } from "@/components/EventCard";
import { getMyEvents } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MyEvents: React.FC = () => {
  const [events, setEvents] = React.useState(() => getMyEvents());

  React.useEffect(() => {
    const id = setInterval(() => setEvents(getMyEvents()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="container py-10">
      <Helmet>
        <title>My Events – Vibe Countdown</title>
        <meta name="description" content="View and manage your created countdown events." />
        <link rel="canonical" href="/events" />
      </Helmet>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My events</h1>
        <Link to="/create"><Button variant="hero">Create</Button></Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center text-muted-foreground py-20">No events yet. Create your first one!</div>
      ) : (
        <div className="grid gap-4">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </main>
  );
};

export default MyEvents;
