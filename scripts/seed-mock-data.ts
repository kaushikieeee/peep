import * as fs from 'fs';
import * as path from 'path';

interface Report {
  id: number;
  lat: number;
  lng: number;
  category: string;
  severity: 'Low' | 'Medium' | 'High';
  note: string;
  reporter: string;
  date: string;
  imagePlaceholder: string;
  zone: string;
  upvotes: number;
  verified: boolean;
}

async function seedMockData() {
  const dataDir = path.join(process.cwd(), 'data');
  const jsonPath = path.join(dataDir, 'mock-reports.json');
  const csvPath = path.join(dataDir, 'mock-reports.csv');

  const reports: Report[] = [
    {
      id: 101,
      lat: 12.9716,
      lng: 77.5946,
      category: 'Damaged turf / turf runoff',
      severity: 'High',
      note: 'Blackish runoff after weekend game. Fibres visible.',
      reporter: 'Anita R.',
      date: '2025-10-12T08:30:00Z',
      imagePlaceholder: '/turf-runoff-fibres.jpg',
      zone: 'Zone P1',
      upvotes: 12,
      verified: true,
    },
    {
      id: 102,
      lat: 12.9719,
      lng: 77.5950,
      category: 'Stagnant water',
      severity: 'Medium',
      note: 'Stagnant pool near drainage, mosquitoes.',
      reporter: 'Ravi K.',
      date: '2025-10-11T09:05:00Z',
      imagePlaceholder: '/stagnant-water-drain.jpg',
      zone: 'Zone P1',
      upvotes: 8,
      verified: true,
    },
    {
      id: 103,
      lat: 12.9725,
      lng: 77.5938,
      category: 'Plastic / microplastics',
      severity: 'High',
      note: 'Plastic-rich sediment near roadside patch.',
      reporter: 'School PTA',
      date: '2025-10-09T16:20:00Z',
      imagePlaceholder: '/plastic-sediment-roadside.jpg',
      zone: 'Zone C2',
      upvotes: 15,
      verified: false,
    },
    {
      id: 104,
      lat: 12.9700,
      lng: 77.5940,
      category: 'Soil contamination',
      severity: 'Low',
      note: 'Dark residue but not sure if harmful.',
      reporter: 'Jogger',
      date: '2025-10-15T06:10:00Z',
      imagePlaceholder: '/dark-soil-residue.jpg',
      zone: 'Zone S3',
      upvotes: 3,
      verified: false,
    },
    {
      id: 105,
      lat: 12.9730,
      lng: 77.5960,
      category: 'Waste dumping',
      severity: 'Medium',
      note: 'Household waste dumped behind wall.',
      reporter: 'Neighbourhood Watch',
      date: '2025-10-05T12:00:00Z',
      imagePlaceholder: '/waste-dumping-small-heap.jpg',
      zone: 'Zone W1',
      upvotes: 6,
      verified: true,
    },
    {
      id: 106,
      lat: 12.9705,
      lng: 77.5935,
      category: 'Damaged turf / turf runoff',
      severity: 'Medium',
      note: 'Brown patches spreading across practice field.',
      reporter: 'Sports Coach',
      date: '2025-10-14T14:45:00Z',
      imagePlaceholder: '/brown-turf-patches.jpg',
      zone: 'Zone P2',
      upvotes: 5,
      verified: true,
    },
    {
      id: 107,
      lat: 12.9740,
      lng: 77.5955,
      category: 'Stagnant water',
      severity: 'High',
      note: 'Large stagnant pool with algae bloom, foul smell.',
      reporter: 'Local Resident',
      date: '2025-10-13T11:20:00Z',
      imagePlaceholder: '/algae-bloom-stagnant-pool.jpg',
      zone: 'Zone W2',
      upvotes: 18,
      verified: false,
    },
    {
      id: 108,
      lat: 12.9715,
      lng: 77.5965,
      category: 'Plastic / microplastics',
      severity: 'Medium',
      note: 'Microplastics in soil near construction site.',
      reporter: 'Environmental NGO',
      date: '2025-10-10T10:30:00Z',
      imagePlaceholder: '/microplastics-construction.jpg',
      zone: 'Zone C3',
      upvotes: 9,
      verified: true,
    },
    {
      id: 109,
      lat: 12.9710,
      lng: 77.5920,
      category: 'Waste dumping',
      severity: 'High',
      note: 'Dumped industrial containers near residential area.',
      reporter: 'Concerned Citizen',
      date: '2025-10-08T13:15:00Z',
      imagePlaceholder: '/industrial-waste-containers.jpg',
      zone: 'Zone W3',
      upvotes: 20,
      verified: false,
    },
    {
      id: 110,
      lat: 12.9745,
      lng: 77.5945,
      category: 'Soil contamination',
      severity: 'High',
      note: 'Chemical smell detected, soil discoloration.',
      reporter: 'Lab Assistant',
      date: '2025-10-07T09:00:00Z',
      imagePlaceholder: '/chemical-soil-contamination.jpg',
      zone: 'Zone S1',
      upvotes: 14,
      verified: true,
    },
    {
      id: 111,
      lat: 12.9695,
      lng: 77.5955,
      category: 'Damaged turf / turf runoff',
      severity: 'Low',
      note: 'Minor yellowing on edges, may recover with rain.',
      reporter: 'Groundskeeper',
      date: '2025-10-16T07:30:00Z',
      imagePlaceholder: '/yellowing-turf-edges.jpg',
      zone: 'Zone P3',
      upvotes: 2,
      verified: false,
    },
    {
      id: 112,
      lat: 12.9735,
      lng: 77.5930,
      category: 'Other',
      severity: 'Low',
      note: 'Unusual discoloration, unsure of cause.',
      reporter: 'Park Visitor',
      date: '2025-10-06T15:40:00Z',
      imagePlaceholder: '/soil-discoloration.jpg',
      zone: 'Zone O1',
      upvotes: 1,
      verified: false,
    },
  ];

  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write JSON
  fs.writeFileSync(jsonPath, JSON.stringify(reports, null, 2));
  console.log(`[v0] Seeded ${reports.length} reports to ${jsonPath}`);

  // Generate CSV
  const csvHeader = 'id,lat,lng,category,severity,note,reporter,date,zone,upvotes,verified\n';
  const csvRows = reports
    .map(
      (r) =>
        `${r.id},${r.lat},${r.lng},"${r.category}",${r.severity},"${r.note}","${r.reporter}",${r.date},"${r.zone}",${r.upvotes},${r.verified}`
    )
    .join('\n');

  fs.writeFileSync(csvPath, csvHeader + csvRows);
  console.log(`[v0] Exported ${reports.length} reports to CSV: ${csvPath}`);
}

seedMockData().catch((err) => {
  console.error('[v0] Seed error:', err);
  process.exit(1);
});
