-- Seed: rti_documents backfill from hardcoded data in src/pages/citizen/RTI.tsx
-- Source commit: 0ea7b78

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM rti_documents) THEN
    INSERT INTO rti_documents (title_en, title_mr, pdf_url, file_size_kb, display_order) VALUES
      ('RTI First Appeal Form', 'माहिती अधिकार प्रथम अपील अर्ज नमुना', '/pdfs/rti_first_apeal_arj_namuna_-2.pdf', 200, 1);
  END IF;
END $$;
