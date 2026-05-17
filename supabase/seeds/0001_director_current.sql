-- Seed: Current director (Director's Desk content)
-- Source: src/constants/Language.ts (keys: a2.name, a2.desg, director.name, b1.intro, etc.)
-- Safe to re-run: upserts on id = 1.

INSERT INTO director_current (
  id,
  name_en, name_mr,
  designation_en, designation_mr,
  message_en, message_mr,
  photo_url
) VALUES (
  1,
  'Shri. Deepak Shivanand Pandey (IPS)',
  'श्री. दीपक शिवानंद पाण्डेय् (भा.पो.से.)',
  'Additional Director General of Police & Director',
  'अपर पोलीस महासंचालक व संचालक',
  E'Police Communication and Information Technology Department prior to The Police Wireless Department typically handles communication systems used by law enforcement authority that is Maharashtra State Police. This includes managing radio frequencies, dispatching officers, and ensuring secure and efficient communication between police units in the field. Uninterrupted 24×7 communication system is provided by our Department.\n\nThe Police Communication and Information Technology Department plays a vital role in policing by ensuring effective communication and coordination among officers with key functions such as real-time Communication which facilitates immediate contact between officers in the field and dispatch, crucial for timely responses to incidents; Situational Awareness which provides officers with updates on ongoing situations, enhancing their ability to make informed decisions; Emergency Response which enables quick coordination during emergencies, allowing for faster deployment of resources; Data Transmission which supports the transfer of critical information, such as criminal records and intelligence, enhancing investigative efforts; Safety and Security which maintains secure communication channels to protect sensitive information and officer safety.\n\nThe Koyna earthquake on December 10, 1967 with a magnitude of 6.3 and the Killari earthquake on September 30, 1993 with a magnitude of 6.04 occurred in Maharashtra state, India. It caused significant damage and resulted in over 200 deaths, largely due to the collapse of buildings and infrastructure. The floods that followed on July 26, 2005, in Mumbai, were devastating. Heavy rainfall led to widespread flooding, impacting transportation, displacing thousands, and causing numerous fatalities. The city faced significant challenges in emergency response and infrastructure resilience during this disaster. 26/11 terrorist attack, riots and blasts were happened in Maharashtra state. Wireless communication has played a crucial role in disaster management and response during such crucial events when private network like mass communication, mobile network failed. Hence effective wireless communication is essential for maintaining public safety and operational efficiency in policing.',
  E'पोलीस दळणवळण व माहिती तंत्रज्ञान विभाग, पूर्वीचे बिनतारी संदेश विभाग, महाराष्ट्र राज्यातील कायदा व सुव्यवस्थाच्या अंमलबजावणीकरिता कार्यरत असलेले अंतर्गत स्वयंपूर्ण दळणवळण हाताळते. यामध्ये आधुनिक तंत्रज्ञानाचा वापर करून संदेश वहन करणे, पोलीस नियंत्रण कक्षातून जिल्हा व आयुक्तालयातील पोलीस गस्तीमार्फत नियंत्रण ठेवणे आणि पोलीस कार्यक्षेत्रातील घटकांदरम्यान सुरक्षित आणि कार्यक्षम संदेशाचे वहन करणे यांचा समावेश आहे. सदर यंत्रणा २४ X ७ अखंडित कार्यरत ठेवली जाते.\n\nपोलीस दळणवळण व माहिती तंत्रज्ञान विभाग राज्यातील पोलीसांना कायदा व सुव्यवस्था राखणेकामी प्रभावी संवाद आणि समन्वय सुनिश्चित करून रीअल-टाइम कम्युनिकेशन ज्यात कार्यक्षेत्रातील पोलीस अधिकाऱ्यांमध्ये तात्काळ संपर्क साधणे आणि मदत आवश्यक असलेल्या घटनांना वेळेवर प्रतिसाद देणे सहज शक्य होते; परिस्थितीविषयक जागरूकता राखणेकरिता पोलीस अधिका-यांना घडामोडीची अद्यायावत माहिती प्रदान करून त्यांची निर्णय घेण्याची क्षमता वाढवण्यास मदत होते; आपत्कालीन परिस्थितीत जलद समन्वय प्रतिसाद सक्षम करून संसाधनांच्या जलद उपयोजना केली जाते; डेटा ट्रान्समिशनमध्ये गोपनीय माहितीची सुरक्षित देवाणघेवाण करून कायदा व सुव्यवस्था राखली जाते परिणामी माहितीच्या आधारे पुढील तपासास मदत होते; सुरक्षितता आणि सुरक्षा दृष्टीकोनातून संवेदनशील माहितीकरिता दळणवळण वाहिनी उपलब्ध करून दिली जाते.\n\n10 डिसेंबर 1967 रोजी महाराष्ट्रात 6.3 रिश्टर स्केलचा कोयना भूकंप व 30 सेप्टेंबर 1993 रोजी 6.04 रिश्टर स्केलचा किल्लारी भूकंप झाला होता. इमारती आणि पायाभूत सुविधांच्या पडझडीमुळे लक्षणीय आर्थिक नुकसान आणि जीवितहानी झाली होती. तसेच 26 जुलै 2005 रोजी मुंबईत आलेला पूर विनाशकारी होता. मुसळधार पावसामुळे मोठ्या प्रमाणावर पूर आला, वाहतुकीवर परिणाम झाला, हजारो लोक विस्थापित झाले आणि असंख्य मृत्यू झाले. या आपत्तीदरम्यान शहराला आपत्कालीन प्रतिसाद आणि पायाभूत सुविधांना आव्हानांचा सामना करावा लागला. त्याचप्रमाणे मुंबईतील 26/11 चा दहशतवादी हल्ला, दंगली आणि बॉम्बस्फोट असे प्रसंग उद्भवले होते. अशा प्रसंगी प्रसार माध्यमे, मोबाईल नेटवर्क यांसारखे खाजगी नेटवर्क अयशस्वी झाल्याने राज्याने खूप अडचणींचा सामना केला होता, दरम्यान या महत्त्वपूर्ण घटनांमध्ये आपत्ती व्यवस्थापन आणि प्रतिसादामध्ये महाराष्ट्र राज्य पोलीसांचा बिनतारी संदेश विभाग यांनी महत्त्वपूर्ण भूमिका बजावलेली आहे.',
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  name_en        = EXCLUDED.name_en,
  name_mr        = EXCLUDED.name_mr,
  designation_en = EXCLUDED.designation_en,
  designation_mr = EXCLUDED.designation_mr,
  message_en     = EXCLUDED.message_en,
  message_mr     = EXCLUDED.message_mr;

SELECT
  id,
  name_en,
  name_mr,
  length(message_en) AS msg_en_chars,
  length(message_mr) AS msg_mr_chars
FROM director_current
WHERE id = 1;
