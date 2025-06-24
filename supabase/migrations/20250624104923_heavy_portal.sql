/*
  # Create family members table

  1. New Tables
    - `family_members`
      - `id` (uuid, primary key)
      - `family_tree_id` (uuid, references family_trees)
      - `name` (text, required)
      - `birth_date` (date, optional)
      - `death_date` (date, optional)
      - `gender` (text, optional)
      - `bio` (text, optional)
      - `photo_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `family_members` table
    - Add policy for users to manage family members in their trees
*/

CREATE TABLE IF NOT EXISTS family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_tree_id uuid REFERENCES family_trees(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  birth_date date,
  death_date date,
  gender text CHECK (gender IN ('male', 'female', 'other')),
  bio text,
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

-- Users can read family members from their family trees
CREATE POLICY "Users can read family members from own trees"
  ON family_members
  FOR SELECT
  TO authenticated
  USING (
    family_tree_id IN (
      SELECT id FROM family_trees WHERE created_by = auth.uid()
    )
  );

-- Users can create family members in their family trees
CREATE POLICY "Users can create family members in own trees"
  ON family_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    family_tree_id IN (
      SELECT id FROM family_trees WHERE created_by = auth.uid()
    )
  );

-- Users can update family members in their family trees
CREATE POLICY "Users can update family members in own trees"
  ON family_members
  FOR UPDATE
  TO authenticated
  USING (
    family_tree_id IN (
      SELECT id FROM family_trees WHERE created_by = auth.uid()
    )
  )
  WITH CHECK (
    family_tree_id IN (
      SELECT id FROM family_trees WHERE created_by = auth.uid()
    )
  );

-- Users can delete family members from their family trees
CREATE POLICY "Users can delete family members from own trees"
  ON family_members
  FOR DELETE
  TO authenticated
  USING (
    family_tree_id IN (
      SELECT id FROM family_trees WHERE created_by = auth.uid()
    )
  );

-- Trigger to update updated_at timestamp
CREATE TRIGGER family_members_updated_at
  BEFORE UPDATE ON family_members
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();