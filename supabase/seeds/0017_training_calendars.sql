-- Seed: training_calendars backfill from hardcoded data in src/pages/TrainingCalender.tsx
-- Source commit: 0ea7b78

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM training_calendars) THEN
    INSERT INTO training_calendars (year, pdf_url) VALUES
      (2025, '/pdfs/training calender 2025.pdf'),
      (2026, '/pdfs/Traing Centre Calender 2026 (1).pdf');
  END IF;
END $$;
