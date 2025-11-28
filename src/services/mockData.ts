// Mock data for development - replace with real API calls

export const mockOrganizations = [
  { 
    id: '1', 
    name: 'Healthcare Alliance', 
    entity_id: 'ORG-001', 
    entity_owner_email: 'admin@healthcare.com',
    entity_primary_phone: '555-1000',
    description: 'Leading healthcare organization',
    contact_email: 'contact@healthcare.com',
    contact_phone: '555-1001',
    address: '100 Medical Plaza, Healthcare City, HC 10001',
    entity_legal_documents: [],
    is_active: true,
    created_at: '2024-01-15' 
  },
  { 
    id: '2', 
    name: 'Medical Research Group', 
    entity_id: 'ORG-002', 
    entity_owner_email: 'contact@mrg.com',
    entity_primary_phone: '555-2000',
    description: 'Advanced research organization',
    contact_email: 'info@mrg.com',
    contact_phone: '555-2001',
    address: '200 Research Blvd, Science Park, SP 20002',
    entity_legal_documents: [],
    is_active: true,
    created_at: '2024-02-20' 
  },
  { 
    id: '3', 
    name: 'Clinical Partners Network', 
    entity_id: 'ORG-003', 
    entity_owner_email: 'info@cpn.com',
    entity_primary_phone: '555-3000',
    description: 'Clinical network provider',
    contact_email: 'contact@cpn.com',
    contact_phone: '555-3001',
    address: '300 Clinical Ave, Partner City, PC 30003',
    entity_legal_documents: [],
    is_active: true,
    created_at: '2024-03-10' 
  },
];

export const mockSponsors = [
  { id: '1', name: 'PharmaCorp Inc', entity_id: 'SPO-001', owner_email: 'trials@pharmacorp.com', primary_phone: '555-1100', address: '100 Pharma St', contact_person: 'John Smith', contact_email: 'john@pharmacorp.com', contact_phone: '555-1101', entity_legal_documents: [], is_active: true, created_at: '2024-01-01' },
  { id: '2', name: 'BioTech Solutions', entity_id: 'SPO-002', owner_email: 'research@biotech.com', primary_phone: '555-1200', address: '200 Bio Ave', contact_person: 'Jane Doe', contact_email: 'jane@biotech.com', contact_phone: '555-1201', entity_legal_documents: [], is_active: true, created_at: '2024-02-01' },
  { id: '3', name: 'MedResearch Labs', entity_id: 'SPO-003', owner_email: 'contact@medresearch.com', primary_phone: '555-1300', address: '300 Med Blvd', contact_person: 'Bob Johnson', contact_email: 'bob@medresearch.com', contact_phone: '555-1301', entity_legal_documents: [], is_active: true, created_at: '2024-03-01' },
];

export const mockSites = [
  { id: '1', name: 'Downtown Medical Center', entity_id: 'SITE-001', owner_email: 'admin@downtown.med', location: 'New York, NY', organization_id: '1', primary_phone: '555-2100', address: '100 Downtown St', contact_person: 'Admin User', contact_email: 'contact@downtown.med', contact_phone: '555-2101', is_active: true, created_at: '2024-01-15' },
  { id: '2', name: 'University Hospital', entity_id: 'SITE-002', owner_email: 'research@univ.hospital', location: 'Boston, MA', organization_id: '1', primary_phone: '555-2200', address: '200 University Ave', contact_person: 'Research Coord', contact_email: 'contact@univ.hospital', contact_phone: '555-2201', is_active: true, created_at: '2024-02-01' },
  { id: '3', name: 'Regional Clinic Network', entity_id: 'SITE-003', owner_email: 'coordinator@regional.clinic', location: 'Chicago, IL', organization_id: '2', primary_phone: '555-2300', address: '300 Regional Blvd', contact_person: 'Clinic Manager', contact_email: 'contact@regional.clinic', contact_phone: '555-2301', is_active: true, created_at: '2024-03-01' },
];

export const mockTrials = [
  { id: '1', name: 'Diabetes Treatment Study', nct_id: 'NCT12345678', status: 'active', description: 'Study on diabetes treatment', start_date: '2024-01-01', end_date: '2025-01-01', created_at: '2024-01-01' },
  { id: '2', name: 'Cardiovascular Prevention Trial', nct_id: 'NCT87654321', status: 'recruiting', description: 'Prevention trial for cardiovascular disease', start_date: '2024-02-01', end_date: '2025-02-01', created_at: '2024-02-01' },
  { id: '3', name: 'Cancer Immunotherapy Phase II', nct_id: 'NCT11223344', status: 'active', description: 'Phase II immunotherapy study', start_date: '2024-03-01', end_date: '2025-03-01', created_at: '2024-03-01' },
];

export const mockProviders = [
  { id: '1', name: 'Dr. Sarah Johnson', entity_id: 'PROV-001', owner_email: 'sjohnson@medical.com', specialty: 'Cardiology', first_name: 'Sarah', last_name: 'Johnson', email: 'sjohnson@medical.com', phone: '555-0201', site_id: '1', created_at: '2024-01-01' },
  { id: '2', name: 'Dr. Michael Chen', entity_id: 'PROV-002', owner_email: 'mchen@clinic.com', specialty: 'Oncology', first_name: 'Michael', last_name: 'Chen', email: 'mchen@clinic.com', phone: '555-0202', site_id: '2', created_at: '2024-02-01' },
  { id: '3', name: 'Dr. Emily Rodriguez', entity_id: 'PROV-003', owner_email: 'erodriguez@health.com', specialty: 'Endocrinology', first_name: 'Emily', last_name: 'Rodriguez', email: 'erodriguez@health.com', phone: '555-0203', site_id: '3', created_at: '2024-03-01' },
];

export const mockPatients = [
  { id: '1', patient_id: 'P001', first_name: 'John', last_name: 'Doe', email: 'john.doe@email.com', phone: '555-0101', status: 'active', date_of_birth: '1985-05-15', gender: 'male', site_id: '1', enrollment_date: '2024-01-10', created_at: '2024-01-10' },
  { id: '2', patient_id: 'P002', first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@email.com', phone: '555-0102', status: 'active', date_of_birth: '1990-08-22', gender: 'female', site_id: '2', enrollment_date: '2024-02-15', created_at: '2024-02-15' },
  { id: '3', patient_id: 'P003', first_name: 'Robert', last_name: 'Johnson', email: 'robert.j@email.com', phone: '555-0103', status: 'active', date_of_birth: '1978-12-03', gender: 'male', site_id: '1', enrollment_date: '2024-03-20', created_at: '2024-03-20' },
];

export const mockUsers = [
  { id: '1', email: 'admin@system.com', role: 'super-admin', entity_type: 'organization', entity_id: '1', is_active: true, created_at: '2024-01-01' },
  { id: '2', email: 'manager@org.com', role: 'multi-site-management', entity_type: 'organization', entity_id: '1', is_active: true, created_at: '2024-01-15' },
  { id: '3', email: 'sponsor@pharma.com', role: 'sponsor', entity_type: 'sponsor', entity_id: '1', is_active: true, created_at: '2024-02-01' },
  { id: '4', email: 'site.admin@downtown.med', role: 'site', entity_type: 'site', entity_id: '1', is_active: true, created_at: '2024-01-10' },
  { id: '5', email: 'provider@clinic.com', role: 'provider', entity_type: 'provider', entity_id: '1', is_active: true, created_at: '2024-01-20' },
];
