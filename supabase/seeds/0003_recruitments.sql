-- Seed: recruitments backfill from hardcoded data in src/pages/citizen/Recruitments.tsx
-- Source commit: 0ea7b78

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM recruitments) THEN
    INSERT INTO recruitments (title_en, title_mr, pdf_url, published_date, file_size_kb) VALUES
      ('Recruitment for Technical Assistant Post', 'तांत्रिक सहाय्यक पदासाठी भरती जाहिरात', 'https://example.com/recruitment1.pdf', '2025-10-15', 512),
      ('Police Constable Recruitment 2025', 'पोलीस कॉन्स्टेबल भरती २०२५', 'https://example.com/recruitment2.pdf', '2025-09-05', 689);
  END IF;
END $$;
