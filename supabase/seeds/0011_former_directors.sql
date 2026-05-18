-- Seed: former_directors backfill from hardcoded data in src/pages/about/FormerDirectors.tsx
-- Source commit: 0ea7b78

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM former_directors) THEN
    INSERT INTO former_directors (name_en, name_mr, designation_en, designation_mr, tenure, photo_url, display_order) VALUES
      ('Shri. Sunil Ramanand (IPS)', 'श्री. सुनील रामानंद (आयपीएस)', 'Addl. D.G.P.', 'अपर पोलीस महासंचालक', '2021-2024', NULL, 1),
      ('Shri. Retesh Kumaarr (IPS)', 'श्री. रितेश कुमार (आयपीएस)', 'Addl. D.G.P.', 'अपर पोलीस महासंचालक', '2016-2021', NULL, 2),
      ('Shri. Jagannath (IPS)', 'श्री. जगननाथ  (आयपीएस)', 'Addl. D.G.P.', 'अपर पोलीस महासंचालक', '2014-2016', NULL, 3),
      ('Shri. Suresh Kakkar (IPS)', 'श्री. सुरेश कक्कड (आयपीएस)', 'Addl. D.G.P.', 'अपर पोलीस महासंचालक', '2012-2014', NULL, 4),
      ('Shri. P.P.P. Sharma (IPS)', 'श्री. पी. पी. पी. शर्मा (आयपीएस)', 'Addl. D.G.P.', 'अपर पोलीस महासंचालक', '2008-2011', NULL, 5),
      ('Shri. B.T. Nghinglova (IPS)', 'श्री. बी. टी. नघिंगलोवा (आयपीएस)', 'Addl. D.G.P.', 'अपर पोलीस महासंचालक', '2007-2008', NULL, 6),
      ('Shri. P.T. Lohar (IPS)', 'श्री. पी. टी. लोहार (आयपीएस)', 'Addl. D.G.P.', 'अपर पोलीस महासंचालक', '2004-2007', NULL, 7),
      ('Shri. P. K. Joshi (IPS)', 'श्री. पी. के. जोशी (आयपीएस)', 'SPL I.G.P. 2000-2003 | Addl. D.G.P. 2003-2004', 'विशेष पोलीस महानिरीक्षक २०००-२००३ | अपर पोलीस महासंचालक २००३-२००४', '2000-2004', NULL, 8),
      ('Shri. A. D. Jog (SPS)', 'श्री. ए. डी. जोग (एसपीएस)', 'D.I.G. 1979-1987 | SPL I.G. 1989-1999', 'उपमहानिरीक्षक १९७९-१९८७ | विशेष पोलीस महानिरीक्षक १९८९-१९९९', '1979-1999', NULL, 9),
      ('Shri. S. M. Nabar', 'श्री. एस. एम. नाबर', 'SP 1948-1968 | D.I.G.P. 1968-1978', 'पोलीस अधीक्षक १९४८-१९६८ | उपमहानिरीक्षक १९६८-१९७८', '1948-1978', NULL, 10),
      ('Shri. L. A. Paddon Row (IP)', 'श्री. एल. ए. पॅडन रो (आयपी)', 'SP M. T. & W/L', 'एसपी एम. टी. आणि वायरलेस', '1947-1948', NULL, 11),
      ('Shri. E. A. Dodwell (IP)', 'श्री. ई. ए. डॉडवेल (आयपी)', 'SP M. T. & W/L', 'एसपी एम. टी. आणि वायरलेस', '1946-1947', NULL, 12);
  END IF;
END $$;
