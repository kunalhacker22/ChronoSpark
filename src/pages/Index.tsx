import React from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const ref = React.useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <main>
      <Helmet>
        <title>Vibe Countdown – Beautiful Event Countdowns</title>
        <meta name="description" content="Create, track, and share beautiful countdowns. Private or public, mobile-first, and easy to use." />
        <link rel="canonical" href="/" />
      </Helmet>
      <section
        ref={ref}
        onMouseMove={handleMove}
        className="min-h-[70vh] flex items-center justify-center relative overflow-hidden"
        aria-label="Hero"
      >
        <div className="absolute inset-0" style={{ background: "var(--gradient-primary)" }} />
        <div className="container relative py-24 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Count down to what matters
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Create beautiful countdowns for launches, birthdays, and community events.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/create"><Button variant="hero" size="lg">Create Event</Button></Link>
            <Link to="/feed"><Button variant="outline" size="lg">Explore Feed</Button></Link>
          </div>
        </div>
      </section>

      <section className="container py-16 grid sm:grid-cols-3 gap-6">
        <article className="p-6 rounded-lg border bg-card">
          <h2 className="text-xl font-semibold mb-2">Private or public</h2>
          <p className="text-muted-foreground">Keep it personal or share with the world in the public feed.</p>
        </article>
        <article className="p-6 rounded-lg border bg-card">
          <h2 className="text-xl font-semibold mb-2">QR sharing</h2>
          <p className="text-muted-foreground">Generate a QR code and share your event instantly.</p>
        </article>
        <article className="p-6 rounded-lg border bg-card">
          <h2 className="text-xl font-semibold mb-2">Confetti finish</h2>
          <p className="text-muted-foreground">Celebrate with confetti when the timer hits zero.</p>
        </article>
      </section>
    </main>
  );
};

export default Index;
