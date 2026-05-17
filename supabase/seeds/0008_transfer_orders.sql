-- Seed: transfer_orders backfill from hardcoded data in src/pages/police/Transfers.tsx
-- Source commit: 0ea7b78

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM transfer_orders) THEN
    INSERT INTO transfer_orders (title_en, title_mr, pdf_url, published_date) VALUES
      ('Transfer Order – January 2025', 'बदली आदेश – जानेवारी २०२५', 'https://mahpolwireless.stagingdsi.co.in/UploadedFiles/TransferOrders/457.pdf', '2025-01-10'),
      ('Transfer Order – February 2025', 'बदली आदेश – फेब्रुवारी २०२५', 'https://mahpolwireless.stagingdsi.co.in/UploadedFiles/TransferOrders/459.pdf', '2025-02-18'),
      ('Transfer Order – March 2025', 'बदली आदेश – मार्च २०२५', 'https://mahpolwireless.stagingdsi.co.in/UploadedFiles/TransferOrders/460.pdf', '2025-03-25');
  END IF;
END $$;
