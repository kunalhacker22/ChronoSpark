export type EventCategory = "Tech" | "Music" | "Sports" | "General";

export interface EventItem {
  id: string;
  creator_id?: string;
  title: string;
  description?: string;
  date_time: string; // ISO string
  image_url?: string;
  is_public: boolean;
  category: EventCategory;
  created_at: string; // ISO
  follower_count?: number;
}
