export interface Milestone {
  id: string;
  date: string;
  hash: string;
  branch: string;
  title: string;
  description: string;
  type: 'feat' | 'fix' | 'release' | 'milestone';
  tags: string[];
}

export interface SideQuest {
  id: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
}

export interface Experience {
  id: string;
  role: string;
  org: string;
  period: string;
  description: string;
  achievements: string[];
  tech: string[];
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  tech: string[];
  status: 'live' | 'building' | 'archived';
  year: string;
  github_url?: string;
  live_url?: string;
}

export interface SiteStats {
  projects_shipped: string;
  deployments: string;
  semester: string;
}

export interface MerchItem {
  id: string;
  name: string;
  description: string;
  material_and_color: string;
  price_inr: number;
  sizes: string[];
  image_url: string | string[];
  status_badge?: string;
  color?: string;
  redirect_url?: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  title: string;
  description: string;
  like_count: number;
  created_at: string;
}

export interface Film {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  duration: string;
  format: string;
  drive_id: string;
  synopsis: string;
  tags: string[];
}

export interface Track {
  id: string;
  title: string;
  duration: string;
  genre: string;
  year: string;
  bpm: string;
  key_signature: string;
  spotify_url: string;
  description: string;
  tags: string[];
}

export interface RadarSite {
  id: string;
  name: string;
  status: 'live' | 'building' | 'idle';
  uptime: string;
}

export interface MusicRelease {
  id: string;
  title: string;
  type: string;
  release_year: string;
  spotify_url: string;
}

export interface YoutubeVideo {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
}

export interface GalleryFrequencyItem {
  id: string;
  title: string;
  image_url: string;
  tag_category: string;
  tag_location: string;
  log_date: string;
  feed_number: string;
}
