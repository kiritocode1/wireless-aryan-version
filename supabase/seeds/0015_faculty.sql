-- Seed: faculty backfill from hardcoded data in src/pages/Faculty.tsx
-- Source commit: 0ea7b78
-- Names/designations resolved from src/constants/Language.ts (planning.faculty.*).
-- Page also rendered 4 "example" placeholder cards; we omit them as they were not real faculty.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM faculty) THEN
    INSERT INTO faculty (name_en, name_mr, designation_en, designation_mr, email, contact, photo_url, display_order) VALUES
      ('Dr. Sanjaykumar G. Sonar', 'डॉ. संजयकुमार जी. सोनार', 'Associate Professor', 'सहयोगी प्राध्यापक', 'sgs.civil@coeptech.ac.in', '020-2550-7223', NULL, 1),
      ('Dr. Arati Siddharth Petkar', 'डॉ. आरती सिद्धार्थ पेटकर', 'Assistant Professor', 'सहाय्यक प्राध्यापक', 'asp.civil@coeptech.ac.in', '02025507219', NULL, 2);
  END IF;
END $$;
