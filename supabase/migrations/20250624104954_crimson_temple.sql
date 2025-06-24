/*
  # Create indexes and additional constraints for performance

  1. Indexes
    - Add indexes on frequently queried columns
    - Add composite indexes for common query patterns

  2. Additional Constraints
    - Add check constraints for data validation
*/

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_family_trees_created_by ON family_trees(created_by);
CREATE INDEX IF NOT EXISTS idx_family_trees_created_at ON family_trees(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_family_members_family_tree_id ON family_members(family_tree_id);
CREATE INDEX IF NOT EXISTS idx_family_members_name ON family_members(name);

CREATE INDEX IF NOT EXISTS idx_memories_family_tree_id ON memories(family_tree_id);
CREATE INDEX IF NOT EXISTS idx_memories_family_member_id ON memories(family_member_id);
CREATE INDEX IF NOT EXISTS idx_memories_created_by ON memories(created_by);
CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memories_memory_date ON memories(memory_date DESC);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_memories_tree_date ON memories(family_tree_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memories_member_date ON memories(family_member_id, created_at DESC);

-- Add check constraints
ALTER TABLE family_members 
ADD CONSTRAINT check_birth_before_death 
CHECK (death_date IS NULL OR birth_date IS NULL OR birth_date <= death_date);

ALTER TABLE memories 
ADD CONSTRAINT check_title_not_empty 
CHECK (length(trim(title)) > 0);