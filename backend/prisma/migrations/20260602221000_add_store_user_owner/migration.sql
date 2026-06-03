-- Add owner relationship for stores
ALTER TABLE "Store"
ADD COLUMN IF NOT EXISTS "userId" TEXT;

CREATE INDEX IF NOT EXISTS "Store_userId_idx" ON "Store"("userId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'Store_userId_fkey'
      AND table_name = 'Store'
  ) THEN
    ALTER TABLE "Store"
    ADD CONSTRAINT "Store_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
