-- ============================================
-- COMMUNIO - Row Level Security Policies
-- Migration 002: RLS Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dioceses ENABLE ROW LEVEL SECURITY;
ALTER TABLE parishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pastorals ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_intentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_supports ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = p_user_id AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is moderator
CREATE OR REPLACE FUNCTION is_moderator(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = p_user_id AND role IN ('ADMIN', 'MODERATOR')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is blocked by another user
CREATE OR REPLACE FUNCTION is_blocked(p_user_id UUID, p_other_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM blocks
    WHERE (blocker_id = p_user_id AND blocked_id = p_other_user_id)
       OR (blocker_id = p_other_user_id AND blocked_id = p_user_id)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user follows another user
CREATE OR REPLACE FUNCTION is_following(p_follower_id UUID, p_following_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM followers
    WHERE follower_id = p_follower_id AND following_id = p_following_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is member of community
CREATE OR REPLACE FUNCTION is_community_member(p_user_id UUID, p_community_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM community_members
    WHERE user_id = p_user_id AND community_id = p_community_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is member of conversation
CREATE OR REPLACE FUNCTION is_conversation_member(p_user_id UUID, p_conversation_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM conversation_members
    WHERE user_id = p_user_id AND conversation_id = p_conversation_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PROFILES
-- ============================================

-- Everyone can view profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (handled by trigger, but just in case)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- USER ROLES
-- ============================================

-- Everyone can view roles
CREATE POLICY "User roles are viewable by everyone"
  ON user_roles FOR SELECT
  USING (true);

-- Only admins can manage roles
CREATE POLICY "Only admins can manage roles"
  ON user_roles FOR ALL
  USING (is_admin(auth.uid()));

-- ============================================
-- DIOCESES
-- ============================================

-- Everyone can view dioceses
CREATE POLICY "Dioceses are viewable by everyone"
  ON dioceses FOR SELECT
  USING (true);

-- Only admins and diocese admins can manage dioceses
CREATE POLICY "Admins can manage dioceses"
  ON dioceses FOR ALL
  USING (
    is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'DIOCESE_ADMIN'
    )
  );

-- ============================================
-- PARISHES
-- ============================================

-- Everyone can view parishes
CREATE POLICY "Parishes are viewable by everyone"
  ON parishes FOR SELECT
  USING (true);

-- Only admins and parish admins can manage parishes
CREATE POLICY "Admins can manage parishes"
  ON parishes FOR ALL
  USING (
    is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'PARISH_ADMIN'
    )
  );

-- ============================================
-- PASTORALS
-- ============================================

-- Everyone can view pastorals
CREATE POLICY "Pastorals are viewable by everyone"
  ON pastorals FOR SELECT
  USING (true);

-- Parish admins and admins can manage pastorals
CREATE POLICY "Admins can manage pastorals"
  ON pastorals FOR ALL
  USING (
    is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN parishes p ON p.id = ur.entity_id
      WHERE ur.user_id = auth.uid() 
        AND ur.role = 'PARISH_ADMIN'
        AND p.id = pastorals.parish_id
    )
  );

-- ============================================
-- COMMUNITIES
-- ============================================

-- Public communities are viewable by everyone
-- Private/secret communities only by members
CREATE POLICY "Communities visibility"
  ON communities FOR SELECT
  USING (
    type = 'PUBLIC' OR
    is_community_member(auth.uid(), id) OR
    is_admin(auth.uid())
  );

-- Anyone can create communities
CREATE POLICY "Users can create communities"
  ON communities FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Only creator or admins can update communities
CREATE POLICY "Creators can update communities"
  ON communities FOR UPDATE
  USING (
    auth.uid() = creator_id OR
    is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM community_members
      WHERE user_id = auth.uid() 
        AND community_id = communities.id 
        AND role = 'ADMIN'
    )
  );

-- Only creator or admins can delete communities
CREATE POLICY "Creators can delete communities"
  ON communities FOR DELETE
  USING (
    auth.uid() = creator_id OR
    is_admin(auth.uid())
  );

-- ============================================
-- COMMUNITY MEMBERS
-- ============================================

-- Members can view community members
CREATE POLICY "Members can view community members"
  ON community_members FOR SELECT
  USING (
    is_community_member(auth.uid(), community_id) OR
    EXISTS (SELECT 1 FROM communities WHERE id = community_members.community_id AND type = 'PUBLIC') OR
    is_admin(auth.uid())
  );

-- Users can join public communities
CREATE POLICY "Users can join communities"
  ON community_members FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    (
      EXISTS (SELECT 1 FROM communities WHERE id = community_members.community_id AND type = 'PUBLIC') OR
      is_admin(auth.uid())
    )
  );

