-- Phase 4: stock movements for checkout reservations and sales (additive enum values only).
ALTER TYPE "StockMovementKind" ADD VALUE IF NOT EXISTS 'RESERVE';
ALTER TYPE "StockMovementKind" ADD VALUE IF NOT EXISTS 'RELEASE_RESERVATION';
ALTER TYPE "StockMovementKind" ADD VALUE IF NOT EXISTS 'SALE';
