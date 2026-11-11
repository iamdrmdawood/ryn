import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory data storage with initial seed records
const donationsDb = [
  {
    id: 'don-101',
    referenceNumber: 'RYN-DON-2026-0814',
    donorName: 'Ahmed Tariq',
    donorEmail: 'ahmed.t@example.com',
    donorPhone: '+92 321 5554321',
    category: 'Food Drive',
    amount: 10000,
    paymentMethod: 'Easypaisa',
    transactionId: 'EP8492019482',
    transactionDate: '2026-11-08',
    status: 'Verified',
    message: 'May this provide nutritious food to families in need.',
    isAnonymous: false,
    adminNotes: 'Payment verified against Easypaisa statement. Receipt issued.',
    verifiedAt: '2026-11-09T10:30:00Z',
    verifiedBy: 'Finance Administrator',
    createdAt: '2026-11-08T15:20:00Z'
  },
  {
    id: 'don-102',
    referenceNumber: 'RYN-DON-2026-0815',
    donorName: 'Anonymous Donor',
    donorEmail: 'supporter@domain.org',
    donorPhone: '+92 300 1234567',
    category: 'Water Drive',
    amount: 5000,
    paymentMethod: 'Easypaisa',
    transactionId: 'EP9920194012',
    transactionDate: '2026-11-09',
    status: 'Verified',
    message: 'For summer heat hydration drive.',
    isAnonymous: true,
    adminNotes: 'Verified via Easypaisa SMS alert.',
    verifiedAt: '2026-11-09T14:45:00Z',
    verifiedBy: 'Finance Administrator',
    createdAt: '2026-11-09T08:10:00Z'
  },
  {
    id: 'don-103',
    referenceNumber: 'RYN-DON-2026-0816',
    donorName: 'Sana Fatima',
    donorEmail: 'sana.fatima@gmail.com',
    donorPhone: '+92 333 7894561',
    category: 'Education Support',
    amount: 25000,
    paymentMethod: 'Easypaisa',
    transactionId: 'EP7719402910',
    transactionDate: '2026-11-10',
    status: 'Pending Verification',
    message: 'Sponsoring school kits for deserving young students.',
    isAnonymous: false,
    createdAt: '2026-11-10T16:00:00Z'
  }
];

const collaborationsDb: any[] = [
  {
    id: 'col-201',
    referenceNumber: 'RYN-COL-2026-0042',
    fullName: 'Kamran Siddiqui',
    organizationName: 'Allied Tech Innovations',
    designation: 'Head of CSR',
    officialEmail: 'csr@alliedtech.pk',
    contactNumber: '+92 300 9876543',
    country: 'Pakistan',
    city: 'Lahore',
    category: 'CSR Initiatives',
    projectTitle: 'Solar-Powered Youth Digital Learning Hubs',
    description: 'Proposed joint CSR project to equip 2 community schools with refurbished laptops, solar power backups, and RYN digital literacy mentors.',
    expectedContribution: 'Hardware sponsorship and co-branding',
    proposedFundingAmount: 'PKR 850,000',
    partnershipDuration: '12 Months',
    status: 'In Discussion',
    createdAt: '2026-11-05T12:00:00Z'
  }
];

const volunteersDb = [
  {
    id: 'vol-301',
    referenceNumber: 'RYN-VOL-2026-0112',
    fullName: 'Hamza Bilal',
    email: 'hamza.bilal@gmail.com',
    phone: '+92 312 3456789',
    city: 'Lahore',
    age: 22,
    education: 'BS Computer Science (3rd Year)',
    skills: 'Web design, graphic design, social media content, logistics coordination',
    areasOfInterest: ['Digital Literacy', 'Food Distribution', 'Marketing'],
    availability: 'Weekends & Evenings (10 hrs/week)',
    previousExperience: 'Organized campus flood relief drive in 2024.',
    motivation: 'I want to give back to underserved youth and help teach them programming and digital skills.',
    status: 'Approved',
    createdAt: '2026-11-04T14:15:00Z'
  }
];

const educationDb: any[] = [];

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Endpoints
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      organization: 'Radiant Youth Network',
      established: 2023,
      founder: 'Ms. Zainab Asif'
    });
  });

  // Donations API
  app.get('/api/donations', (req, res) => {
    res.json(donationsDb);
  });

  app.post('/api/donations', (req, res) => {
    const newDonation = req.body;
    donationsDb.unshift(newDonation);
    res.status(201).json(newDonation);
  });

  app.patch('/api/donations/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, adminNotes, verifiedBy } = req.body;
    const index = donationsDb.findIndex(d => d.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    donationsDb[index] = {
      ...donationsDb[index],
      status,
      adminNotes: adminNotes || donationsDb[index].adminNotes,
      verifiedAt: status === 'Verified' ? new Date().toISOString() : donationsDb[index].verifiedAt,
      verifiedBy: status === 'Verified' ? verifiedBy || 'Finance Administrator' : donationsDb[index].verifiedBy
    };
    res.json(donationsDb[index]);
  });

  // Collaborations API
  app.get('/api/collaborations', (req, res) => {
    res.json(collaborationsDb);
  });

  app.post('/api/collaborations', (req, res) => {
    const proposal = req.body;
    collaborationsDb.unshift(proposal);
    res.status(201).json(proposal);
  });

  app.patch('/api/collaborations/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    const index = collaborationsDb.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    collaborationsDb[index] = {
      ...collaborationsDb[index],
      status,
      notes: notes || collaborationsDb[index].notes
    };
    res.json(collaborationsDb[index]);
  });

  // Volunteers API
  app.get('/api/volunteers', (req, res) => {
    res.json(volunteersDb);
  });

  app.post('/api/volunteers', (req, res) => {
    const volunteer = req.body;
    volunteersDb.unshift(volunteer);
    res.status(201).json(volunteer);
  });

  // Education Applications API
  app.get('/api/education-applications', (req, res) => {
    res.json(educationDb);
  });

  app.post('/api/education-applications', (req, res) => {
    const appRecord = req.body;
    educationDb.unshift(appRecord);
    res.status(201).json(appRecord);
  });

  // Serve static assets and Vite middlewares
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Radiant Youth Network Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