-- Users can leave communities
CREATE POLICY "Users can leave communities"
  ON community_members FOR DELETE
  USING (auth.uid() = user_id);

-- Community admins can manage members
CREATE POLICY "Community admins can manage members"
  ON community_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.user_id = auth.uid() 
        AND cm.community_id = community_members.community_id 
        AND cm.role IN ('ADMIN', 'MODERATOR')
    ) OR
    is_admin(auth.uid())
  );

-- ============================================
-- POSTS
-- ============================================

-- Public posts visible to everyone
-- Friends-only visible to friends
-- Private only to author
CREATE POLICY "Posts visibility"
  ON posts FOR SELECT
  USING (
    visibility = 'PUBLIC' OR
    (visibility = 'FRIENDS' AND (
      author_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM followers
        WHERE (follower_id = auth.uid() AND following_id = posts.author_id)
           OR (follower_id = posts.author_id AND following_id = auth.uid())
      )
    )) OR
    (visibility = 'FOLLOWERS' AND (
      author_id = auth.uid() OR
      is_following(auth.uid(), posts.author_id)
    )) OR
    (visibility = 'COMMUNITY' AND (
      is_community_member(auth.uid(), community_id) OR
      is_admin(auth.uid())
    )) OR
    (visibility = 'PRIVATE' AND author_id = auth.uid()) OR
    is_admin(auth.uid())
  );

-- Authenticated users can create posts
CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id OR is_admin(auth.uid()));

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = author_id OR is_admin(auth.uid()));

-- ============================================
-- POST MEDIA
-- ============================================

-- Media follows post visibility
CREATE POLICY "Post media follows post visibility"
  ON post_media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE id = post_media.post_id 
      AND (
        visibility = 'PUBLIC' OR
        author_id = auth.uid() OR
        is_admin(auth.uid())
      )
    )
  );

-- Users can manage media on their own posts
CREATE POLICY "Users can manage own post media"
  ON post_media FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE id = post_media.post_id AND author_id = auth.uid()
    ) OR
    is_admin(auth.uid())
  );

-- ============================================
-- COMMENTS
-- ============================================

-- Comments follow post visibility
CREATE POLICY "Comments follow post visibility"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE id = comments.post_id
      AND (
        visibility = 'PUBLIC' OR
        author_id = auth.uid() OR
        is_admin(auth.uid())
      )
    )
  );

-- Authenticated users can create comments
CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = author_id OR is_admin(auth.uid()));

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = author_id OR is_admin(auth.uid()));

-- ============================================
-- POST REACTIONS
-- ============================================

-- Reactions follow post visibility
CREATE POLICY "Reactions follow post visibility"
  ON post_reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE id = post_reactions.post_id
      AND (
        visibility = 'PUBLIC' OR
        author_id = auth.uid() OR
        is_admin(auth.uid())
      )
    )
  );

-- Users can manage their own reactions
CREATE POLICY "Users can manage own reactions"
  ON post_reactions FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- POST SHARES
-- ============================================

