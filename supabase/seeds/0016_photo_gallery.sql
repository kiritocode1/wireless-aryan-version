-- Seed: photo_gallery backfill from hardcoded data in src/pages/PhotoGallery.tsx
-- Source commit: 0ea7b78
-- Captions resolved from src/constants/Language.ts (gallery.image*.caption).
-- photo_url left NULL (originals were imported asset bundles from src/assets/gallery/).
-- NOTE: photo_url is NOT NULL on this table; the schema will reject NULL.
-- We instead place the original asset path so admin can re-upload via the panel.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM photo_gallery) THEN
    INSERT INTO photo_gallery (title_en, title_mr, photo_url, taken_date, display_order) VALUES
      ('Dr. APJ Abdul Kalam Innovation Center Inauguration', 'डॉ. एपीजे अब्दुल कलाम इनोवेशन सेंटर उद्घाटन', '/assets/gallery/Dr-APJ-Abdul-Kalam-Innovation-Centre-HM-Inaugration-1.jpg', NULL, 1),
      ('Independence Day Celebrations', 'स्वातंत्र्यदिन साजरे', '/assets/gallery/Republic-Day-4.jpg', NULL, 2),
      ('Ashok Jog Lecture Hall Inauguration', 'अशोक जोग व्याख्यानगृह उद्घाटन', '/assets/gallery/Ashok-Jog-Lecture-Hall-Inauguration-2.jpeg', NULL, 3),
      ($$Dnyaneshwari Senior Officer's Mess Inauguration$$, 'ज्ञानेश्वरी वरिष्ठ अधिकाऱ्यांच्या मेसचे उद्घाटन', '/assets/gallery/DGP-Inaugration-1.jpg', NULL, 4);
  END IF;
END $$;
