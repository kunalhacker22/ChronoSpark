import { EventItem } from "@/types/event";

const STORAGE_KEY = "vibe_countdown_events";

function read(): EventItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as EventItem[]) : [];
  } catch {
    return [];
  }
}

function write(events: EventItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function createEvent(event: EventItem) {
  const events = read();
  events.push(event);
  write(events);
}

export function updateEvent(event: EventItem) {
  const events = read().map((e) => (e.id === event.id ? event : e));
  write(events);
}

export function deleteEvent(id: string) {
  const events = read().filter((e) => e.id !== id);
  write(events);
}

export function getMyEvents(): EventItem[] {
  return read().sort((a, b) => a.date_time.localeCompare(b.date_time));
}

export function getPublicEvents(): EventItem[] {
  return read()
    .filter((e) => e.is_public)
    .sort((a, b) => a.date_time.localeCompare(b.date_time));
}

export function getEventById(id: string): EventItem | undefined {
  return read().find((e) => e.id === id);
}
