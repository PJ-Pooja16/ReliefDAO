

export type DisasterStatus = 'Active' | 'Response Ongoing' | 'Funds Deploying' | 'Completed' | 'Archived';
export type ProposalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed';
export type UserRole = 'Donor' | 'Responder' | 'Validator' | 'Admin';

export type Disaster = {
  id: string;
  name: string;
  location: string;
  status: DisasterStatus;
  fundsNeeded: number;
  fundsRaised: number;
  proposals: string[];
  impact: string;
  dateStarted: string;
  type: string;
  alertLevel: number;
  affected: number;
  fundsDeployed: number;
  proposalsFunded: number;
  verifiedDeliveries: number;
  image: {
    id: string;
    url: string;
    hint: string;
  };
};

export type Proposal = {
  id: string;
  disasterId: string;
  title: string;
  category: 'Food' | 'Medical' | 'Shelter' | 'Transport' | 'Other';
  amountRequested: number;
  status: ProposalStatus;
  timeline: string;
  votesYes: number;
  votesNo: number;
  createdBy: string; // userId
  description: string;
  beneficiaries: number;
  location: string; // Could be more complex, like GeoJSON
  verificationPlan: string[];
  createdAt: Date;
};

export type User = {
  id: string;
  name: string;
  role: UserRole;
  reputation: number;
  email: string;
  activity: string;
};

export type Donation = {
  id: string;
  disasterId: string;
  donorId: string; // User ID
  amount: number;
  timestamp: string;
  donationType: string;
};

export type Vote = {
    id: string;
    proposalId: string;
    voterId: string;
    decision: boolean;
    createdAt: Date;
    txSignature: string;
}

export type TreasuryTransaction = {
  id: string;
  type: 'Inbound' | 'Outbound';
  description: string;
  amount: number;
  date: string;
  txHash: string;
};

export type DisasterUpdate = {
  id: string;
  date: string;
  title: string;
  description: string;
};

