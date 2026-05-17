-- Seed: training_schedules backfill from hardcoded data in src/pages/TrainingCalender.tsx
-- Source commit: 0ea7b78
-- The active page had only English course data; MR columns reuse the English text as fallback.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM training_schedules) THEN
    INSERT INTO training_schedules (course_name_en, course_name_mr, duration_en, duration_mr, date_from, date_to, eligibility_en, eligibility_mr, coordinator_en, coordinator_mr, pdf_url) VALUES
      ('Leadership Development Program', 'Leadership Development Program', '5 Days', '5 Days', '2025-03-01', '2025-03-05', 'Senior Officers', 'Senior Officers', NULL, NULL, '/pdfs/leadership-training.pdf'),
      ('Advanced Technical Training', 'Advanced Technical Training', '15 Days', '15 Days', '2025-04-10', '2025-04-25', 'Technical Staff', 'Technical Staff', NULL, NULL, '/pdfs/technical-training.pdf');
  END IF;
END $$;
