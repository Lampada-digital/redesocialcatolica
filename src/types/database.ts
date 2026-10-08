// Database types generated from PostgreSQL schema
// These types represent the actual database structure

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN' | 'PARISH_ADMIN' | 'DIOCESE_ADMIN' | 'PRIEST';

export type PostVisibility = 'PUBLIC' | 'FRIENDS' | 'FOLLOWERS' | 'PRIVATE' | 'COMMUNITY';

export type CommunityType = 'PUBLIC' | 'PRIVATE' | 'SECRET';

export type EventType = 'MISSA' | 'TERCO' | 'ADORACAO' | 'RETIRIO' | 'CATEQUESE' | 'ENCONTRO' | 'FORMACAO' | 'FESTA' | 'OUTRO';

export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export type EventAttendeeStatus = 'GOING' | 'INTERESTED' | 'NOT_GOING';

export type ReactionType = 'LIKE' | 'AMEN' | 'PRAY' | 'LOVE';

export type ReportReason = 'SPAM' | 'HARASSMENT' | 'HATE' | 'SEXUAL_CONTENT' | 'VIOLENCE' | 'SCAM' | 'MISINFORMATION' | 'IMPERSONATION' | 'OTHER';

export type ReportStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';

export type NotificationType = 
  | 'FRIEND_REQUEST' 
  | 'FRIEND_ACCEPTED' 
  | 'POST_LIKE' 
  | 'POST_COMMENT' 
  | 'COMMENT_REPLY'
  | 'NEW_FOLLOWER' 
  | 'COMMUNITY_INVITE' 
  | 'EVENT_REMINDER' 
  | 'MESSAGE' 
  | 'PRAYER_SUPPORT' 
  | 'SYSTEM';

export type PrayerVisibility = 'PUBLIC' | 'FRIENDS' | 'PRIVATE';

export type MediaType = 'IMAGE' | 'VIDEO' | 'DOCUMENT';

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// ============================================
// TABLE TYPES
// ============================================

