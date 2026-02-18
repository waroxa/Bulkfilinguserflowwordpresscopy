# FOLDER RENAME INSTRUCTIONS

The edge function folder needs to be renamed from `/supabase/functions/server/` to `/supabase/functions/make-server-2c01e603/`

## Steps to rename:

1. In your local development environment or Supabase dashboard:
   - Navigate to `/supabase/functions/`
   - Rename the `server` folder to `make-server-2c01e603`

2. The folder should contain these files:
   - `index.tsx`
   - `kv_store.tsx`  
   - `payments.tsx`

3. After renaming, redeploy the function

## Alternative: Keep folder as 'server' and update deployment

If you prefer to keep the folder named `server`, you need to ensure Supabase deploys it with that name, and then update SERVER_URL to:
```
export const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/server/make-server-2c01e603`;
```

This would mean the routes have the prefix built into the URL path.
