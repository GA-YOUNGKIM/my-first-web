-- Ch11 posts RLS policies
-- Note: Drop existing policies first to avoid duplicate policy name errors on re-apply.

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS posts_select_public_read ON public.posts;
CREATE POLICY posts_select_public_read
ON public.posts
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS posts_insert_authenticated_owner_only ON public.posts;
CREATE POLICY posts_insert_authenticated_owner_only
ON public.posts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS posts_update_authenticated_owner_only ON public.posts;
CREATE POLICY posts_update_authenticated_owner_only
ON public.posts
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS posts_delete_authenticated_owner_only ON public.posts;
CREATE POLICY posts_delete_authenticated_owner_only
ON public.posts
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
