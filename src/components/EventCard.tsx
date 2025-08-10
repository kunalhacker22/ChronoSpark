import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { EventItem } from "@/types/event";

interface Props {
  event: EventItem;
  onShare?: (event: EventItem) => void;
}

export const EventCard: React.FC<Props> = ({ event, onShare }) => {
  const date = new Date(event.date_time);
  const dateStr = date.toLocaleString();

  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Link to={`/event/${event.id}`} className="story-link">{event.title}</Link>
          <div className="flex items-center gap-2">
            {event.is_public && (
              <span className="text-xs px-2 py-1 rounded bg-accent text-accent-foreground">Public</span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="opacity-70" />
          <span>{dateStr}</span>
        </div>
        <div className="flex gap-2">
          <Link to={`/event/${event.id}`}>
            <Button variant="secondary">Open</Button>
          </Link>
          <Button variant="glow" onClick={() => onShare?.(event)}>
            <Share2 />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
