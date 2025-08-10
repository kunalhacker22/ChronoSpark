import React from "react";
import { Helmet } from "react-helmet-async";
import { EventCard } from "@/components/EventCard";
import { getPublicEvents } from "@/utils/storage";

const PublicFeed: React.FC = () => {
  const [events, setEvents] = React.useState(() => getPublicEvents());

  React.useEffect(() => {
    const id = setInterval(() => setEvents(getPublicEvents()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="container py-10">
      <Helmet>
        <title>Public Feed – Vibe Countdown</title>
        <meta name="description" content="Discover public countdown events shared by the community." />
        <link rel="canonical" href="/feed" />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-6">Public events</h1>
      {events.length === 0 ? (
        <div className="text-center text-muted-foreground py-20">No public events yet.</div>
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

export default PublicFeed;
