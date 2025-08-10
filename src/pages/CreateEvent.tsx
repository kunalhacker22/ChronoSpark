import React from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EventCategory } from "@/types/event";
const categories: EventCategory[] = ["Tech", "Music", "Sports", "General"];

const CreateEvent: React.FC = () => {
  const nav = useNavigate();
  const [isPublic, setIsPublic] = React.useState(true);
  const [category, setCategory] = React.useState<EventCategory>("General");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const title = String(formData.get("title") || "").trim();
    const date_time = String(formData.get("date_time") || "");
    const description = String(formData.get("description") || "").trim();
    const image_url = String(formData.get("image_url") || "").trim();

    if (!title || !date_time) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    if (!userId) {
      nav("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("events")
      .insert({
        creator_id: userId,
        title,
        description: description || null,
        date_time: new Date(date_time).toISOString(),
        image_url: image_url || null,
        is_public: isPublic,
        category,
      })
      .select("id")
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    if (data?.id) nav(`/event/${data.id}`);
  }

  return (
    <main className="container py-10">
      <Helmet>
        <title>Create Event – Vibe Countdown</title>
        <meta name="description" content="Create a new countdown event with title, date, description, and sharing options." />
        <link rel="canonical" href="/create" />
      </Helmet>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create a new event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event title</Label>
                <Input id="title" name="title" placeholder="Product Launch" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_time">Date & time</Label>
                <Input id="date_time" name="date_time" type="datetime-local" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Optional details..." rows={4} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL (optional)</Label>
                <Input id="image_url" name="image_url" placeholder="https://..." />
              </div>

              <div className="grid sm:grid-cols-2 gap-6 items-end">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as EventCategory)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between gap-4 p-3 rounded-md border">
                  <div>
                    <Label className="mb-1 block">Make public</Label>
                    <p className="text-sm text-muted-foreground">Public events appear in the feed</p>
                  </div>
                  <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="submit" variant="hero">Create Event</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default CreateEvent;
