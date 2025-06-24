/*
  # Create memories table

  1. New Tables
    - `memories`
      - `id` (uuid, primary key)
      - `family_tree_id` (uuid, references family_trees)
      - `family_member_id` (uuid, references family_members, optional)
      - `title` (text, required)
      - `content` (text, optional)
      - `audio_url` (text, optional)
      - `photo_url` (text, optional)
      - `emotion_tags` (text array, optional)
      - `memory_date` (date, optional)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `memories` table
    - Add policy for users to manage memories in their family trees
*/

CREATE TABLE IF NOT EXISTS memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_tree_id uuid REFERENCES family_trees(id) ON DELETE CASCADE NOT NULL,
  family_member_id uuid REFERENCES family_members(id) ON DELETE SET NULL,
  title text NOT NULL,
  content text,
  audio_url text,
  photo_url text,
  emotion_tags text[],
  memory_date date,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Users can read memories from their family trees
CREATE POLICY "Users can read memories from own trees"
  ON memories
  FOR SELECT
  TO authenticated
  USING (
    family_tree_id IN (
      SELECT id FROM family_trees WHERE created_by = auth.uid()
    )
  );

-- Users can create memories in their family trees
CREATE POLICY "Users can create memories in own trees"
  ON memories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    family_tree_id IN (
      SELECT id FROM family_trees WHERE created_by = auth.uid()
    )
    AND created_by = auth.uid()
  );

-- Users can update their own memories
CREATE POLICY "Users can update own memories"
  ON memories
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Users can delete their own memories
CREATE POLICY "Users can delete own memories"
  ON memories
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Trigger to update updated_at timestamp
CREATE TRIGGER memories_updated_at
  BEFORE UPDATE ON memories
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();