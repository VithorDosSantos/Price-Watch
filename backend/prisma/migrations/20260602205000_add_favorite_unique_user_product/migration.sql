-- Remove duplicated favorites keeping the oldest row for each (userId, productId)
DELETE FROM "Favorite"
WHERE "id" IN (
  SELECT "id"
  FROM (
    SELECT
      "id",
      ROW_NUMBER() OVER (
        PARTITION BY "userId", "productId"
        ORDER BY "createdAt" ASC, "id" ASC
      ) AS row_num
    FROM "Favorite"
  ) ranked
  WHERE ranked.row_num > 1
);

-- Ensure a user can favorite a product only once
CREATE UNIQUE INDEX "Favorite_userId_productId_key" ON "Favorite"("userId", "productId");
