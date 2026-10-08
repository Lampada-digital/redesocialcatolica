-- ============================================
-- COMMUNIO - REDE SOCIAL CATÓLICA
-- Migration 001: Initial Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('USER', 'MODERATOR', 'ADMIN', 'PARISH_ADMIN', 'DIOCESE_ADMIN', 'PRIEST');
CREATE TYPE post_visibility AS ENUM ('PUBLIC', 'FRIENDS', 'FOLLOWERS', 'PRIVATE', 'COMMUNITY');
CREATE TYPE community_type AS ENUM ('PUBLIC', 'PRIVATE', 'SECRET');
CREATE TYPE event_type AS ENUM ('MISSA', 'TERCO', 'ADORACAO', 'RETIRIO', 'CATEQUESE', 'ENCONTRO', 'FORMACAO', 'FESTA', 'OUTRO');
CREATE TYPE event_status AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');
CREATE TYPE event_attendee_status AS ENUM ('GOING', 'INTERESTED', 'NOT_GOING');
CREATE TYPE reaction_type AS ENUM ('LIKE', 'AMEN', 'PRAY', 'LOVE');
CREATE TYPE report_reason AS ENUM ('SPAM', 'HARASSMENT', 'HATE', 'SEXUAL_CONTENT', 'VIOLENCE', 'SCAM', 'MISINFORMATION', 'IMPERSONATION', 'OTHER');
CREATE TYPE report_status AS ENUM ('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED');
CREATE TYPE notification_type AS ENUM ('FRIEND_REQUEST', 'FRIEND_ACCEPTED', 'POST_LIKE', 'POST_COMMENT', 'COMMENT_REPLY', 'NEW_FOLLOWER', 'COMMUNITY_INVITE', 'EVENT_REMINDER', 'MESSAGE', 'PRAYER_SUPPORT', 'SYSTEM');
CREATE TYPE prayer_visibility AS ENUM ('PUBLIC', 'FRIENDS', 'PRIVATE');
CREATE TYPE media_type AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT');
CREATE TYPE verification_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- ============================================
-- PROFILES
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  cover_url TEXT,
  bio TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'Brasil',
  patron_saint TEXT,
  parish_id UUID,
  diocese_id UUID,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_badge TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT display_name_length CHECK (char_length(display_name) >= 1 AND char_length(display_name) <= 100)
);

CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_is_verified ON profiles(is_verified);

-- ============================================
-- USER ROLES
-- ============================================

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'USER',
  entity_type TEXT,
  entity_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role, entity_type, entity_id)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);

-- ============================================
-- DIOCESES
-- ============================================

CREATE TABLE dioceses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bishop_name TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT DEFAULT 'Brasil',
  website TEXT,
  description TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dioceses_slug ON dioceses(slug);
CREATE INDEX idx_dioceses_city ON dioceses(city);

-- ============================================
-- PARISHES
-- ============================================

CREATE TABLE parishes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diocese_id UUID NOT NULL REFERENCES dioceses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT DEFAULT 'Brasil',
  phone TEXT,
  website TEXT,
  email TEXT,
  mass_schedule JSONB,
  description TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_parishes_slug ON parishes(slug);
CREATE INDEX idx_parishes_diocese_id ON parishes(diocese_id);
CREATE INDEX idx_parishes_city ON parishes(city);
CREATE INDEX idx_parishes_is_verified ON parishes(is_verified);

-- Add foreign key for profiles.parish_id
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_parish FOREIGN KEY (parish_id) REFERENCES parishes(id) ON DELETE SET NULL;
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_diocese FOREIGN KEY (diocese_id) REFERENCES dioceses(id) ON DELETE SET NULL;

-- ============================================
-- PASTORALS
-- ============================================

CREATE TABLE pastorals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parish_id UUID NOT NULL REFERENCES parishes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  coordinator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pastorals_parish_id ON pastorals(parish_id);

-- ============================================
-- COMMUNITIES
-- ============================================

CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  type community_type NOT NULL DEFAULT 'PUBLIC',
  category TEXT,
  rules TEXT,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parish_id UUID REFERENCES parishes(id) ON DELETE SET NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  members_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_communities_slug ON communities(slug);
CREATE INDEX idx_communities_type ON communities(type);
CREATE INDEX idx_communities_category ON communities(category);
CREATE INDEX idx_communities_creator_id ON communities(creator_id);

-- ============================================
-- COMMUNITY MEMBERS
-- ============================================

CREATE TABLE community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('MEMBER', 'MODERATOR', 'ADMIN')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

CREATE INDEX idx_community_members_community_id ON community_members(community_id);
CREATE INDEX idx_community_members_user_id ON community_members(user_id);

-- ============================================
-- POSTS
-- ============================================

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  visibility post_visibility NOT NULL DEFAULT 'PUBLIC',
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT content_length CHECK (char_length(content) > 0 AND char_length(content) <= 5000)
);

CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_community_id ON posts(community_id);
CREATE INDEX idx_posts_visibility ON posts(visibility);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- ============================================
-- POST MEDIA
-- ============================================

CREATE TABLE post_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type media_type NOT NULL DEFAULT 'IMAGE',
  mime_type TEXT,
  size INTEGER,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_post_media_post_id ON post_media(post_id);

-- ============================================
-- COMMENTS
-- ============================================

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT comment_content_length CHECK (char_length(content) > 0 AND char_length(content) <= 2000)
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- ============================================
-- POST REACTIONS
-- ============================================

CREATE TABLE post_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type reaction_type NOT NULL DEFAULT 'LIKE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id, reaction_type)
);

CREATE INDEX idx_post_reactions_post_id ON post_reactions(post_id);
CREATE INDEX idx_post_reactions_user_id ON post_reactions(user_id);

-- ============================================
-- POST SHARES
-- ============================================

CREATE TABLE post_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  shared_to TEXT NOT NULL CHECK (shared_to IN ('FEED', 'COMMUNITY', 'EXTERNAL')),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_post_shares_post_id ON post_shares(post_id);
CREATE INDEX idx_post_shares_user_id ON post_shares(user_id);

-- ============================================
-- SAVED POSTS
-- ============================================

CREATE TABLE saved_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

CREATE INDEX idx_saved_posts_user_id ON saved_posts(user_id);

-- ============================================
-- FOLLOWERS
-- ============================================

CREATE TABLE followers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

CREATE INDEX idx_followers_follower_id ON followers(follower_id);
CREATE INDEX idx_followers_following_id ON followers(following_id);

-- ============================================
-- BLOCKS
-- ============================================

CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id),
  CONSTRAINT no_self_block CHECK (blocker_id != blocked_id)
);

CREATE INDEX idx_blocks_blocker_id ON blocks(blocker_id);
CREATE INDEX idx_blocks_blocked_id ON blocks(blocked_id);

-- ============================================
-- REPORTS
-- ============================================

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('USER', 'POST', 'COMMENT', 'COMMUNITY', 'MESSAGE')),
  target_id UUID NOT NULL,
  reason report_reason NOT NULL,
  description TEXT,
  status report_status NOT NULL DEFAULT 'PENDING',
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_target ON reports(target_type, target_id);

-- ============================================
-- EVENTS
-- ============================================

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  location TEXT,
  address TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  organizer_id UUID NOT NULL,
  organizer_type TEXT NOT NULL CHECK (organizer_type IN ('USER', 'PARISH', 'DIOCESE', 'COMMUNITY')),
  type event_type NOT NULL,
  visibility post_visibility NOT NULL DEFAULT 'PUBLIC',
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  parish_id UUID REFERENCES parishes(id) ON DELETE SET NULL,
  capacity INTEGER,
  status event_status NOT NULL DEFAULT 'UPCOMING',
  cover_url TEXT,
  attendees_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT title_length CHECK (char_length(title) >= 3 AND char_length(title) <= 200)
);

CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_organizer ON events(organizer_id, organizer_type);
CREATE INDEX idx_events_start_at ON events(start_at);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_status ON events(status);

-- ============================================
-- EVENT ATTENDEES
-- ============================================

CREATE TABLE event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status event_attendee_status NOT NULL DEFAULT 'INTERESTED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

CREATE INDEX idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX idx_event_attendees_user_id ON event_attendees(user_id);

-- ============================================
-- PRAYER INTENTIONS
-- ============================================

CREATE TABLE prayer_intentions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  category TEXT,
  visibility prayer_visibility NOT NULL DEFAULT 'PUBLIC',
  prayers_count INTEGER DEFAULT 0,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT prayer_content_length CHECK (char_length(content) > 0 AND char_length(content) <= 1000)
);

CREATE INDEX idx_prayer_intentions_author_id ON prayer_intentions(author_id);
CREATE INDEX idx_prayer_intentions_visibility ON prayer_intentions(visibility);
CREATE INDEX idx_prayer_intentions_created_at ON prayer_intentions(created_at DESC);

-- ============================================
-- PRAYER SUPPORTS
-- ============================================

CREATE TABLE prayer_supports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  intention_id UUID NOT NULL REFERENCES prayer_intentions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(intention_id, user_id)
);

CREATE INDEX idx_prayer_supports_intention_id ON prayer_supports(intention_id);
CREATE INDEX idx_prayer_supports_user_id ON prayer_supports(user_id);

-- ============================================
-- CONVERSATIONS
-- ============================================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  is_group BOOLEAN DEFAULT FALSE,
  group_name TEXT,
  group_avatar_url TEXT,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONVERSATION MEMBERS
