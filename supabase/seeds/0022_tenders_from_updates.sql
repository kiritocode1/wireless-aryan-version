-- Seed: additional tenders backfill from src/components/GovernmentUpdates.tsx
-- Source commit: 0ea7b78
-- Distinct from the Tender page entries; these are the home-page tender carousel items.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM tenders WHERE title_en = 'Communication Equipment Procurement Tender') THEN
    INSERT INTO tenders (title_en, title_mr, pdf_url, published_date) VALUES
      ('Communication Equipment Procurement Tender', 'संचार उपकरण खरेदी निविदा', 'https://mahpolwireless.stagingdsi.co.in/wp-content/uploads/2025/01/TenderNoticeSolapur.pdf', '2024-10-22'),
      ('Mobile Application Development Services', 'मोबाईल अॅप विकास सेवा', 'https://mahpolwireless.stagingdsi.co.in/wp-content/uploads/2025/01/TenderNoticeSolapur.pdf', '2024-10-20'),
      ('Server Infrastructure Maintenance Contract', 'सर्व्हर देखभाल करार', 'https://mahpolwireless.stagingdsi.co.in/wp-content/uploads/2025/01/TenderNoticeSolapur.pdf', '2024-10-15');
  END IF;
END $$;