-- Shares follow post visibility
CREATE POLICY "Shares follow post visibility"
  ON post_shares FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE id = post_shares.post_id
      AND (
        visibility = 'PUBLIC' OR
        author_id = auth.uid() OR
        is_admin(auth.uid())
      )
    )
  );

-- Users can create their own shares
CREATE POLICY "Users can create shares"
  ON post_shares FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own shares
CREATE POLICY "Users can delete own shares"
  ON post_shares FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- SAVED POSTS
-- ============================================

-- Users can only see their own saved posts
CREATE POLICY "Users can view own saved posts"
  ON saved_posts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can save posts
CREATE POLICY "Users can save posts"
  ON saved_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can unsave posts
CREATE POLICY "Users can unsave posts"
  ON saved_posts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FOLLOWERS
-- ============================================

-- Everyone can view followers
CREATE POLICY "Followers are viewable by everyone"
  ON followers FOR SELECT
  USING (true);

-- Users can follow others
CREATE POLICY "Users can follow"
  ON followers FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Users can unfollow
CREATE POLICY "Users can unfollow"
  ON followers FOR DELETE
  USING (auth.uid() = follower_id);

-- ============================================
-- BLOCKS
-- ============================================

-- Users can view their own blocks
CREATE POLICY "Users can view own blocks"
  ON blocks FOR SELECT
  USING (auth.uid() = blocker_id);

-- Users can block others
CREATE POLICY "Users can block"
  ON blocks FOR INSERT
  WITH CHECK (auth.uid() = blocker_id);

-- Users can unblock
CREATE POLICY "Users can unblock"
  ON blocks FOR DELETE
  USING (auth.uid() = blocker_id);

-- ============================================
-- REPORTS
-- ============================================

-- Users can view their own reports
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  USING (auth.uid() = reporter_id OR is_moderator(auth.uid()));

-- Users can create reports
CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Moderators can manage reports
CREATE POLICY "Moderators can manage reports"
  ON reports FOR ALL
  USING (is_moderator(auth.uid()));

-- ============================================
-- EVENTS
-- ============================================

-- Public events visible to everyone
CREATE POLICY "Events visibility"
  ON events FOR SELECT
  USING (
    visibility = 'PUBLIC' OR
    organizer_id = auth.uid() OR
    is_admin(auth.uid()) OR
    (visibility = 'COMMUNITY' AND is_community_member(auth.uid(), community_id))
  );

-- Users can create events
CREATE POLICY "Users can create events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = organizer_id OR is_admin(auth.uid()));

-- Organizers can update their events
CREATE POLICY "Organizers can update events"
  ON events FOR UPDATE
  USING (
    auth.uid() = organizer_id OR
    is_admin(auth.uid())
  );

-- Organizers can delete their events
CREATE POLICY "Organizers can delete events"
  ON events FOR DELETE
  USING (
    auth.uid() = organizer_id OR
    is_admin(auth.uid())
  );

-- ============================================
-- EVENT ATTENDEES
-- ============================================

-- Attendees visible to event viewers
CREATE POLICY "Event attendees visibility"
  ON event_attendees FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE id = event_attendees.event_id
      AND (
        visibility = 'PUBLIC' OR
        organizer_id = auth.uid() OR
        is_admin(auth.uid())
      )
    )
  );

-- Users can join events
CREATE POLICY "Users can join events"
  ON event_attendees FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their attendance
CREATE POLICY "Users can update attendance"
  ON event_attendees FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can leave events
CREATE POLICY "Users can leave events"
  ON event_attendees FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- PRAYER INTENTIONS
-- ============================================

-- Public intentions visible to everyone
CREATE POLICY "Prayer intentions visibility"
  ON prayer_intentions FOR SELECT
  USING (
    visibility = 'PUBLIC' OR
    author_id = auth.uid() OR
    is_admin(auth.uid())
  );

-- Users can create intentions
CREATE POLICY "Users can create intentions"
  ON prayer_intentions FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Users can update their own intentions
