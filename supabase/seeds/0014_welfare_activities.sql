-- Seed: welfare_activities backfill from hardcoded data in src/pages/about/WelfareActivities.tsx
-- Source commit: 0ea7b78
-- Source for EN/MR titles: src/constants/Language.ts (welfare.item*.title)
-- Items 8 and 9 were commented out in the source page; only items 1-7 and 10 are seeded.
-- photo_url left NULL (originals were imported asset bundles).

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM welfare_activities) THEN
    INSERT INTO welfare_activities (title_en, title_mr, photo_url, activity_date) VALUES
      ('Museum – Evolution in Wireless Department', 'संग्रहालय – बिनतारी विभागातील तंत्रज्ञान विकास', NULL, NULL),
      ('Canteen – Muktai', 'कॅन्टीन – मुक्ताई', NULL, NULL),
      ('Badminton Hall – Sant Tukaram Sankul', 'बॅडमिंटन हॉल – संत तुकाराम संकुल', NULL, NULL),
      ('Senior Officers Mess – Dnyaneshwari', 'वरिष्ठ अधिकाऱ्यांचे मेस – ज्ञानेश्वरी', NULL, NULL),
      ($$Junior officer's Mess – Sanchar$$, 'कनिष्ठ अधिकाऱ्यांचे मेस – संचार', NULL, NULL),
      ('Open Museum – Aryabhatta Garden', 'ओपन संग्रहालय – आर्यभट्ट उद्यान', NULL, NULL),
      ('Parade ground', 'परेड ग्राउंड', NULL, NULL),
      ('Maharashtra Police Wireless Welfare Complex and Convention Centre', 'महाराष्ट्र पोलीस वायरलेस कल्याण संकुल आणि परिषद केंद्र', NULL, NULL);
  END IF;
END $$;
