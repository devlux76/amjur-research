/*
  # Create searches table for user search notebook

  1. New Tables
    - `searches`
      - `id` (uuid, primary key) - Unique identifier for each saved search
      - `user_id` (uuid, foreign key) - References auth.users, the user who saved the search
      - `query` (text) - The original search query
      - `title` (text, optional) - Title of the saved search result
      - `description` (text, optional) - Description or snippet from the search result
      - `url` (text, optional) - URL of the saved search result
      - `tags` (text array, optional) - User-defined tags for organizing searches
      - `saved_at` (timestamptz) - When the search was saved

  2. Security
    - Enable RLS on `searches` table
    - Add policy for authenticated users to manage their own searches only
    - Users can read, insert, update, and delete only their own searches

  3. Indexes
    - Index on user_id for efficient user-specific queries
    - Index on saved_at for chronological ordering
    - Index on query for search functionality within saved searches
*/

CREATE TABLE IF NOT EXISTS searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query text NOT NULL,
  title text,
  description text,
  url text,
  tags text[] DEFAULT '{}',
  saved_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS searches_user_id_idx ON searches(user_id);
CREATE INDEX IF NOT EXISTS searches_saved_at_idx ON searches(saved_at DESC);
CREATE INDEX IF NOT EXISTS searches_query_idx ON searches(query);

-- RLS Policies: Users can only access their own searches
CREATE POLICY "Users can view their own searches"
  ON searches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own searches"
  ON searches
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own searches"
  ON searches
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own searches"
  ON searches
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);