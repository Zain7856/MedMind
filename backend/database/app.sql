-- MedMind database: 5 tables.
-- Run it with: npm run db:reset (from the backend folder).

PRAGMA foreign_keys = ON;

-- Everybody is a user: patients, doctors, hospitals and the admin.
-- Doctors and hospitals also fill in the listing columns (Specialization ... Services).
CREATE TABLE users (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  Name TEXT NOT NULL,
  Email TEXT UNIQUE NOT NULL,
  Password TEXT NOT NULL,
  Age INTEGER,
  Phone TEXT,
  Role TEXT NOT NULL CHECK (Role IN ('Patient', 'Doctor', 'Hospital', 'Admin')) DEFAULT 'Patient',
  Specialization TEXT,
  Location TEXT,
  Cost NUMERIC,
  About TEXT,
  Img TEXT,
  Services TEXT,
  -- 'Rejected' also means blocked: a rejected user cannot sign in.
  ApprovalStatus TEXT NOT NULL CHECK (ApprovalStatus IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending'
);

CREATE TABLE symptoms (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  Name TEXT NOT NULL,
  Description TEXT
);

CREATE TABLE diseases (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  Name TEXT NOT NULL,
  Description TEXT,
  Treatment TEXT
);

-- One row = one symptom that belongs to one disease.
CREATE TABLE symptomdiseases (
  SymptomID INTEGER NOT NULL,
  DiseaseID INTEGER NOT NULL,
  PRIMARY KEY (SymptomID, DiseaseID),
  FOREIGN KEY (SymptomID) REFERENCES symptoms(ID) ON DELETE CASCADE,
  FOREIGN KEY (DiseaseID) REFERENCES diseases(ID) ON DELETE CASCADE
);

-- ProviderID is the doctor's or the hospital's user ID.
-- Deleting either person deletes their appointments too.
CREATE TABLE appointments (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  UserID INTEGER NOT NULL,
  ProviderID INTEGER NOT NULL,
  AppointmentDate TEXT NOT NULL,
  Status TEXT NOT NULL CHECK (Status IN ('Pending', 'Confirmed', 'Cancelled')) DEFAULT 'Pending',
  FOREIGN KEY (UserID) REFERENCES users(ID) ON DELETE CASCADE,
  FOREIGN KEY (ProviderID) REFERENCES users(ID) ON DELETE CASCADE
);

-- Demo logins (all passwords are plain text, see the README Limits):
--   Admin    admin@medmind.com                   admin123
--   Patient  omar@example.com                    p@ssword123
--   Doctor   dromarali@medmind-doc.com           password123
--   Hospital citygeneralhospital@medmind-hos.com password123

-- Seed data for users
INSERT INTO users (ID, Name, Email, Password, Age, Phone, Role, ApprovalStatus) VALUES
  (1,  'Admin',               'admin@medmind.com',      'admin123',    NULL, '01000000000', 'Admin',   'Approved'),
  (2,  'Omar Ali',            'omar@example.com',       'p@ssword123', 22,   '01012345678', 'Patient', 'Approved'),
  (3,  'Sara Ahmed',          'sara@example.com',       'p@ssword123', 19,   '01098765432', 'Patient', 'Approved'),
  (4,  'Laila Selim',         'laila@example.com',      'p@ssword123', 28,   '01122334455', 'Patient', 'Approved'),
  (5,  'Ahmed Fawzy',         'ahmed@example.com',      'p@ssword123', 35,   '01233445566', 'Patient', 'Approved'),
  (6,  'Hanya Mansour',       'hanya@example.com',      'p@ssword123', 31,   '01011223344', 'Patient', 'Approved'),
  (7,  'Ziad Mostafa',        'ziad@example.com',       'p@ssword123', 24,   '01555666777', 'Patient', 'Approved'),
  (8,  'Mariam Nour',         'mariam@example.com',     'p@ssword123', 42,   '01099887766', 'Patient', 'Approved'),
  (13, 'Extra Patient',       'extra@example.com',      'p@ssword123', 30,   '01111111111', 'Patient', 'Approved');

-- Doctors (role-specific fields merged into users)
INSERT INTO users (ID, Name, Email, Password, Age, Phone, Role, Specialization, Location, Cost, About, Img, ApprovalStatus) VALUES
  (14, 'Dr. Omar Ali',       'dromarali@medmind-doc.com', 'password123', 40, '01011112222', 'Doctor', 'General Practice', 'Cairo', 300, NULL, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400', 'Approved'),
  (15, 'Dr. Ahmed Zaki',     'drahmedzaki@medmind-doc.com', 'p@ssword123', 22, '01122334455', 'Doctor', 'Cardiology', 'Giza', 600, NULL, 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400', 'Approved'),
  (16, 'Dr. Sarah Ezzat',    'dsarahzezzat@medmind-doc.com', 'p@ssword123', 35, '01233445566', 'Doctor', 'Neurology', 'Alexandria', 550, NULL, 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400', 'Approved'),
  (17, 'Dr. Mahmoud Hassan', 'drmahmoudhassan@medmind-doc.com', 'password123', 40, '01033334444', 'Doctor', 'Endocrinology', 'Cairo', 450, NULL, 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400', 'Approved'),
  (18, 'Dr. Mona Salem',     'drmonasalem@medmind-doc.com',  'password123', 40, '01155667788', 'Doctor', 'Pediatrics',      'Mansoura', 350, NULL, 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400', 'Approved'),
  (19, 'Dr. Khalid Nour',    'drkhalidnour@medmind-doc.com', 'password123', 40, '01055566677', 'Doctor', 'Orthopedics',     'Tanta',  500, NULL, 'https://images.unsplash.com/photo-1612273576881-2287c6b96e62?w=400', 'Approved'),
  (20, 'Dr. Fatma Khalil',   'drfatmakhalil@medmind-doc.com','password123', 40, '01222334455', 'Doctor', 'Dermatology',     'Luxor',  400, NULL, 'https://images.unsplash.com/photo-1594311434241-dfbf02347bd7?w=400', 'Approved'),
  (21, 'Dr. Yasser Adel',    'dryasseradel@medmind-doc.com', 'password123', 40, '01188990011', 'Doctor', 'Urology',          'Aswan',  480, NULL, 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400', 'Approved'),
  (22, 'Dr. Reem Taha',      'drreemtaha@medmind-doc.com',   'password123', 40, '01000112233', 'Doctor', 'Psychiatry',       'Sharm El Sheikh', 700, NULL, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', 'Approved'),
  (23, 'Dr. Sameh Fouad',    'drsamehfouad@medmind-doc.com', 'password123', 40, '01144556677', 'Doctor', 'ENT',              'Hurghada', 420, NULL, 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400', 'Approved'),
  (24, 'Dr. Hend Morsy',     'drhendmorsy@medmind-doc.com',   'password123', 40, '01066778899', 'Doctor', 'Gynecology',       'Ismailia', 520, NULL, 'https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400', 'Approved'),
  (25, 'Dr. Walid Refaat',   'drwalidrefaat@medmind-doc.com', 'password123', 40, '01555443322', 'Doctor', 'Ophthalmology',    'Suez',   460, NULL, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', 'Approved'),
  (26, 'Dr. Dina Kamel',     'drdinakamel@medmind-doc.com',   'password123', 40, '01077889900', 'Doctor', 'Oncology',         'Cairo',  800, NULL, 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400', 'Approved'),
  (27, 'Dr. Tarek Hegazi',   'drtarekhegazi@medmind-doc.com', 'password123', 40, '01111222333', 'Doctor', 'Pulmonology',      'Alexandria', 580, NULL, 'https://images.unsplash.com/photo-1542884748-2b87b36c6b90?w=400', 'Approved'),
  (28, 'Dr. Inas Hamdy',     'drinashamdy@medmind-doc.com',   'password123', 40, '01222114455', 'Doctor', 'Rheumatology',     'Giza',   490, NULL, 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400', 'Approved');

-- Hospitals (role-specific fields merged into users)
INSERT INTO users (ID, Name, Email, Password, Phone, Role, Location, Services, Img, ApprovalStatus) VALUES
  (29, 'City General Hospital',       'citygeneralhospital@medmind-hos.com', 'password123', NULL, 'Hospital', 'Cairo Central', NULL, 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800', 'Approved'),
  (30, 'HealthCare Medical Center',   'healthcaremedicalcenter@medmind-hos.com', 'password123', NULL, 'Hospital', 'Alexandria Harbor', NULL, 'https://images.unsplash.com/photo-1586773860418-d3b9795056f9?w=800', 'Approved'),
  (31, 'Nile Valley Hospital',        'nilevalleyhospital@medmind-hos.com', 'password123', NULL, 'Hospital', 'Giza Pyramid Road', NULL, 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=800', 'Approved'),
  (32, 'Delta Care Hospital',         'deltacarehospital@medmind-hos.com', 'password123', NULL, 'Hospital', 'Mansoura University', NULL, 'https://images.unsplash.com/photo-16549655169-df83a0774514?w=800', 'Approved'),
  (33, 'Red Sea Medical',             'redseamedical@medmind-hos.com', 'password123', NULL, 'Hospital', 'Hurghada Coast', NULL, 'https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?w=800', 'Approved'),
  (34, 'Aswan Royal Hospital',        'aswanroyalhospital@medmind-hos.com', 'password123', NULL, 'Hospital', 'Aswan City Center', NULL, 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800', 'Approved'),
  (35, 'Sinai Oasis Clinic',          'sinaioasisclinic@medmind-hos.com', 'password123', NULL, 'Hospital', 'Sharm El Sheikh Square', NULL, 'https://images.unsplash.com/photo-1502740479796-62da97840190?w=800', 'Approved'),
  (36, 'Port Said Hope Hospital',     'portsaidhopehospital@medmind-hos.com', 'password123', NULL, 'Hospital', 'Port Said Entrance', NULL, 'https://images.unsplash.com/photo-1513224502586-d1e602410265?w=800', 'Approved'),
  (37, 'Tanta Advanced Medical',      'tantaadvancedmedical@medmind-hos.com', 'password123', NULL, 'Hospital', 'Tanta Main Street', NULL, 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800', 'Approved'),
  (38, 'Luxor Heritage Hospital',     'luxorheritagehospital@medmind-hos.com', 'password123', NULL, 'Hospital', 'Luxor East Bank', NULL, 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=800', 'Approved');

-- Seed data for symptoms
INSERT INTO symptoms (ID, Name, Description) VALUES
  (1,  'Headache',        'Pain or discomfort in the head, scalp, or neck area.'),
  (2,  'Fever',           'An elevation in body temperature above the normal range (37°C or 98.6°F).'),
  (3,  'Cough',           'A sudden, forceful expulsion of air from the lungs, can be dry or productive.'),
  (4,  'Fatigue',         'A persistent feeling of tiredness, weariness, or lack of energy.'),
  (5,  'Nausea',          'A sensation of unease and discomfort in the upper stomach with an urge to vomit.'),
  (6,  'Shortness of Breath', 'Difficulty breathing or the feeling of breathlessness (dyspnea).'),
  (7,  'Chest Pain',      'Discomfort or pain felt anywhere along the front of the body between the neck and upper abdomen.'),
  (8,  'Dizziness',       'A sensation of spinning or lightheadedness, affecting balance.'),
  (9,  'Sore Throat',     'Pain, scratchiness, or irritation of the throat that often worsens when swallowing.'),
  (10, 'Muscle Aches',    'Pain or discomfort in the muscles, often caused by tension or infection.'),
  (11, 'Loss of Taste or Smell', 'Anosmia or ageusia, a reduced ability to perceive scents or flavors.'),
  (12, 'Rash',            'An area of irritated or swollen skin, often red, itchy, or painful.'),
  (13, 'Joint Pain',      'Discomfort, pain, or inflammation in any of the body''s joints.'),
  (14, 'Chills',          'A feeling of coldness with shivering, often preceding a fever.'),
  (15, 'Sweating',        'The production of moisture from sweat glands, can be excessive (diaphoresis).'),
  (16, 'Anxiety',         'Feelings of worry, nervousness, or unease about an uncertain outcome.'),
  (17, 'Insomnia',        'Difficulty falling asleep or staying asleep through the night.'),
  (18, 'Weight Loss',     'An unintentional reduction in total body mass.'),
  (19, 'Bloating',        'Abdominal swelling or fullness, often due to digestive gas.'),
  (20, 'Constipation',    'Infrequent or difficult evacuation of the bowels.'),
  (21, 'Diarrhea',        'Frequent passage of loose, watery stools.'),
  (22, 'Abdominal Pain',  'Pain or cramping in the stomach or intestinal area.'),
  (23, 'Sneezing',        'A sudden, involuntary expulsion of air through the nose and mouth.'),
  (24, 'Runny Nose',      'Excessive nasal discharge or congestion.'),
  (25, 'Blurred Vision',  'A lack of sharpness of vision resulting in inability to see fine detail.'),
  (26, 'Thirst',          'An intense desire to drink fluids, often Excessive thirst (polydipsia).'),
  (27, 'Frequent Urination', 'The need to urinate more often than usual (polyuria).'),
  (28, 'Heartburn',       'A burning sensation in the chest, usually occurring after eating.'),
  (29, 'Dry Skin',        'Rough, scaly, or itchy skin due to lack of moisture.'),
  (30, 'Tremors',         'Involuntary, rhythmic muscle movements.'),
  (31, 'Weight gain',     NULL);

-- Seed data for diseases
INSERT INTO diseases (ID, Name, Description, Treatment) VALUES
  (1,  'Seasonal Flu',       'A contagious respiratory illness caused by influenza viruses.', 'Rest, hydration, and antivirals if necessary.'),
  (2,  'COVID-19',           'An infectious disease caused by the SARS-CoV-2 virus.', 'Symptomatic care, isolation, and antivirals for severe cases.'),
  (3,  'Migraine',           'A neurological condition that causes intense, debilitating headaches.', 'Pain relief, hydration, and avoiding triggers.'),
  (4,  'Type 2 Diabetes',    'A chronic condition that affects how the body processes blood sugar.', 'Dietary control, exercise, and insulin or oral medications.'),
  (5,  'Hypertension',       'A long-term medical condition where blood pressure is persistently elevated.', 'Lifestyle changes and antihypertensive medication.'),
  (6,  'Asthma',             'A condition where the airways narrow and swell and may produce extra mucus.', 'Inhalers and avoiding environmental triggers.'),
  (7,  'GERD',               'A digestive disorder where stomach acid flows back into the esophagus.', 'Antacids, avoiding spicy foods, and weight management.'),
  (8,  'Viral Gastroenteritis', 'An intestinal infection marked by diarrhea, cramps, and nausea.', 'Rehydration and resting the digestive system.'),
  (9,  'Iron Deficiency Anemia', 'A condition where blood lacks adequate healthy red blood cells.', 'Iron supplements and iron-rich diet.'),
  (10, 'Common Cold',        'A viral infection of the upper respiratory tract.', 'Rest, fluids, and over-the-counter remedies.'),
  (11, 'Clinical Depression', 'A mental health disorder characterized by persistent low mood.', 'Therapy, social support, and antidepressant medication.'),
  (12, 'Arthritis',          'The swelling and tenderness of one or more joints.', 'Physical therapy and anti-inflammatory drugs.'),
  (13, 'Allergic Rhinitis',  'Inflammation in the nose which occurs when the immune system overreacts to allergens.', 'Antihistamines and avoiding allergens.'),
  (14, 'Hyperthyroidism',    'Overactivity of the thyroid gland, resulting in a rapid heartbeat.', 'Anti-thyroid medication and specialist care.'),
  (15, 'Hypothyroidism',     'Underactivity of the thyroid gland, leading to slow metabolism.', 'Thyronine replacement therapy.'),
  (16, 'Gastritis',          'Inflammation, irritation, or erosion of the lining of the stomach.', 'Avoiding irritating substances and antacids.'),
  (17, 'Pneumonia',          'An infection that inflames the air sacs in one or both lungs.', 'Antibiotics or antivirals depending on the cause.'),
  (18, 'IBS',                'A common disorder that affects the large intestine.', 'Stress management and dietary changes.'),
  (19, 'Panic Disorder',     'An anxiety disorder where you regularly have sudden attacks of panic or fear.', 'Therapy and cognitive behavioral management.'),
  (20, 'Ophthalmic Herpes',  'A viral infection of the eye that can cause vision loss.', 'Antiviral eye drops and specialist monitoring.');

-- Seed data for symptomdiseases
INSERT INTO symptomdiseases (SymptomID, DiseaseID) VALUES (2, 1), (10, 1), (14, 1), (1, 1), (4, 1),
  (2, 2), (3, 2), (11, 2), (6, 2),
  (1, 3), (5, 3), (8, 3), (25, 3),
  (26, 4), (27, 4), (4, 4), (25, 4),
  (1, 5), (8, 5), (7, 5), (6, 5),
  (6, 6), (7, 6),
  (28, 7), (7, 7), (5, 7), (19, 7),
  (21, 8), (5, 8), (22, 8), (2, 8),
  (4, 9), (6, 9), (8, 9), (14, 9),
  (9, 10), (23, 10), (24, 10), (3, 10),
  (4, 11), (17, 11), (18, 11), (16, 11),
  (13, 12), (10, 12), (4, 12), (8, 12),
  (23, 13), (24, 13), (9, 13), (12, 13),
  (18, 14), (15, 14), (16, 14), (30, 14),
  (31, 15), (4, 15), (29, 15), (10, 15),
  (22, 16), (5, 16), (19, 16), (28, 16),
  (3, 17), (2, 17), (6, 17), (14, 17),
  (22, 18), (19, 18), (20, 18), (21, 18),
  (16, 19), (15, 19), (30, 19), (7, 19),
  (25, 20), (12, 20), (9, 20), (1, 20),
  (3, 1), (4, 2), (25, 1), (18, 15);


-- Seed data for appointments
INSERT INTO appointments (ID, UserID, ProviderID, AppointmentDate, Status) VALUES
  (1, 2, 29, '2027-01-20T10:00', 'Pending'),
  (2, 2, 14, '2027-01-21T14:00', 'Pending'),
  (3, 3, 14, '2027-01-22T09:30', 'Confirmed'),
  (4, 4, 15, '2027-02-03T16:00', 'Pending');
