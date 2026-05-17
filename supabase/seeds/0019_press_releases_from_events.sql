-- Seed: additional press_releases (news) backfill from src/components/EventsGallery.tsx
-- Source commit: 0ea7b78
-- Source for EN/MR: src/constants/Language.ts (news.*).
-- These are the "Latest News" tickers from the home page that link to /citizen/press-release.
-- Guarded so a second run won't duplicate; uses the first title as the sentinel.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM press_releases WHERE title_en = 'Yoga Training Conducted') THEN
    INSERT INTO press_releases (title_en, title_mr, description_en, description_mr, photo_url, pdf_url, published_date) VALUES
      ('Yoga Training Conducted', 'योग प्रशिक्षण आयोजित', NULL, NULL, NULL, NULL, '2025-06-20'),
      ('Kolhapur Visit Again', 'कोल्हापूर भेट पुन्हा', NULL, NULL, NULL, NULL, '2025-05-28'),
      ('Face Authentication System Launch', 'चेहरा प्रमाणीकरण प्रणाली उद्घाटन', NULL, NULL, NULL, NULL, '2025-05-26'),
      ('Correspondence from Director', 'संचालकांचे पत्रव्यवहार', NULL, NULL, NULL, NULL, '2025-05-08');
  END IF;
END $$;
