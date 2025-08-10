import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById, deleteEvent } from "@/utils/storage";
import { CountdownCircle } from "@/components/CountdownCircle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as QRCode from "qrcode";
import confetti from "canvas-confetti";

const EventDetail: React.FC = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const event = id ? getEventById(id) : undefined;
  const [qr, setQr] = React.useState<string>("");
  const firedRef = React.useRef(false);

  React.useEffect(() => {
    const url = `${window.location.origin}/event/${id}`;
    QRCode.toDataURL(url, { width: 240 }).then(setQr).catch(() => setQr(""));
  }, [id]);

  React.useEffect(() => {
    if (!event) return;
    const target = new Date(event.date_time);
    const tick = () => {
      const remaining = target.getTime() - Date.now();
      if (remaining <= 0 && !firedRef.current) {
        firedRef.current = true;
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    };
    const idInt = setInterval(tick, 500);
    return () => clearInterval(idInt);
  }, [event]);

  if (!event) {
    return (
      <main className="container py-10">
        <p className="text-muted-foreground">Event not found.</p>
        <Button className="mt-4" onClick={() => nav("/")}>Go home</Button>
      </main>
    );
  }

  const date = new Date(event.date_time);

  function handleDelete() {
    deleteEvent(event.id);
    nav("/events");
  }

  return (
    <main className="container py-10">
      <Helmet>
        <title>{`${event.title} – Vibe Countdown`}</title>
        <meta name="description" content={`Countdown to ${event.title} happening on ${date.toLocaleString()}.`} />
        <link rel="canonical" href={`/event/${event.id}`} />
      </Helmet>
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-primary)" }} />
          <CardHeader>
            <CardTitle className="text-3xl font-semibold">{event.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <CountdownCircle target={date} start={new Date(event.created_at)} />
            {event.description && (
              <p className="text-center text-muted-foreground max-w-xl">{event.description}</p>
            )}
            <div className="text-sm text-muted-foreground">{date.toLocaleString()}</div>
            <div className="flex gap-3">
              <Button variant="hero" onClick={() => window.print()}>Save as PDF</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Share this event</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {qr ? <img src={qr} alt="QR code for event share" className="rounded" /> : <div className="text-muted-foreground">Generating QR...</div>}
            <div className="text-sm text-muted-foreground">Scan to open this event.</div>
            <Button onClick={() => navigator.clipboard.writeText(window.location.href)}>Copy Link</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default EventDetail;
