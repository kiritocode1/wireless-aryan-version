-- Seed: press_releases backfill from hardcoded data in src/pages/citizen/PressRelease.tsx
-- Source commit: 0ea7b78
-- Note: titles/descriptions resolved from src/constants/Language.ts (event.pcit.upgrades, press.tech.description, etc.)
-- photo_url left NULL because originals were imported asset bundles.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM press_releases) THEN
    INSERT INTO press_releases (title_en, title_mr, description_en, description_mr, photo_url, pdf_url, published_date) VALUES
      (
        'Independence Celebration in PCIT',
        'पीसीआयटीमध्ये स्वातंत्र्य दिनाचे उत्सव',
        $str$Independence Day was celebrated with great enthusiasm in the Police Communication and Information Technology Department. Officers and staff participated in the flag hoisting, national anthem, and cultural programs, spreading the message of patriotism and unity.$str$,
        $str$पोलीस दळणवळण व माहिती तंत्रज्ञान विभागामध्ये स्वातंत्र्य दिन उत्साहात साजरा करण्यात आला. विभागातील अधिकारी व कर्मचारी यांनी देशभक्तिपूर्ण वातावरणात ध्वजारोहण, राष्ट्रगीत आणि विविध सांस्कृतिक कार्यक्रमांमध्ये सहभाग घेतला. या उत्सवातून देशभक्ती, एकात्मता आणि तांत्रिक प्रगतीबद्दल जागरूकता निर्माण करण्यात आली.$str$,
        NULL,
        'https://mahpolwireless.stagingdsi.co.in/wp-content/uploads/2025/01/Adobe-Scan-29-Jan-2025-1.pdf',
        '2025-08-15'
      ),
      (
        'Republic Day Celebration in PCIT',
        'पीसीआयटीमध्ये प्रजासत्ताक दिनाचे उत्सव',
        $str$Republic Day was celebrated with great enthusiasm in the Police Communication and Information Technology Department. Officers and staff participated in the flag hoisting, national anthem, and patriotic programs, highlighting the values of the Constitution, patriotism, and unity.$str$,
        $str$पोलीस दळणवळण व माहिती तंत्रज्ञान विभागामध्ये प्रजासत्ताक दिन उत्साहात साजरा करण्यात आला. अधिकारी व कर्मचारी यांनी ध्वजारोहण, राष्ट्रगीत व देशभक्तिपर कार्यक्रमांमध्ये सहभाग घेतला. या निमित्ताने संविधान मूल्ये, देशभक्ती आणि एकात्मतेचा संदेश देण्यात आला.$str$,
        NULL,
        'https://mahpolwireless.stagingdsi.co.in/wp-content/uploads/2025/01/Adobe-Scan-29-Jan-2025.pdf',
        '2025-01-26'
      );
  END IF;
END $$;
