/*
  # Create family trees table

  1. New Tables
    - `family_trees`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `description` (text, optional)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `family_trees` table
    - Add policy for users to read their own family trees
    - Add policy for users to create family trees
    - Add policy for users to update their own family trees
*/

CREATE TABLE IF NOT EXISTS family_trees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE family_trees ENABLE ROW LEVEL SECURITY;

-- Users can read family trees they created
CREATE POLICY "Users can read own family trees"
  ON family_trees
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

-- Users can create family trees
CREATE POLICY "Users can create family trees"
  ON family_trees
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Users can update their own family trees
CREATE POLICY "Users can update own family trees"
  ON family_trees
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Users can delete their own family trees
CREATE POLICY "Users can delete own family trees"
  ON family_trees
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Trigger to update updated_at timestamp
CREATE TRIGGER family_trees_updated_at
  BEFORE UPDATE ON family_trees
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();