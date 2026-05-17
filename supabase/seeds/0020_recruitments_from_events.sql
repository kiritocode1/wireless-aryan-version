-- Seed: additional recruitments backfill from src/components/EventsGallery.tsx
-- Source commit: 0ea7b78
-- Source for EN/MR: src/constants/Language.ts (recruitment.*).
-- These are home-page recruitment tickers not duplicated by the Recruitments page.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM recruitments WHERE title_en = 'Advertisement for Retired PI-DYSP') THEN
    INSERT INTO recruitments (title_en, title_mr, pdf_url, published_date, last_date) VALUES
      ('Advertisement for Retired PI-DYSP', 'निवृत्त PI-DYSP साठी जाहिरात', NULL, current_date, '2025-12-31'),
      ('Sub-Inspector Recruitment', 'उपनिरीक्षक भरती', NULL, current_date, '2025-11-25'),
      ('Data Operator Recruitment', 'डेटा ऑपरेटर भरती', NULL, current_date, '2025-12-10');
  END IF;
END $$;
