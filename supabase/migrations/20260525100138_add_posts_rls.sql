-- 기존 정책이 있으면 먼저 삭제해서 중복 생성을 방지합니다.
DROP POLICY IF EXISTS posts_select_public_read ON posts;
DROP POLICY IF EXISTS posts_insert_authenticated_owner_only ON posts;
DROP POLICY IF EXISTS posts_update_authenticated_owner_only ON posts;
DROP POLICY IF EXISTS posts_delete_authenticated_owner_only ON posts;

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY posts_select_public_read
ON posts
FOR SELECT
TO public
USING (true);

CREATE POLICY posts_insert_authenticated_owner_only
ON posts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY posts_update_authenticated_owner_only
ON posts
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY posts_delete_authenticated_owner_only
ON posts
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
