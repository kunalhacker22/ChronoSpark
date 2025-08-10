import React from "react";
import { Helmet } from "react-helmet-async";
import { EventCard } from "@/components/EventCard";
import { supabase } from "@/integrations/supabase/client";

const PublicFeed: React.FC = () => {
  const [events, setEvents] = React.useState(() => [] as any[]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, creator_id, title, description, date_time, image_url, is_public, category, created_at, follower_count")
        .eq("is_public", true)
        .order("date_time", { ascending: true });
      if (!mounted) return;
      if (!error && data) setEvents(data);
    })();
    return () => { mounted = false; };
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
