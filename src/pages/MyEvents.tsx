import React from "react";
import { Helmet } from "react-helmet-async";
import { EventCard } from "@/components/EventCard";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { EventItem } from "@/types/event";

const MyEvents: React.FC = () => {
  const [events, setEvents] = React.useState<EventItem[]>([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) return;
      const { data, error } = await supabase
        .from("events")
        .select("id, creator_id, title, description, date_time, image_url, is_public, category, created_at, follower_count")
        .eq("creator_id", userId)
        .order("date_time", { ascending: true });
      if (!mounted) return;
      if (!error && data) setEvents(data as unknown as EventItem[]);
    })();
    return () => { mounted = false; };
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
