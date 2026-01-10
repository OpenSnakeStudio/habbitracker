-- Add public read policies for leaderboard functionality
-- Allow anyone to view profiles that are public (for leaderboard)
CREATE POLICY "Anyone can view public profiles" 
ON public.profiles 
FOR SELECT 
USING (is_public = true OR auth.uid() = user_id);

-- Allow anyone to view user_stars for leaderboard
DROP POLICY IF EXISTS "Users can view their own stars" ON public.user_stars;
CREATE POLICY "Anyone can view stars for leaderboard" 
ON public.user_stars 
FOR SELECT 
USING (true);

-- Update profiles policy to allow viewing all for leaderboard  
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view profiles for leaderboard" 
ON public.profiles 
FOR SELECT 
USING (true);