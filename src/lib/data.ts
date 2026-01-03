
import type { Disaster, Proposal, User } from './types';
import { PlaceHolderImages } from './placeholder-images';

const users: User[] = [
  { id: 'u1', name: 'Local NGO Bengaluru', role: 'Responder', reputation: 92, email: 'contact@local-ngo.org', activity: 'Active in 3 disaster responses' },
  { id: 'u2', name: 'Dr. Sharma Clinic', role: 'Responder', reputation: 88, email: 'clinic@sharma.med', activity: 'Provided medical aid in Kerala' },
  { id: 'u3', name: 'Rapid Response Team', role: 'Validator', reputation: 95, email: 'verify@rapid-response.org', activity: 'Validated 50+ proposals' },
  { id: 'u4', name: 'Community Volunteers', role: 'Responder', reputation: 78, email: 'volunteer-group@community.net', activity: 'Organized shelter during floods' },
  { id: 'u5', name: 'Global Aid Foundation', role: 'Donor', reputation: 98, email: 'donate@global-aid.org', activity: 'Top donor for cyclone relief' },
  { id: 'u6', name: 'Vijay', role: 'Admin', reputation: 100, email: 'vijay@reliefdao.org', activity: 'Overseeing all operations' },
  { id: 'u7', name: 'Sarah', role: 'Donor', reputation: 85, email: 'sarah@example.com', activity: 'Voted on 12 proposals' },
  { id: 'u8', name: 'Rajesh', role: 'Responder', reputation: 92, email: 'rajesh@example.com', activity: 'Submitted 5 proposals' },
  { id: 'u9', name: 'Dr. Mehta', role: 'Validator', reputation: 95, email: 'mehta@example.com', activity: 'Validated 23 proofs' },
];

const proposals: Proposal[] = [
  { 
    id: 'p1', 
    disasterId: 'd1', 
    title: 'Emergency Food Distribution',
    category: 'Food',
    amountRequested: 15000,
    status: 'Pending',
    timeline: '48 hours',
    votesYes: 72,
    votesNo: 28,
    createdBy: 'u1',
    description: 'A comprehensive plan to distribute essential food supplies to 2000 families in the most affected areas of Bengaluru. We will procure rice, lentils, and cooking oil from local vendors to support the local economy.',
    beneficiaries: 2000,
    location: 'Bengaluru, India',
    verificationPlan: ['GPS Photos', 'Recipient Signatures'],
    createdAt: new Date('2026-01-10T10:00:00Z'),
  },
  { 
    id: 'p2', 
    disasterId: 'd1', 
    title: 'Medical Supplies for Clinics',
    category: 'Medical',
    amountRequested: 8000,
    status: 'Approved',
    timeline: '24 hours',
    votesYes: 85,
    votesNo: 15,
    createdBy: 'u2',
    description: 'Procurement and delivery of essential medical supplies, including antibiotics, bandages, and antiseptics, to makeshift clinics in flood-affected zones.',
    beneficiaries: 500,
    location: 'Bengaluru, India',
    verificationPlan: ['Video Documentation', 'Third-party Verification'],
    createdAt: new Date('2026-01-09T14:30:00Z'),
  },
  { 
    id: 'p3', 
    disasterId: 'd2', 
    title: 'Temporary Shelter Kits',
    category: 'Shelter',
    amountRequested: 30000,
    status: 'Pending',
    timeline: '72 hours',
    votesYes: 65,
    votesNo: 35,
    createdBy: 'u3',
    description: 'Distribution of temporary shelter kits including tarpaulins, ropes, and basic tools for families who have lost their homes in the landslides.',
    beneficiaries: 300,
    location: 'Kerala, India',
    verificationPlan: ['GPS Photos'],
    createdAt: new Date('2026-01-08T18:00:00Z'),
  },
  { 
    id: 'p4', 
    disasterId: 'd1', 
    title: 'Clean Water Purification',
    category: 'Other',
    amountRequested: 22000,
    status: 'Completed',
    timeline: '5 days',
    votesYes: 95,
    votesNo: 5,
    createdBy: 'u4',
    description: 'Installation of three large-scale water purification units in community centers to provide safe drinking water and prevent waterborne diseases.',
    beneficiaries: 10000,
    location: 'Bengaluru, India',
    verificationPlan: ['GPS Photos', 'Third-party Verification'],
    createdAt: new Date('2026-01-05T09:00:00Z'),
  },
  {
    id: 'p5',
    disasterId: 'd3',
    title: 'Cyclone Evacuation Transport',
    category: 'Transport',
    amountRequested: 45000,
    status: 'Approved',
    timeline: '36 hours',
    votesYes: 91,
    votesNo: 9,
    createdBy: 'u3',
    description: 'Arranging buses and boats to evacuate over 5000 people from low-lying coastal areas to designated cyclone shelters before landfall.',
    beneficiaries: 5000,
    location: 'Coastal Odisha',
    verificationPlan: ['GPS Photos', 'Recipient Signatures'],
    createdAt: new Date('2026-01-11T08:00:00Z'),
  },
  {
    id: 'p6',
    disasterId: 'd4',
    title: 'Firefighting Equipment',
    category: 'Other',
    amountRequested: 18000,
    status: 'Rejected',
    timeline: '48 hours',
    votesYes: 40,
    votesNo: 60,
    createdBy: 'u4',
    description: 'Procurement of modern firefighting equipment including masks, suits, and portable water pumps for the forest department and local volunteers.',
    beneficiaries: 50,
    location: 'Uttarakhand Forests',
    verificationPlan: ['Receipts', 'Video Documentation'],
    createdAt: new Date('2025-12-20T11:00:00Z'),
  }
];

