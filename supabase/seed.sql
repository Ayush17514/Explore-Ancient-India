-- ==========================================
-- Explore Ancient India — Seed Data
-- ==========================================

-- Note: All records are set to 'approved' so they appear in the UI immediately.

-- 1. Manuscripts
INSERT INTO public.manuscripts (title, description, domain, estimated_period, repository_source, material, script_type, tags, references_data, status)
VALUES
(
  'Isha Upanishad (Palm Leaf Transcription)',
  'A short verse text in Sanskrit consisting of 18 verses, dealing with the nature of the supreme being (Brahman) and the path to realization.',
  'Textual Knowledge',
  'c. 800 CE (Manuscript copy)',
  'National Archives of India',
  'Palm Leaf',
  'Devanagari',
  ARRAY['Upanishad', 'Vedanta', 'Philosophy'],
  '["Hume, R.E. (1921). The Thirteen Principal Upanishads.", "Radhakrishnan, S. (1953). The Principal Upanishads."]'::jsonb,
  'approved'
),
(
  'Sushruta Samhita - Chikitsa Sthana',
  'One of the foundational texts of Ayurveda, focusing on surgical techniques, instruments, and anatomical knowledge.',
  'Scientific Contributions',
  'c. 12th Century CE (Current copy)',
  'Bhandarkar Oriental Research Institute',
  'Birch Bark',
  'Sharada',
  ARRAY['Ayurveda', 'Medicine', 'Surgery'],
  '["Bhishagratna, K.K. (1907). An English Translation of the Sushruta Samhita."]'::jsonb,
  'approved'
),
(
  'Aryabhatiya',
  'A major 5th-century Sanskrit astronomical treatise by Aryabhata, outlining arithmetic, algebra, plane trigonometry, and spherical trigonometry.',
  'Scientific Contributions',
  '5th Century CE',
  'Kerala University Manuscript Library',
  'Palm Leaf',
  'Malayalam Script',
  ARRAY['Mathematics', 'Astronomy', 'Aryabhata'],
  '["Shukla, K.S., & Sarma, K.V. (1976). Aryabhatiya of Aryabhata."]'::jsonb,
  'approved'
);

-- 2. Architecture Sites
INSERT INTO public.architecture_sites (name, location, region, era, architectural_style, description, image_url, status)
VALUES
(
  'Brihadeeshwara Temple',
  'Thanjavur, Tamil Nadu',
  'South India',
  '1010 CE',
  'Dravidian',
  'A magnificent Shiva temple built by Rajaraja Chola I. Known for its 66-meter vimana, monolithic Nandi, and complex interlocking granite construction without mortar.',
  '/assets/pillar-architecture.jpg',
  'approved'
),
(
  'Kailasanatha Temple',
  'Ellora Caves, Maharashtra',
  'Western India',
  '8th Century CE',
  'Dravidian / Monolithic',
  'The largest monolithic structure in the world, carved from a single enormous rock face. Built by the Rashtrakuta king Krishna I.',
  null,
  'approved'
),
(
  'Konark Sun Temple',
  'Konark, Odisha',
  'Eastern India',
  '13th Century CE',
  'Kalinga Architecture',
  'Designed as a massive chariot of the Sun God Surya, with 24 elaborately carved stone wheels and drawn by seven stone horses.',
  null,
  'approved'
);

-- 3. Philosophical Schools
INSERT INTO public.philosophical_schools (name, tradition, founder, period, core_texts, description, status)
VALUES
(
  'Advaita Vedanta',
  'Vedantic',
  'Adi Shankaracharya',
  '8th Century CE',
  'Brahma Sutras, Principal Upanishads, Bhagavad Gita',
  'A non-dualistic school of Hindu philosophy which posits that the true Self (Atman) is identical with the highest reality (Brahman).',
  'approved'
),
(
  'Nyaya',
  'Nyaya-Vaisheshika',
  'Gautama Akshapada',
  '2nd Century BCE',
  'Nyaya Sutras',
  'The school of logic and epistemology. It developed a systematic methodology for reasoning and debate, focusing on obtaining valid knowledge (Pramana).',
  'approved'
),
(
  'Madhyamaka',
  'Buddhist',
  'Nagarjuna',
  '2nd Century CE',
  'Mulamadhyamakakarika',
  'The "Middle Way" school of Mahayana Buddhism, famous for its doctrine of emptiness (Shunyata), refuting all extremes of existence and non-existence.',
  'approved'
);

-- 4. Tribal Records
INSERT INTO public.tribal_records (community_name, region, knowledge_type, documenter_name, description, status)
VALUES
(
  'Warli Tribe',
  'Maharashtra / Gujarat border',
  'Art and Oral History',
  'Dr. Yashodhara Dalmia',
  'Warli painting is an ancient indigenous art form using basic geometric shapes—circle, triangle, square—to depict daily life, nature, and the mother goddess (Palaghata).',
  'approved'
),
(
  'Toda Community',
  'Nilgiri Hills, Tamil Nadu',
  'Craft Tradition & Architecture',
  'Anthropological Survey of India',
  'Known for their distinctive barrel-vaulted huts constructed using bamboo and rattan, and unique red-and-black embroidery (Pukhoor) on white cotton canvas.',
  'approved'
),
(
  'Kani Tribe',
  'Agasthyamalai Hills, Kerala',
  'Medicinal Practice',
  'Tropical Botanic Garden and Research Institute (TBGRI)',
  'Custodians of the medicinal plant Arogyapacha (Trichopus zeylanicus), known for its anti-fatigue and immune-enhancing properties.',
  'approved'
);

