-- Seed: gradation_lists backfill from hardcoded data in src/pages/police/GradationList.tsx
-- Source commit: 0ea7b78

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM gradation_lists) THEN
    INSERT INTO gradation_lists (title_en, title_mr, pdf_url, published_date) VALUES
      ('Gradation List – January 2025', 'सेवाज्येष्ठता यादी – जानेवारी २०२५', 'https://mahpolwireless.stagingdsi.co.in/UploadedFiles/GradationLists/156.pdf', '2025-01-10'),
      ('Gradation List – February 2025', 'सेवाज्येष्ठता यादी – फेब्रुवारी २०२५', 'https://mahpolwireless.stagingdsi.co.in/UploadedFiles/GradationLists/159.pdf', '2025-02-15'),
      ('Gradation List – March 2025', 'सेवाज्येष्ठता यादी – मार्च २०२५', 'https://mahpolwireless.stagingdsi.co.in/UploadedFiles/GradationLists/163.pdf', '2025-03-25');
  END IF;
END $$;
