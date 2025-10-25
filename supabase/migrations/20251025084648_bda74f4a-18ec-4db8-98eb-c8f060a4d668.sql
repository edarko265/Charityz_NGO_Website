-- Populate projects table with initial data if empty
INSERT INTO projects (
  title, 
  location, 
  description, 
  category, 
  status, 
  progress, 
  beneficiaries, 
  start_date, 
  budget, 
  raised,
  images
)
SELECT * FROM (VALUES
  (
    'Clean Water Initiative - Nakuru',
    'Nakuru County, Kenya',
    'Building sustainable water systems including wells, pumps, and distribution networks to provide clean drinking water to remote communities. This comprehensive water project addresses the critical need for clean, accessible water in rural Nakuru County.',
    'Water & Sanitation',
    'Active',
    75,
    1200,
    'March 2024',
    100000,
    75000,
    '[]'::jsonb
  ),
  (
    'Education for All - San Pedro',
    'San Pedro, Guatemala',
    'Constructed a school and provided educational resources for underprivileged children in rural Guatemala. A complete educational facility including 6 classrooms, library, computer lab, and playground.',
    'Education',
    'Completed',
    100,
    300,
    'January 2023',
    160000,
    160000,
    '[]'::jsonb
  ),
  (
    'Community Health Center - Mindanao',
    'Mindanao, Philippines',
    'Establishing a healthcare facility to serve rural communities with basic medical services, maternal care, and health education. This healthcare initiative will provide essential medical services to underserved communities.',
    'Healthcare',
    'Planning',
    25,
    2000,
    'July 2024',
    240000,
    60000,
    '[]'::jsonb
  ),
  (
    'Sustainable Agriculture Program',
    'Masaka, Uganda',
    'Training farmers in sustainable agriculture techniques and providing seeds, tools, and microfinance support. Empowering local farmers with knowledge and resources for sustainable farming practices.',
    'Agriculture',
    'Active',
    60,
    800,
    'September 2023',
    120000,
    88000,
    '[]'::jsonb
  ),
  (
    'Emergency Relief - Flood Response',
    'Sylhet, Bangladesh',
    'Provided emergency relief including food, clean water, shelter materials, and medical aid to flood-affected communities. Rapid response to severe flooding that displaced thousands of families.',
    'Emergency Relief',
    'Completed',
    100,
    1500,
    'August 2023',
    80000,
    80000,
    '[]'::jsonb
  )
) AS v(title, location, description, category, status, progress, beneficiaries, start_date, budget, raised, images)
WHERE NOT EXISTS (
  SELECT 1 FROM projects WHERE title = v.title
);