export interface Profile {
  id: string; // UUID, references auth.users
  username: string;
  display_name: string;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  patron_saint: string | null;
  parish_id: string | null;
  diocese_id: string | null;
  is_verified: boolean;
  verification_badge: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRoles {
  id: string;
  user_id: string;
  role: UserRole;
  entity_type: string | null; // 'parish', 'diocese', 'community'
  entity_id: string | null;
  created_at: string;
}

export interface Diocese {
  id: string;
  name: string;
  slug: string;
  bishop_name: string | null;
  city: string;
  state: string;
  country: string;
  website: string | null;
  description: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Parish {
  id: string;
  diocese_id: string;
  name: string;
  slug: string;
  address: string | null;
  city: string;
  state: string;
  country: string;
  phone: string | null;
  website: string | null;
  email: string | null;
  mass_schedule: Json | null; // JSON array of schedules
  description: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  is_verified: boolean;
  verified_at: string | null;
  verified_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Pastoral {
  id: string;
  parish_id: string;
  name: string;
  description: string | null;
  coordinator_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  type: CommunityType;
  category: string | null;
  rules: string | null;
  creator_id: string;
  parish_id: string | null;
  is_verified: boolean;
  members_count: number;
  posts_count: number;
  created_at: string;
  updated_at: string;
}

export interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  role: 'MEMBER' | 'MODERATOR' | 'ADMIN';
  joined_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  content: string;
  visibility: PostVisibility;
  community_id: string | null;
  parent_id: string | null; // For shared posts
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  author?: Profile;
  media?: PostMedia[];
}

export interface PostMedia {
  id: string;
  post_id: string;
  url: string;
  type: MediaType;
  mime_type: string | null;
  size: number | null;
  order_index: number;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  parent_id: string | null; // For nested comments
  likes_count: number;
  created_at: string;
  updated_at: string;
  // Relations
  author?: Profile;
  replies?: Comment[];
}

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: ReactionType;
  created_at: string;
}

export interface PostShare {
  id: string;
  post_id: string;
  user_id: string;
  shared_to: 'FEED' | 'COMMUNITY' | 'EXTERNAL';
  community_id: string | null;
  created_at: string;
}

export interface SavedPost {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface Follower {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Block {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: 'USER' | 'POST' | 'COMMENT' | 'COMMUNITY' | 'MESSAGE';
  target_id: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string | null;
  address: string | null;
  start_at: string;
  end_at: string | null;
  organizer_id: string;
  organizer_type: 'USER' | 'PARISH' | 'DIOCESE' | 'COMMUNITY';
  type: EventType;
  visibility: 'PUBLIC' | 'PRIVATE' | 'COMMUNITY';
  community_id: string | null;
  parish_id: string | null;
  capacity: number | null;
  status: EventStatus;
  cover_url: string | null;
  attendees_count: number;
  created_at: string;
  updated_at: string;
}

export interface EventAttendee {
  id: string;
  event_id: string;
  user_id: string;
  status: EventAttendeeStatus;
  created_at: string;
}

export interface PrayerIntention {
  id: string;
  author_id: string;
  content: string;
  category: string | null;
  visibility: PrayerVisibility;
  prayers_count: number;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  author?: Profile;
}

export interface PrayerSupport {
  id: string;
  intention_id: string;
  user_id: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  is_group: boolean;
  group_name: string | null;
  group_avatar_url: string | null;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'MEMBER' | 'ADMIN';
  joined_at: string;
  last_read_at: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  media_url: string | null;
  media_type: MediaType | null;
  reply_to_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface MessageRead {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  from_user_id: string | null;
  entity_type: string | null;
  entity_id: string | null;
  content: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface VerificationRequest {
  id: string;
  user_id: string;
  entity_type: 'PROFILE' | 'PARISH' | 'DIOCESE' | 'COMMUNITY';
  entity_id: string;
  documents: Json | null;
  status: VerificationStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface ModerationAction {
  id: string;
  moderator_id: string;
  action_type: 'REMOVE_CONTENT' | 'BAN_USER' | 'WARN_USER' | 'UNBAN_USER' | 'VERIFY_ENTITY' | 'REJECT_VERIFICATION';
  target_type: string;
  target_id: string;
  reason: string | null;
  metadata: Json | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Json | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface Media {
  id: string;
  user_id: string;
  url: string;
  type: MediaType;
  mime_type: string;
  size: number;
  width: number | null;
  height: number | null;
  storage_path: string;
  created_at: string;
}

// ============================================
// DATABASE SCHEMA TYPE
// ============================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Profile>;
      };
      user_roles: {
        Row: UserRoles;
        Insert: Omit<UserRoles, 'created_at'> & { created_at?: string };
        Update: Partial<UserRoles>;
      };
      dioceses: {
        Row: Diocese;
        Insert: Omit<Diocese, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Diocese>;
      };
      parishes: {
        Row: Parish;
        Insert: Omit<Parish, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Parish>;
      };
      pastorals: {
        Row: Pastoral;
        Insert: Omit<Pastoral, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Pastoral>;
      };
      communities: {
        Row: Community;
        Insert: Omit<Community, 'created_at' | 'updated_at' | 'members_count' | 'posts_count'> & { created_at?: string; updated_at?: string; members_count?: number; posts_count?: number };
        Update: Partial<Community>;
      };
      community_members: {
        Row: CommunityMember;
        Insert: Omit<CommunityMember, 'joined_at'> & { joined_at?: string };
        Update: Partial<CommunityMember>;
      };
      posts: {
        Row: Post;
        Insert: Omit<Post, 'created_at' | 'updated_at' | 'likes_count' | 'comments_count' | 'shares_count'> & { created_at?: string; updated_at?: string; likes_count?: number; comments_count?: number; shares_count?: number };
        Update: Partial<Post>;
      };
      post_media: {
        Row: PostMedia;
        Insert: Omit<PostMedia, 'created_at'> & { created_at?: string };
        Update: Partial<PostMedia>;
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, 'created_at' | 'updated_at' | 'likes_count'> & { created_at?: string; updated_at?: string; likes_count?: number };
        Update: Partial<Comment>;
      };
      post_reactions: {
        Row: PostReaction;
        Insert: Omit<PostReaction, 'created_at'> & { created_at?: string };
        Update: Partial<PostReaction>;
      };
      post_shares: {
        Row: PostShare;
        Insert: Omit<PostShare, 'created_at'> & { created_at?: string };
        Update: Partial<PostShare>;
      };
      saved_posts: {
        Row: SavedPost;
        Insert: Omit<SavedPost, 'created_at'> & { created_at?: string };
        Update: Partial<SavedPost>;
      };
      followers: {
        Row: Follower;
        Insert: Omit<Follower, 'created_at'> & { created_at?: string };
        Update: Partial<Follower>;
      };
      blocks: {
        Row: Block;
        Insert: Omit<Block, 'created_at'> & { created_at?: string };
        Update: Partial<Block>;
      };
      reports: {
        Row: Report;
        Insert: Omit<Report, 'created_at'> & { created_at?: string };
        Update: Partial<Report>;
      };
      events: {
        Row: Event;
        Insert: Omit<Event, 'created_at' | 'updated_at' | 'attendees_count'> & { created_at?: string; updated_at?: string; attendees_count?: number };
        Update: Partial<Event>;
      };
      event_attendees: {
        Row: EventAttendee;
        Insert: Omit<EventAttendee, 'created_at'> & { created_at?: string };
        Update: Partial<EventAttendee>;
      };
      prayer_intentions: {
        Row: PrayerIntention;
        Insert: Omit<PrayerIntention, 'created_at' | 'updated_at' | 'prayers_count'> & { created_at?: string; updated_at?: string; prayers_count?: number };
        Update: Partial<PrayerIntention>;
      };
      prayer_supports: {
        Row: PrayerSupport;
        Insert: Omit<PrayerSupport, 'created_at'> & { created_at?: string };
        Update: Partial<PrayerSupport>;
      };
      conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Conversation>;
      };
      conversation_members: {
        Row: ConversationMember;
        Insert: Omit<ConversationMember, 'joined_at'> & { joined_at?: string };
        Update: Partial<ConversationMember>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Message>;
      };
      message_reads: {
        Row: MessageRead;
        Insert: MessageRead;
        Update: Partial<MessageRead>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'created_at'> & { created_at?: string };
        Update: Partial<Notification>;
      };
      verification_requests: {
        Row: VerificationRequest;
        Insert: Omit<VerificationRequest, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<VerificationRequest>;
      };
      moderation_actions: {
        Row: ModerationAction;
        Insert: Omit<ModerationAction, 'created_at'> & { created_at?: string };
        Update: Partial<ModerationAction>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'created_at'> & { created_at?: string };
        Update: Partial<AuditLog>;
      };
      media: {
        Row: Media;
        Insert: Omit<Media, 'created_at'> & { created_at?: string };
        Update: Partial<Media>;
      };
    };
    Functions: {
      get_user_roles: {
        Args: { p_user_id: string };
        Returns: UserRole[];
      };
      get_feed_posts: {
        Args: { p_user_id: string; p_cursor?: string; p_limit?: number };
        Returns: Post[];
      };
    };
    Enums: {
      user_role: UserRole;
      post_visibility: PostVisibility;
      community_type: CommunityType;
      event_type: EventType;
      event_status: EventStatus;
      event_attendee_status: EventAttendeeStatus;
      reaction_type: ReactionType;
      report_reason: ReportReason;
      report_status: ReportStatus;
      notification_type: NotificationType;
      prayer_visibility: PrayerVisibility;
      media_type: MediaType;
      verification_status: VerificationStatus;
    };
  };
}