CREATE POLICY "Users can update own intentions"
  ON prayer_intentions FOR UPDATE
  USING (auth.uid() = author_id);

-- Users can delete their own intentions
CREATE POLICY "Users can delete own intentions"
  ON prayer_intentions FOR DELETE
  USING (auth.uid() = author_id OR is_admin(auth.uid()));

-- ============================================
-- PRAYER SUPPORTS
-- ============================================

-- Prayer supports visible to intention viewers
CREATE POLICY "Prayer supports visibility"
  ON prayer_supports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM prayer_intentions
      WHERE id = prayer_supports.intention_id
      AND (
        visibility = 'PUBLIC' OR
        author_id = auth.uid() OR
        is_admin(auth.uid())
      )
    )
  );

-- Users can support intentions
CREATE POLICY "Users can support intentions"
  ON prayer_supports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their support
CREATE POLICY "Users can remove support"
  ON prayer_supports FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CONVERSATIONS
-- ============================================

-- Only members can view conversations
CREATE POLICY "Members can view conversations"
  ON conversations FOR SELECT
  USING (is_conversation_member(auth.uid(), id) OR is_admin(auth.uid()));

-- Users can create conversations (they become members)
CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (true);

-- ============================================
-- CONVERSATION MEMBERS
-- ============================================

-- Members can view conversation members
CREATE POLICY "Members can view conversation members"
  ON conversation_members FOR SELECT
  USING (is_conversation_member(auth.uid(), conversation_id) OR is_admin(auth.uid()));

-- Users can join conversations (via invite or group)
CREATE POLICY "Users can join conversations"
  ON conversation_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can leave conversations
CREATE POLICY "Users can leave conversations"
  ON conversation_members FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- MESSAGES
-- ============================================

-- Only conversation members can view messages
CREATE POLICY "Members can view messages"
  ON messages FOR SELECT
  USING (is_conversation_member(auth.uid(), conversation_id));

-- Conversation members can send messages
CREATE POLICY "Members can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    is_conversation_member(auth.uid(), conversation_id)
  );

-- ============================================
-- MESSAGE READS
-- ============================================

-- Users can view their own reads
CREATE POLICY "Users can view own reads"
  ON message_reads FOR SELECT
  USING (auth.uid() = user_id);

-- Users can mark messages as read
CREATE POLICY "Users can mark as read"
  ON message_reads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- NOTIFICATIONS
-- ============================================

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- VERIFICATION REQUESTS
-- ============================================

-- Users can view their own requests
CREATE POLICY "Users can view own verification requests"
  ON verification_requests FOR SELECT
  USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Users can create verification requests
CREATE POLICY "Users can create verification requests"
  ON verification_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only admins can manage verification requests
CREATE POLICY "Admins can manage verification requests"
  ON verification_requests FOR ALL
  USING (is_admin(auth.uid()));

-- ============================================
-- MODERATION ACTIONS
-- ============================================

-- Only moderators and admins can view moderation actions
CREATE POLICY "Moderators can view moderation actions"
  ON moderation_actions FOR SELECT
  USING (is_moderator(auth.uid()));

-- Only moderators and admins can create moderation actions
CREATE POLICY "Moderators can create moderation actions"
  ON moderation_actions FOR INSERT
  WITH CHECK (is_moderator(auth.uid()));

-- ============================================
-- AUDIT LOGS
-- ============================================

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (is_admin(auth.uid()));

-- System can create audit logs (via triggers)
CREATE POLICY "System can create audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- ============================================
-- MEDIA
-- ============================================

-- Users can view their own media
CREATE POLICY "Users can view own media"
  ON media FOR SELECT
  USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Users can upload media
CREATE POLICY "Users can upload media"
  ON media FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own media
CREATE POLICY "Users can delete own media"
  ON media FOR DELETE
  USING (auth.uid() = user_id OR is_admin(auth.uid()));
