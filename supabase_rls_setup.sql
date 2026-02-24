-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) SETUP FOR SIGNIFIYA APP
-- ============================================================================
-- Run this SQL in your Supabase SQL Editor to enable RLS and protect user data
-- ============================================================================

-- 1. Enable RLS on the 'user' table
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;

-- 2. Users can only see their own profile
CREATE POLICY "Users can view their own profile" ON "user"
FOR SELECT USING (auth.uid()::text = id);

-- 3. Users can only update their own profile
CREATE POLICY "Users can update their own profile" ON "user"
FOR UPDATE USING (auth.uid()::text = id)
WITH CHECK (auth.uid()::text = id);

-- 5. Enable RLS on visitor_registration table
ALTER TABLE "visitor_registration" ENABLE ROW LEVEL SECURITY;

-- 6. Users can only see their own visitor registrations (via userId)
CREATE POLICY "Users can view their own visitor registrations" ON "visitor_registration"
FOR SELECT USING (
  auth.uid()::text = "userId" 
  OR email = auth.jwt() ->> 'email'
);

-- 7. Users can only insert their own visitor registrations
CREATE POLICY "Users can insert their own visitor registrations" ON "visitor_registration"
FOR INSERT WITH CHECK (
  auth.uid()::text = "userId" 
  AND email = auth.jwt() ->> 'email'
);

-- 8. Users can only update their own visitor registrations
CREATE POLICY "Users can update their own visitor registrations" ON "visitor_registration"
FOR UPDATE USING (
  auth.uid()::text = "userId" 
  AND email = auth.jwt() ->> 'email'
)
WITH CHECK (
  auth.uid()::text = "userId" 
  AND email = auth.jwt() ->> 'email'
);

-- 9. Enable RLS on participant_team table
ALTER TABLE "participant_team" ENABLE ROW LEVEL SECURITY;

-- 10. Users can only see team registrations they lead (via userId or email)
CREATE POLICY "Users can view their own team registrations" ON "participant_team"
FOR SELECT USING (
  auth.uid()::text = "leaderUserId"
  OR leaderEmail = auth.jwt() ->> 'email'
);

-- 11. Users can only insert their own team registrations
CREATE POLICY "Users can insert their own team registrations" ON "participant_team"
FOR INSERT WITH CHECK (
  auth.uid()::text = "leaderUserId"
  AND leaderEmail = auth.jwt() ->> 'email'
);

-- 12. Users can only update their own team registrations
CREATE POLICY "Users can update their own team registrations" ON "participant_team"
FOR UPDATE USING (
  auth.uid()::text = "leaderUserId"
  AND leaderEmail = auth.jwt() ->> 'email'
)
WITH CHECK (
  auth.uid()::text = "leaderUserId"
  AND leaderEmail = auth.jwt() ->> 'email'
);

-- 12. Enable RLS on participant_team_member table
ALTER TABLE "participant_team_member" ENABLE ROW LEVEL SECURITY;

-- 13. Members can be viewed only if user is the team leader
CREATE POLICY "Users can view team members of their own team" ON "participant_team_member"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "participant_team"
    WHERE "participant_team".id = "participant_team_member"."teamId"
    AND "participant_team"."leaderEmail" = auth.jwt() ->> 'email'
  )
);

-- 14. Enable RLS on pass table
ALTER TABLE "pass" ENABLE ROW LEVEL SECURITY;

-- 15. Users can only see their own passes
CREATE POLICY "Users can view their own passes" ON "pass"
FOR SELECT USING (auth.uid()::text = "userId");

-- 16. Enable RLS on session table
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;

-- 17. Users can only see their own sessions
CREATE POLICY "Users can view their own sessions" ON "session"
FOR SELECT USING (auth.uid()::text = "userId");

-- 18. Enable RLS on account table
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;

-- 19. Users can only see their own accounts
CREATE POLICY "Users can view their own accounts" ON "account"
FOR SELECT USING (auth.uid()::text = "userId");

-- ============================================================================
-- IMPORTANT NOTES:
-- ============================================================================
-- 1. Always ensure auth.uid() is populated in your auth headers
-- 2. The Supabase client must include auth tokens in requests
-- 3. Test RLS policies in Supabase before deploying
-- 4. Admins can bypass RLS with service_role key (use carefully!)
-- ============================================================================