-- 5. Citations
INSERT INTO public.citations (title, authors, source, year, citation_type, domain, abstract, status)
VALUES
(
  'The Wonder That Was India',
  'A. L. Basham',
  'Sidgwick and Jackson',
  '1954',
  'book',
  'History',
  'A comprehensive survey of the history and culture of the Indian sub-continent from the dawn of civilization to the coming of the Muslims.',
  'approved'
),
(
  'Early India: From the Origins to AD 1300',
  'Romila Thapar',
  'University of California Press',
  '2002',
  'book',
  'History',
  'A masterly history of early India tracing the evolution of civilization from prehistoric roots to the second millennium.',
  'approved'
);

-- 6. Research Submissions
INSERT INTO public.research_submissions (paper_title, authors, affiliation, domain, abstract, journal, publication_year, keywords, status)
VALUES
(
  'Acoustic Resonance in Chola Temples',
  'Dr. Meenakshi Sundaram',
  'IIT Madras',
  'Architecture',
  'This paper analyzes the acoustic properties of the mandapa columns in the Brihadeeshwara Temple, proving they act as tuned resonators producing distinct musical frequencies when struck.',
  'Journal of Acoustical Society of India',
  '2019',
  ARRAY['Acoustics', 'Chola Architecture', 'Archaeoacoustics'],
  'approved'
),
(
  'Metallurgical Advancements in Ancient Zinc Extraction',
  'Prof. R.K. Dube',
  'Banaras Hindu University',
  'Science',
  'A study on the ancient zinc smelting processes at Zawar, Rajasthan (c. 12th century CE), demonstrating the use of distillation techniques predating European methods by centuries.',
  'Indian Journal of History of Science',
  '2015',
  ARRAY['Metallurgy', 'Zinc', 'Zawar', 'History of Science'],
  'approved'
);

-- 7. Resource Tracker (some dummy records to test the admin tab)
INSERT INTO public.resource_tracker (title, resource_type, mime_type, file_size_bytes, source_table)
VALUES
(
  'chola_acoustics_analysis_v2.pdf',
  'research',
  'application/pdf',
  4521098,
  'research_submissions'
),
(
  'brihadeeshwara_elevation.jpg',
  'site',
  'image/jpeg',
  1048576,
  'architecture_sites'
),
(
  'Isha_Upanishad_Translation.docx',
  'manuscript',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  256000,
  'manuscripts'
);

-- ==========================================
-- 8. Admin User Seed
-- ==========================================

-- This creates an admin user (admin@digitalnalanda.org / AdminPass123!)
-- NOTE: In Supabase, creating an auth user directly via SQL requires inserting
-- into auth.users and generating the correct UUIDs and bcrypt hash.
-- Using a known pre-hashed password for "AdminPass123!":
-- bcrypt hash: $2a$10$wT33K29A4a0f4p/9qT8PmeH4VvqH1iH6UeQ4h2y6q9L2l2wD2aP/u
-- We use a fixed UUID so we can easily link the profile and roles.

DO $$
DECLARE
  admin_uid UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- 1. Insert into auth.users (if not exists)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = admin_uid) THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      admin_uid,
      '00000000-0000-0000-0000-000000000000',
      'admin@digitalnalanda.org',
      '$2a$10$wT33K29A4a0f4p/9qT8PmeH4VvqH1iH6UeQ4h2y6q9L2l2wD2aP/u', -- "AdminPass123!"
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Nalanda Admin"}',
      now(),
      now(),
      'authenticated',
      '',
      '',
      '',
      ''
    );
  END IF;

  -- 2. Insert into auth.identities
  IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = admin_uid) THEN
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      admin_uid,
      admin_uid,
      format('{"sub":"%s","email":"%s"}', admin_uid::text, 'admin@digitalnalanda.org')::jsonb,
      'email',
      admin_uid::text, -- Or 'admin@digitalnalanda.org' occasionally depending on version, since identity_data->>sub corresponds to provider_id in newer versions
      now(),
      now(),
      now()
    );
  END IF;

  -- 3. Ensure profile exists and has the correct label
  INSERT INTO public.profiles (id, full_name, institution, role_label)
  VALUES (
    admin_uid,
    'Nalanda Admin',
    'Digital Nalanda Foundation',
    'Chief Administrator'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = 'Nalanda Admin',
    institution = 'Digital Nalanda Foundation',
    role_label = 'Chief Administrator';

  -- 4. Assign the 'admin' app_role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (admin_uid, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

END $$;

