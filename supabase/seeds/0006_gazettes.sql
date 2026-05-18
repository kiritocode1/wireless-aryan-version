-- Seed: gazettes backfill from hardcoded data in src/pages/police/Gazette.tsx
-- Source commit: 0ea7b78

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM gazettes) THEN
    INSERT INTO gazettes (title_en, title_mr, pdf_url, published_date, file_size_kb) VALUES
      ('Gazette – January 2025', 'प्रसिद्धीपत्रक – जानेवारी २०२५', 'https://mahpolwireless.stagingdsi.co.in/wp-content/uploads/2025/04/February-2021.pdf', '2025-01-10', 1200),
      ('Gazette – February 2025', 'प्रसिद्धीपत्रक – फेब्रुवारी २०२५', 'https://mahpolwireless.stagingdsi.co.in/wp-content/uploads/2025/04/March-2021.pdf', '2025-02-25', 1500),
      ('Gazette – March 2025', 'प्रसिद्धीपत्रक – मार्च २०२५', 'https://mahpolwireless.stagingdsi.co.in/wp-content/uploads/2025/04/April-2021.pdf', '2025-03-30', 1300);
  END IF;
END $$;
