/**
 * Shared editorial post type — used by both frontend and backend.
 * Represents a communication entry from the ACT Communications Dashboard in Notion.
 */
export interface EditorialPost {
  /** Notion page ID */
  id: string;
  title: string;
  communicationType: string; // e.g. "Social Post", "LinkedIn Post", "Newsletter"
  status: "draft" | "approved" | "scheduled" | "published";
  scheduledDate: string | null; // ISO datetime (mapped from "Sent date")
  platforms: string[]; // e.g. ["Instagram", "Facebook", "Google Business"]
  caption: string; // mapped from "Key Message/Story"
  editorialNote: string; // mapped from "Notes"
  mediaUrl: string | null; // extracted from "Image" files or "Video link"
  format: "square" | "landscape" | "story";
  link: string | null;
  utmContent: string;
  ghlPostId: string | null;
  /** Notion page IDs of related projects (e.g. The Harvest, PICC) */
  projectIds: string[];
}

/** Project summary returned by the editorial projects endpoint */
export interface EditorialProject {
  id: string; // Notion page ID
  name: string;
}
