-- Seed: tenders backfill from hardcoded data in src/pages/citizen/Tender.tsx
-- Source commit: 2c1f34a

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM tenders) THEN
    INSERT INTO tenders (title_en, title_mr, pdf_url, published_date, file_size_kb) VALUES
      ('Tender Notice for Wireless Radio Purchase', 'वायरलेस रेडिओ संच खरेदीबाबत निविदा सूचना', 'https://mahpolwireless.stagingdsi.co.in/wp-content/uploads/2025/01/TenderNoticeSolapur.pdf', '2025-09-30', 416),
      ('Tender for Supply of Spare Parts', 'स्पेअर पार्टस पुरवठ्याबाबत निविदा', 'https://mahpolwireless.stagingdsi.co.in/wp-content/uploads/2025/01/TenderNoticeSolapur.pdf', '2025-08-10', 416),
      ('Tender for Computer Equipment Purchase', 'कंप्युटर साहित्य खरेदी निविदा', 'https://mahpolwireless.stagingdsi.co.in/wp-content/uploads/2025/01/TenderNoticeSolapur.pdf', '2025-07-25', 416);
  END IF;
END $$;
