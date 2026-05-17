-- Seed: bulletins backfill from src/components/GovernmentUpdates.tsx
-- Source commit: 0ea7b78
-- Active page had English + Marathi arrays inline; using those verbatim.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM bulletins) THEN
    INSERT INTO bulletins (title_en, title_mr, pdf_url, published_date) VALUES
      ('Cybercrime Reporting Portal Launch', 'सायबरक्राईम रिपोर्टिंग पोर्टल सुरु', 'https://mahpolwireless.stagingdsi.co.in/wp-content/uploads/2024/04/PP-RESULT-RM-ELE.-WO-2024.pdf', '2024-04-15'),
      ('Digital Evidence Guidelines Updated', 'डिजिटल पुरावा मार्गदर्शक तत्त्वे अद्यतनित', 'https://mahpolwireless.stagingdsi.co.in/wp-content/uploads/2024/04/PP-RESULT-RM-ELE.-WO-2024.pdf', '2024-04-12'),
      ('Emergency Response Protocol Revision', 'आपत्कालीन प्रतिसाद प्रोटोकॉल सुधारणा', 'https://mahpolwireless.stagingdsi.co.in/wp-content/uploads/2024/04/PP-RESULT-RM-ELE.-WO-2024.pdf', '2024-04-10'),
      ('Annual Performance Review Results Published', 'वार्षिक कामगिरी पुनरावलोकन निकाल प्रसिद्ध', 'https://mahpolwireless.stagingdsi.co.in/wp-content/uploads/2024/04/PP-RESULT-RM-ELE.-WO-2024.pdf', '2024-04-08');
  END IF;
END $$;
