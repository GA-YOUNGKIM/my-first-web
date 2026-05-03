# Supabase Setup

This project is prepared to move from file-backed data to Supabase, but the external project still needs to be created manually.

## What to create in Supabase

1. Create a new Supabase project in the dashboard.
2. Copy the project URL and anon key.
3. Open the SQL editor and run [supabase/schema.sql](supabase/schema.sql).
4. Confirm that `profiles`, `posts`, and `comments` exist and that RLS is enabled.

## Environment Variables

Create a local `.env.local` file in the project root with these values:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

## Current implementation note

The app currently uses file-backed JSON storage for posts and comments. Once Supabase is ready, swap the repository layer and keep the page structure and server actions as-is.

## Related files

- [supabase/schema.sql](supabase/schema.sql)
- [supabase/README.md](supabase/README.md)
- [lib/supabase/server.ts](lib/supabase/server.ts)
- [lib/supabase/client.ts](lib/supabase/client.ts)
