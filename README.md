# Image Gallery with Upload

A full-stack image gallery application built with Next.js, Tailwind CSS, and Supabase. Upload images with metadata including prompts, alt text, and tags, then view them in a beautiful responsive gallery.

## Features

- Upload images with metadata (prompt, alt text, tags)
- Responsive image gallery grid
- Modal viewer with full image display
- Copy prompt and image URL to clipboard
- Download images directly
- Client-side optimistic UI updates
- Form validation and error handling
- Dark theme with elegant design

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **UI Components**: shadcn/ui

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)

## Setup Instructions

### 1. Clone and Install

\`\`\`bash
npm install
\`\`\`

### 2. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up

#### Create the Database Table

1. In your Supabase dashboard, go to the SQL Editor
2. Run the SQL script from `scripts/01-create-images-table.sql`:

\`\`\`sql
-- Create images table for storing image metadata
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src TEXT NOT NULL,
  alt TEXT,
  prompt TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at DESC);

-- Enable Row Level Security
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON images
  FOR SELECT
  USING (true);

-- Create policy to allow public insert access
CREATE POLICY "Allow public insert access" ON images
  FOR INSERT
  WITH CHECK (true);
\`\`\`

#### Create the Storage Bucket

1. In your Supabase dashboard, go to Storage
2. Click "New bucket"
3. Name it `gallery`
4. Make it **public** (uncheck "Private bucket")
5. Click "Create bucket"

#### Configure Storage Policies

1. Click on the `gallery` bucket
2. Go to "Policies"
3. Add the following policies:

**Policy 1: Allow public uploads**
- Policy name: `Allow public uploads`
- Allowed operation: `INSERT`
- Target roles: `public`
- Policy definition: `true`

**Policy 2: Allow public reads**
- Policy name: `Allow public reads`
- Allowed operation: `SELECT`
- Target roles: `public`
- Policy definition: `true`

### 3. Configure Environment Variables

1. In your Supabase dashboard, go to Project Settings > API
2. Copy your project URL and anon/public key
3. Create a `.env.local` file in the root of your project:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

Replace the values with your actual Supabase credentials.

### 4. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your gallery.

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   └── upload/
│   │       └── route.ts          # Upload API endpoint
│   ├── gallery/
│   │   └── page.tsx              # Gallery page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── gallery-grid.tsx          # Gallery grid component
│   ├── image-modal.tsx           # Image modal viewer
│   └── upload-form.tsx           # Upload form component
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   └── server.ts             # Server Supabase client
│   └── types.ts                  # TypeScript types
└── scripts/
    └── 01-create-images-table.sql # Database schema
\`\`\`

## Database Schema

The `images` table has the following structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `src` | TEXT | Image URL from Supabase Storage |
| `alt` | TEXT | Alt text for accessibility (optional) |
| `prompt` | TEXT | Generation prompt or description (optional) |
| `tags` | TEXT[] | Array of tags (optional) |
| `created_at` | TIMESTAMPTZ | Upload timestamp (auto-generated) |

## API Routes

### POST /api/upload

Upload an image with metadata.

**Request Body (FormData):**
- `file`: Image file (required, max 5MB)
- `prompt`: Image prompt/description (optional)
- `alt`: Alt text (optional)
- `tags`: Comma-separated tags (optional)

**Response:**
\`\`\`json
{
  "success": true,
  "image": {
    "id": "uuid",
    "src": "https://...",
    "alt": "...",
    "prompt": "...",
    "tags": ["tag1", "tag2"],
    "created_at": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add your environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

Your gallery will be live at `your-project.vercel.app`

## Features in Detail

### Upload Form
- Drag and drop or click to upload
- Image preview before upload
- Client-side validation (file type, size)
- Optimistic UI updates
- Error handling with user feedback

### Gallery Grid
- Responsive grid layout (1-4 columns based on screen size)
- Hover effects with image scaling
- Prompt preview on hover
- Click to open modal viewer

### Image Modal
- Full-size image display
- View prompt and tags
- Copy prompt to clipboard
- Copy image URL to clipboard
- Download image
- Keyboard navigation (ESC to close)

## Customization

### Change Theme Colors

Edit `app/globals.css` to customize the color scheme. The app uses CSS variables for theming.

### Adjust Upload Limits

Edit `app/api/upload/route.ts` to change:
- Maximum file size (default: 5MB)
- Allowed file types (default: all images)

### Modify Gallery Layout

Edit `components/gallery-grid.tsx` to change:
- Grid columns: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Image aspect ratio: `aspect-square`
- Gap between images: `gap-4`

## Troubleshooting

### Images not uploading
- Check that the `gallery` bucket exists and is public
- Verify storage policies allow public uploads
- Check browser console for errors

### Images not displaying
- Verify the `images` table exists
- Check RLS policies allow public reads
- Ensure environment variables are set correctly

### Database errors
- Make sure you ran the SQL script to create the table
- Check that RLS policies are configured
- Verify your Supabase project is active

## License

MIT
