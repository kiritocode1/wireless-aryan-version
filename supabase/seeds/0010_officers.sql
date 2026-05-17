-- Seed: officers backfill from hardcoded data in src/pages/police/ListOfOfficers.tsx
-- Source commit: 0ea7b78
-- Note: the page rendered only 3 officers via t() lookups (emp_1, emp_2, emp_21);
-- backfilling all 20 employee entries that exist in src/constants/Language.ts (emp_1..emp_21)
-- since the comment "// ... add more officers as needed" indicates these were intended.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM officers) THEN
    INSERT INTO officers (name_en, name_mr, designation_en, designation_mr, email, contact, display_order) VALUES
      ('SHRI. DEEPAK SHIVANAND PANDEY', 'श्री. दीपक शिवानंद पांडे', 'ADGP & Director PCIT & T M.S Pune', 'ADGP & Director PCIT & T M.S Pune', 'adg.pcitmt@mahapolice.gov.in', '020-25656908', 1),
      ('SHRI. G.Sreedhar', 'श्री. जी श्रीधर', 'DIGP PCIT', 'DIGP PCIT M.S Pune', 'igpcit.pna@mahapolice.gov.in', '020-25658422', 2),
      ('SHRI. R. RAJA', 'श्री. आर. राजा', 'SP PCIT HQ M.S Pune', 'SP PCIT HQ M.S Pune', 'spcit.pna@mahapolice.gov.in', '020-25652623', 3),
      ('SHRI. RAJESH RAMCHANDRA BANSODE', 'श्री. राजेश रामचंद्र बंसोडे', 'SP(PCIT)', 'SP(PCIT)', NULL, NULL, 4),
      ('SHRI. SANJAY SUBHASH CHANDKHEDE', 'श्री. संजय सुभाष चांदखेडे', 'DYSP(PCIT)', 'DYSP(PCIT)', NULL, NULL, 5),
      ('SHRI. ARVIND DHONDIBA ALHAT', 'श्री. अरविंद ढोंडीबा अलहत', 'DYSP(PCIT)', 'DYSP(PCIT)', NULL, NULL, 6),
      ('SHRI. SITARAM LAXMAN JADHAV', 'श्री. सिताराम लक्ष्मण जाधव', 'DYSP(PCIT)', 'DYSP(PCIT)', NULL, NULL, 7),
      ('SHRI. KASHINATH MANGAJI UDAR', 'श्री. काशीनाथ मंगाजी उदर', 'DYSP(PCIT)', 'DYSP(PCIT)', NULL, NULL, 8),
      ('SHRI. SHIVPRASAD GARIBA UIKEY', 'श्री. शिवप्रसाद गरिबा उइके', 'DYSP(PCIT)', 'DYSP(PCIT)', NULL, NULL, 9),
      ('SHRI. SUNIL VITTHALRAO KUMBHRE', 'श्री. सुनील विठलराव कुम्भरे', 'DYSP(PCIT)', 'DYSP(PCIT)', NULL, NULL, 10),
      ('SHRI. NITIN PRABHAKAR JOSHI', 'श्री. नितिन प्रभाकर जोशी', 'DYSP(PCIT)', 'DYSP(PCIT)', NULL, NULL, 11),
      ('SHRI. RATAN KHANDERAO DHOKLE', 'श्री. रतन खंडेराव ढोकले', 'PI(PCIT)', 'PI(PCIT)', NULL, NULL, 12),
      ('SHRI. KORE MAHINDRA', 'श्री. कोरे महिंद्र', 'PI(PCIT)', 'PI(PCIT)', NULL, NULL, 13),
      ('SHRI. MAHENDRA NARAYAN BHOSALE', 'श्री. महेंद्र नारायण भोसले', 'PI(PCIT)', 'PI(PCIT)', NULL, NULL, 14),
      ('SHRI. SANDEEP PRABHAKAR SASANE', 'श्री. संदीप प्रभाकर ससाणे', 'PI(PCIT)', 'PI(PCIT)', NULL, NULL, 15),
      ('SHRI. RAJARAM DATTATRAY POPALGHAT', 'श्री. राजाराम दत्तात्रय पोपालघाट', 'PI(PCIT)', 'PI(PCIT)', NULL, NULL, 16),
      ('SHRI. SANJAY SHANKARRAO CHINTEWAR', 'श्री. संजय शंकरराव चिंटewar', 'PI(PCIT)', 'PI(PCIT)', NULL, NULL, 17),
      ('SHRI. JITENDRA BHANUJI PARDESHI', 'श्री. जितेंद्र भानुजी पारदेशी', 'PI(PCIT)', 'PI(PCIT)', NULL, NULL, 18),
      ('SHRI. DEEPAK SHRIKRISHNA KELKAR', 'श्री. दीपक श्रीकृष्ण केळकर', 'PSI(PCIT)', 'PSI(PCIT)', NULL, NULL, 19),
      ('SHRI. VIKRAM VITHALRAO TAMBARE', 'श्री. विक्रम विठलराव तांबरे', 'PSI(PCIT)', 'PSI(PCIT)', NULL, NULL, 20),
      ('SHRI. SUNIL MORESHWAR POTE', 'श्री. सुनील मोरेश्वर पोते', 'PSI(PCIT)', 'PSI(PCIT)', NULL, NULL, 21);
  END IF;
END $$;