-- ============================================

CREATE TABLE conversation_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('MEMBER', 'ADMIN')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,
  UNIQUE(conversation_id, user_id)
);

CREATE INDEX idx_conversation_members_conversation_id ON conversation_members(conversation_id);
CREATE INDEX idx_conversation_members_user_id ON conversation_members(user_id);

-- ============================================
-- MESSAGES
-- ============================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_url TEXT,
  media_type media_type,
  reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT message_content_length CHECK (char_length(content) > 0 AND char_length(content) <= 5000)
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- ============================================
-- MESSAGE READS
-- ============================================

CREATE TABLE message_reads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

CREATE INDEX idx_message_reads_message_id ON message_reads(message_id);
CREATE INDEX idx_message_reads_user_id ON message_reads(user_id);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  from_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  entity_type TEXT,
  entity_id UUID,
  content TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- VERIFICATION REQUESTS
-- ============================================

CREATE TABLE verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('PROFILE', 'PARISH', 'DIOCESE', 'COMMUNITY')),
  entity_id UUID NOT NULL,
  documents JSONB,
  status verification_status NOT NULL DEFAULT 'PENDING',
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_verification_requests_user_id ON verification_requests(user_id);
CREATE INDEX idx_verification_requests_status ON verification_requests(status);

-- ============================================
-- MODERATION ACTIONS
-- ============================================

CREATE TABLE moderation_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  moderator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('REMOVE_CONTENT', 'BAN_USER', 'WARN_USER', 'UNBAN_USER', 'VERIFY_ENTITY', 'REJECT_VERIFICATION')),
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  reason TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_moderation_actions_moderator_id ON moderation_actions(moderator_id);
CREATE INDEX idx_moderation_actions_target ON moderation_actions(target_type, target_id);

-- ============================================
-- AUDIT LOGS
-- ============================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================
-- MEDIA
-- ============================================

CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type media_type NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_media_user_id ON media(user_id);
CREATE INDEX idx_media_type ON media(type);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to get user roles
CREATE OR REPLACE FUNCTION get_user_roles(p_user_id UUID)
RETURNS user_role[] AS $$
BEGIN
  RETURN ARRAY(SELECT role FROM user_roles WHERE user_id = p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dioceses_updated_at BEFORE UPDATE ON dioceses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parishes_updated_at BEFORE UPDATE ON parishes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pastorals_updated_at BEFORE UPDATE ON pastorals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON communities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prayer_intentions_updated_at BEFORE UPDATE ON prayer_intentions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_verification_requests_updated_at BEFORE UPDATE ON verification_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Assign default USER role
  INSERT INTO user_roles (user_id, role)
  VALUES (NEW.id, 'USER');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update post reaction counts
CREATE OR REPLACE FUNCTION update_post_reaction_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_reaction_change
  AFTER INSERT OR DELETE ON post_reactions
  FOR EACH ROW EXECUTE FUNCTION update_post_reaction_count();

-- Function to update comment count
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_comment_change
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- Function to update community member count
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE communities SET members_count = members_count + 1 WHERE id = NEW.community_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE communities SET members_count = GREATEST(0, members_count - 1) WHERE id = OLD.community_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_community_member_change
  AFTER INSERT OR DELETE ON community_members
  FOR EACH ROW EXECUTE FUNCTION update_community_member_count();

-- Function to update prayer support count
CREATE OR REPLACE FUNCTION update_prayer_support_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE prayer_intentions SET prayers_count = prayers_count + 1 WHERE id = NEW.intention_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE prayer_intentions SET prayers_count = GREATEST(0, prayers_count - 1) WHERE id = OLD.intention_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_prayer_support_change
  AFTER INSERT OR DELETE ON prayer_supports
  FOR EACH ROW EXECUTE FUNCTION update_prayer_support_count();

-- Function to update event attendee count
CREATE OR REPLACE FUNCTION update_event_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'GOING' THEN
      UPDATE events SET attendees_count = attendees_count + 1 WHERE id = NEW.event_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.status = 'GOING' THEN
      UPDATE events SET attendees_count = GREATEST(0, attendees_count - 1) WHERE id = OLD.event_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'GOING' AND NEW.status = 'GOING' THEN
      UPDATE events SET attendees_count = attendees_count + 1 WHERE id = NEW.event_id;
    ELSIF OLD.status = 'GOING' AND NEW.status != 'GOING' THEN
      UPDATE events SET attendees_count = GREATEST(0, attendees_count - 1) WHERE id = NEW.event_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_event_attendee_change
  AFTER INSERT OR DELETE OR UPDATE ON event_attendees
  FOR EACH ROW EXECUTE FUNCTION update_event_attendee_count();

-- Function to update conversation last_message_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations SET last_message_at = NEW.created_at, updated_at = NOW() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_message_created
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();
