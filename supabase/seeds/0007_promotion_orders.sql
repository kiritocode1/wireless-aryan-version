-- Seed: promotion_orders backfill from hardcoded data in src/pages/police/PromotionOrders.tsx
-- Source commit: 0ea7b78

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM promotion_orders) THEN
    INSERT INTO promotion_orders (title_en, title_mr, pdf_url, published_date) VALUES
      ('Promotion Order – January 2025', 'पदोन्नती आदेश – जानेवारी २०२५', 'https://mahpolwireless.stagingdsi.co.in/UploadedFiles/PromotionOrders/145.pdf', '2025-01-15'),
      ('Promotion Order – February 2025', 'पदोन्नती आदेश – फेब्रुवारी २०२५', 'https://mahpolwireless.stagingdsi.co.in/UploadedFiles/PromotionOrders/139.pdf', '2025-02-20'),
      ('Promotion Order – March 2025', 'पदोन्नती आदेश – मार्च २०२५', 'https://mahpolwireless.stagingdsi.co.in/UploadedFiles/PromotionOrders/136.pdf', '2025-03-28');
  END IF;
END $$;
