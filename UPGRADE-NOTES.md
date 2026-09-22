# KHANG Portfolio v2 - in-place Next.js CMS migration

This repository was migrated in-place from React/Vite to Next.js App Router while preserving the existing public CSS and public assets.

## Required Supabase setup

1. Open Supabase -> SQL Editor.
2. Run `supabase/schema.sql`.
3. Open Authentication -> Users and create the admin account.
4. Copy the user's UUID.
5. Run:

```sql
insert into public.admin_users (user_id, display_name)
values ('PASTE_AUTH_USER_UUID_HERE', 'Khang Admin');
```

6. Visit `/admin/login` and sign in.
7. On the dashboard click **Initialize / reset default content** once.

## Cloudinary

Fill these server-only values in `.env.local` and in Vercel Environment Variables:

- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Never expose the API secret with a `NEXT_PUBLIC_` prefix.

## Vercel variables

Add the same `.env.local` variables in Vercel -> Project -> Settings -> Environment Variables, then redeploy.