const disasters: Disaster[] = [
  { 
    id: 'd1',
    name: 'Bengaluru Floods',
    location: 'Bengaluru, India',
    status: 'Response Ongoing',
    fundsNeeded: 500000,
    fundsRaised: 250000,
    proposals: ['p1', 'p2', 'p4'],
    impact: '15,000+ people assisted',
    dateStarted: '2026-01-03',
    type: 'Flood',
    alertLevel: 3,
    affected: 50000,
    fundsDeployed: 180000,
    proposalsFunded: 12,
    verifiedDeliveries: 45,
    image: {
      id: 'bengaluru-floods',
      url: PlaceHolderImages.find(img => img.id === 'bengaluru-floods')?.imageUrl || '',
      hint: PlaceHolderImages.find(img => img.id === 'bengaluru-floods')?.imageHint || '',
    },
  },
  { 
    id: 'd2',
    name: 'Kerala Landslides',
    location: 'Kerala, India',
    status: 'Funds Deploying',
    fundsNeeded: 150000,
    fundsRaised: 120000,
    proposals: ['p3'],
    impact: '800 families evacuated',
    dateStarted: '2026-01-01',
    type: 'Landslide',
    alertLevel: 4,
    affected: 2000,
    fundsDeployed: 90000,
    proposalsFunded: 4,
    verifiedDeliveries: 12,
    image: {
      id: 'kerala-landslides',
      url: PlaceHolderImages.find(img => img.id === 'kerala-landslides')?.imageUrl || '',
      hint: PlaceHolderImages.find(img => img.id === 'kerala-landslides')?.imageHint || '',
    },
  },
  { 
    id: 'd3',
    name: 'Odisha Cyclone',
    location: 'Odisha, India',
    status: 'Active',
    fundsNeeded: 750000,
    fundsRaised: 150000,
    proposals: ['p5'],
    impact: 'Early warnings issued',
    dateStarted: '2026-01-10',
    type: 'Cyclone',
    alertLevel: 5,
    affected: 100000,
    fundsDeployed: 0,
    proposalsFunded: 1,
    verifiedDeliveries: 0,
    image: {
      id: 'odisha-cyclone',
      url: PlaceHolderImages.find(img => img.id === 'odisha-cyclone')?.imageUrl || '',
      hint: PlaceHolderImages.find(img => img.id === 'odisha-cyclone')?.imageHint || '',
    },
  },
  { 
    id: 'd4',
    name: 'Uttarakhand Wildfire',
    location: 'Uttarakhand, India',
    status: 'Completed',
    fundsNeeded: 80000,
    fundsRaised: 80000,
    proposals: ['p6'],
    impact: '3 villages protected',
    dateStarted: '2025-12-15',
    type: 'Wildfire',
    alertLevel: 2,
    affected: 500,
    fundsDeployed: 80000,
    proposalsFunded: 7,
    verifiedDeliveries: 7,
    image: {
      id: 'uttarakhand-wildfire',
      url: PlaceHolderImages.find(img => img.id === 'uttarakhand-wildfire')?.imageUrl || '',
      hint: PlaceHolderImages.find(img => img.id === 'uttarakhand-wildfire')?.imageHint || '',
    },
  },
  { 
    id: 'd5',
    name: 'Chennai Water Crisis',
    location: 'Chennai, India',
    status: 'Archived',
    fundsNeeded: 200000,
    fundsRaised: 210000,
    proposals: [],
    impact: 'Water tankers for 50k people',
    dateStarted: '2025-06-01',
    type: 'Drought',
    alertLevel: 3,
    affected: 1000000,
    fundsDeployed: 210000,
    proposalsFunded: 25,
    verifiedDeliveries: 25,
    image: {
      id: 'chennai-drought',
      url: PlaceHolderImages.find(img => img.id === 'chennai-drought')?.imageUrl || '',
      hint: PlaceHolderImages.find(img => img.id === 'chennai-drought')?.imageHint || '',
    },
  },
];

export function getDisasters(): Disaster[] {
  return disasters;
}

export function getDisasterById(id: string): Disaster | undefined {
  return disasters.find(d => d.id === id);
}

export function getProposalsByDisasterId(disasterId: string): Proposal[] {
  return proposals.filter(p => p.disasterId === disasterId);
}

export function getProposalById(id: string): Proposal | undefined {
  return proposals.find(p => p.id === id);
}

export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}

export const landingPageStats = [
    { name: 'Funds Deployed', value: 2.1, unit: 'M', suffix: '+' },
    { name: 'Disasters Responded', value: 45, unit: '', suffix: '' },
    { name: 'Lives Impacted', value: 12500, unit: '', suffix: '+' },
];

    
