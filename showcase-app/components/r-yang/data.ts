export type SiteCategory = 'Commercial' | 'Healthcare' | 'Education' | 'Retail' | 'Residential';
export type SiteStatus = 'On Track' | 'Watch' | 'Attention Required' | 'Escalated';
export type Severity = 'critical' | 'warning' | 'info';
export type JobStatus = 'Upcoming' | 'In Progress' | 'Completed' | 'Delayed' | 'Not Started' | 'Cancelled';
export type AttendanceStatus = 'Present' | 'Late' | 'No check-in' | 'Approved leave';
export type IssueStatus = 'New' | 'Investigating' | 'Assigned' | 'Awaiting Client' | 'Resolved' | 'Overdue';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';
export type MaintenanceStatus = 'New Request' | 'Waiting for Approval' | 'Approved' | 'In Progress' | 'Done' | 'Rejected' | 'Cancelled';

export interface SiteOperation {
  id: string;
  name: string;
  category: SiteCategory;
  address: string;
  serviceType: string;
  supervisor: string;
  staffScheduled: number;
  staffCheckedIn: number;
  attendanceNote: string;
  shift: string;
  tasksCompleted: number;
  tasksTotal: number;
  lastUpdate: string;
  status: SiteStatus;
  contractScope: string;
  inspectionScore: number;
  openIssues: number;
  assetsAttention: string[];
}

export interface AttentionItem {
  id: string;
  severity: Severity;
  title: string;
  site: string;
  supervisor: string;
  time: string;
  action: string;
}

export interface StaffAttendance {
  id: string;
  employee: string;
  role: string;
  site: string;
  scheduledTime: string;
  checkInTime: string;
  status: AttendanceStatus;
}

export interface ScheduleJob {
  id: string;
  time: string;
  site: string;
  team: string;
  service: string;
  supervisor: string;
  progress: string;
  status: JobStatus;
}

export interface InspectionRecord {
  id: string;
  site: string;
  score: number;
  date: string;
  inspector: string;
  result: 'Passed' | 'Corrective Action Required' | 'Failed';
  correctiveStatus: string;
  checklist: Array<{ item: string; status: 'Pass' | 'Fail' | 'Action needed' }>;
}

export interface IssueRecord {
  id: string;
  reference: string;
  site: string;
  type: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo: string;
  reported: string;
  sla: string;
  status: IssueStatus;
}

export interface ApprovalRequest {
  id: string;
  requester: string;
  site: string;
  type: string;
  amountOrDuration: string;
  submitted: string;
  supportingInfo: string;
  status: ApprovalStatus;
}

export interface MaintenanceRequest {
  id: string;
  reference: string;
  title: string;
  requestedBy: string;
  site: string;
  asset: string;
  category: 'Electrical' | 'Plumbing' | 'Vehicle' | 'Cleaning Equipment' | 'Building' | 'Safety';
  priority: 1 | 2 | 3 | 4 | 5;
  status: MaintenanceStatus;
  createdAt: string;
  dueBy: string;
  assignedTo: string;
  description: string;
  approvalNote: string;
}

export const siteOperations: SiteOperation[] = [
  {
    id: 'mcc-office',
    name: 'MCC Office Tower',
    category: 'Commercial',
    address: 'Jalan Melawati 3, Kuala Lumpur',
    serviceType: 'Cleaning',
    supervisor: 'Nadia Osman',
    staffScheduled: 26,
    staffCheckedIn: 24,
    attendanceNote: '2 absent',
    shift: 'Morning',
    tasksCompleted: 18,
    tasksTotal: 21,
    lastUpdate: '4 minutes ago',
    status: 'Attention Required',
    contractScope: 'Daily lobby, washroom, pantry, lift lobby and waste collection service.',
    inspectionScore: 94,
    openIssues: 1,
    assetsAttention: ['Auto scrubber battery', 'Level 9 chemical cabinet'],
  },
  {
    id: 'retail-block-a',
    name: 'Retail Block A',
    category: 'Retail',
    address: 'Taman Melawati Retail Precinct',
    serviceType: 'Cleaning + Hygiene',
    supervisor: 'Muhammad Amir',
    staffScheduled: 18,
    staffCheckedIn: 18,
    attendanceNote: 'Complete',
    shift: 'Morning',
    tasksCompleted: 14,
    tasksTotal: 16,
    lastUpdate: '2 minutes ago',
    status: 'On Track',
    contractScope: 'Common-area cleaning, washroom hygiene, bin-point checks and weekend crowd support.',
    inspectionScore: 91,
    openIssues: 0,
    assetsAttention: ['Restock fragrance cartridges'],
  },
  {
    id: 'healthcare-wing',
    name: 'Healthcare Wing',
    category: 'Healthcare',
    address: 'Ampang Healthcare Annex',
    serviceType: 'Cleaning + Maintenance',
    supervisor: 'Adam Iskandar',
    staffScheduled: 32,
    staffCheckedIn: 31,
    attendanceNote: '1 late',
    shift: 'Morning',
    tasksCompleted: 20,
    tasksTotal: 24,
    lastUpdate: '1 minute ago',
    status: 'Watch',
    contractScope: 'High-touch cleaning, support maintenance, washroom checks and incident-ready response.',
    inspectionScore: 87,
    openIssues: 2,
    assetsAttention: ['Wet floor signage set', 'Service trolley B'],
  },
  {
    id: 'education-campus',
    name: 'Education Campus',
    category: 'Education',
    address: 'Setapak Education Zone',
    serviceType: 'Cleaning + Waste',
    supervisor: 'Sarah Lee',
    staffScheduled: 24,
    staffCheckedIn: 20,
    attendanceNote: '4 absent',
    shift: 'Morning',
    tasksCompleted: 11,
    tasksTotal: 19,
    lastUpdate: '9 minutes ago',
    status: 'Escalated',
    contractScope: 'Classroom, washroom, canteen, landscape edge and scheduled waste movement.',
    inspectionScore: 72,
    openIssues: 3,
    assetsAttention: ['Ride-on sweeper', 'Waste holding bay'],
  },
  {
    id: 'residence-north',
    name: 'Residence North',
    category: 'Residential',
    address: 'North Residence, Kuala Lumpur',
    serviceType: 'Cleaning + Landscape',
    supervisor: 'Farid Rahman',
    staffScheduled: 14,
    staffCheckedIn: 13,
    attendanceNote: '1 no check-in',
    shift: 'Morning',
    tasksCompleted: 9,
    tasksTotal: 12,
    lastUpdate: '7 minutes ago',
    status: 'Watch',
    contractScope: 'Common-area cleaning, bin room checks, landscape watering and complaint response.',
    inspectionScore: 85,
    openIssues: 1,
    assetsAttention: ['Leaf blower service'],
  },
];

export const attentionItems: AttentionItem[] = [
  { id: 'att-1', severity: 'critical', title: '6 cleaners have not checked in', site: 'Education Campus', supervisor: 'Sarah Lee', time: '08:42', action: 'View Staff' },
  { id: 'att-2', severity: 'warning', title: '3 staff arrived more than 15 minutes late', site: 'Healthcare Wing', supervisor: 'Adam Iskandar', time: '08:31', action: 'Contact Supervisor' },
  { id: 'att-3', severity: 'critical', title: '2 inspections failed', site: 'Education Campus', supervisor: 'Sarah Lee', time: '09:10', action: 'Review Inspection' },
  { id: 'att-4', severity: 'warning', title: '1 client complaint awaiting response', site: 'MCC Office Tower', supervisor: 'Nadia Osman', time: '09:18', action: 'Resolve Issue' },
  { id: 'att-5', severity: 'warning', title: '2 maintenance requests overdue', site: 'Healthcare Wing', supervisor: 'Adam Iskandar', time: '08:55', action: 'Reassign' },
  { id: 'att-6', severity: 'info', title: '4 timesheets awaiting supervisor approval', site: 'Multiple Sites', supervisor: 'Ops Manager', time: 'Today', action: 'Approve' },
];

export const attendanceRows: StaffAttendance[] = [
  { id: 'st-1', employee: 'Aina Hassan', role: 'Cleaner', site: 'MCC Office Tower', scheduledTime: '08:00', checkInTime: '07:54', status: 'Present' },
  { id: 'st-2', employee: 'Rizal Hamid', role: 'Cleaner', site: 'MCC Office Tower', scheduledTime: '08:00', checkInTime: '-', status: 'No check-in' },
  { id: 'st-3', employee: 'Nur Iman', role: 'Washroom Attendant', site: 'Healthcare Wing', scheduledTime: '08:00', checkInTime: '08:18', status: 'Late' },
  { id: 'st-4', employee: 'Daniel Tan', role: 'Maintenance Tech', site: 'Healthcare Wing', scheduledTime: '08:30', checkInTime: '08:24', status: 'Present' },
  { id: 'st-5', employee: 'Priya Nair', role: 'Cleaner', site: 'Education Campus', scheduledTime: '08:00', checkInTime: '-', status: 'Approved leave' },
  { id: 'st-6', employee: 'Zul Ariff', role: 'Team Lead', site: 'Retail Block A', scheduledTime: '07:30', checkInTime: '07:22', status: 'Present' },
];

export const scheduleJobs: ScheduleJob[] = [
  { id: 'job-1', time: '07:30', site: 'Retail Block A', team: 'Team R1', service: 'Opening hygiene sweep', supervisor: 'Muhammad Amir', progress: '14 / 16', status: 'In Progress' },
  { id: 'job-2', time: '08:00', site: 'MCC Office Tower', team: 'Team C2', service: 'Office common areas', supervisor: 'Nadia Osman', progress: '18 / 21', status: 'Delayed' },
  { id: 'job-3', time: '08:30', site: 'Healthcare Wing', team: 'Team H1', service: 'High-touch cleaning', supervisor: 'Adam Iskandar', progress: '20 / 24', status: 'In Progress' },
  { id: 'job-4', time: '09:00', site: 'Education Campus', team: 'Team E4', service: 'Classroom block reset', supervisor: 'Sarah Lee', progress: '11 / 19', status: 'Delayed' },
  { id: 'job-5', time: '11:30', site: 'Residence North', team: 'Team L2', service: 'Landscape edge clearing', supervisor: 'Farid Rahman', progress: '0 / 8', status: 'Upcoming' },
  { id: 'job-6', time: '13:00', site: 'MCC Office Tower', team: 'Team C2', service: 'Afternoon pantry rounds', supervisor: 'Nadia Osman', progress: '0 / 12', status: 'Not Started' },
];

export const inspections: InspectionRecord[] = [
  {
    id: 'ins-1',
    site: 'MCC Office Tower',
    score: 94,
    date: '28 Jul 2026',
    inspector: 'Lina Rahim',
    result: 'Passed',
    correctiveStatus: 'No corrective action required',
    checklist: [
      { item: 'Lobby cleanliness', status: 'Pass' },
      { item: 'Washroom condition', status: 'Pass' },
      { item: 'Waste disposal', status: 'Pass' },
      { item: 'Cleaning chemicals labelled', status: 'Pass' },
      { item: 'Equipment stored correctly', status: 'Action needed' },
      { item: 'Safety signage present', status: 'Pass' },
    ],
  },
  {
    id: 'ins-2',
    site: 'Healthcare Wing',
    score: 87,
    date: '28 Jul 2026',
    inspector: 'Kumar Velu',
    result: 'Corrective Action Required',
    correctiveStatus: 'Supervisor reviewing high-touch checklist',
    checklist: [
      { item: 'Lobby cleanliness', status: 'Pass' },
      { item: 'Washroom condition', status: 'Action needed' },
      { item: 'Waste disposal', status: 'Pass' },
      { item: 'Cleaning chemicals labelled', status: 'Pass' },
      { item: 'Equipment stored correctly', status: 'Pass' },
      { item: 'Safety signage present', status: 'Action needed' },
    ],
  },
  {
    id: 'ins-3',
    site: 'Education Campus',
    score: 72,
    date: '28 Jul 2026',
    inspector: 'Rina Jalil',
    result: 'Failed',
    correctiveStatus: 'Replacement team requested',
    checklist: [
      { item: 'Lobby cleanliness', status: 'Action needed' },
      { item: 'Washroom condition', status: 'Fail' },
      { item: 'Waste disposal', status: 'Fail' },
      { item: 'Cleaning chemicals labelled', status: 'Pass' },
      { item: 'Equipment stored correctly', status: 'Action needed' },
      { item: 'Safety signage present', status: 'Pass' },
    ],
  },
];

export const issueRows: IssueRecord[] = [
  { id: 'iss-1', reference: 'RY-240728-011', site: 'MCC Office Tower', type: 'Client complaint', description: 'Washroom refill missed on Level 12', priority: 'High', assignedTo: 'Nadia Osman', reported: '09:18', sla: '2h left', status: 'Investigating' },
  { id: 'iss-2', reference: 'RY-240728-012', site: 'Education Campus', type: 'Staff absence', description: 'Four cleaners not checked in for morning shift', priority: 'Critical', assignedTo: 'Sarah Lee', reported: '08:42', sla: 'Overdue', status: 'Overdue' },
  { id: 'iss-3', reference: 'RY-240728-013', site: 'Healthcare Wing', type: 'Equipment failure', description: 'Wet floor signage set incomplete', priority: 'Medium', assignedTo: 'Adam Iskandar', reported: '08:55', sla: 'Today', status: 'Assigned' },
  { id: 'iss-4', reference: 'RY-240728-014', site: 'Retail Block A', type: 'Supply shortage', description: 'Fragrance cartridge stock below threshold', priority: 'Low', assignedTo: 'Muhammad Amir', reported: '08:20', sla: 'Tomorrow', status: 'New' },
];

export const approvalRows: ApprovalRequest[] = [
  { id: 'ap-1', requester: 'Rizal Hamid', site: 'MCC Office Tower', type: 'Leave request', amountOrDuration: '1 day', submitted: '27 Jul', supportingInfo: 'Emergency leave request awaiting supervisor review.', status: 'Pending' },
  { id: 'ap-2', requester: 'Team C2', site: 'MCC Office Tower', type: 'Overtime', amountOrDuration: '6 hours', submitted: 'Today', supportingInfo: 'Afternoon replacement coverage due to absent staff.', status: 'Pending' },
  { id: 'ap-3', requester: 'Daniel Tan', site: 'Healthcare Wing', type: 'Expense claim', amountOrDuration: 'RM 148 demo', submitted: '26 Jul', supportingInfo: 'Replacement safety signage purchase receipt attached.', status: 'Pending' },
  { id: 'ap-4', requester: 'Sarah Lee', site: 'Education Campus', type: 'Timesheet', amountOrDuration: '42 hours', submitted: 'Today', supportingInfo: 'Morning shift timesheet with staffing exception notes.', status: 'Pending' },
  { id: 'ap-5', requester: 'Ops Store', site: 'Retail Block A', type: 'Purchase request', amountOrDuration: 'RM 320 demo', submitted: '25 Jul', supportingInfo: 'Hygiene consumables for weekend traffic.', status: 'Pending' },
];

export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'mr-1',
    reference: 'MRQ/28/07/24011',
    title: 'Replace faulty corridor light',
    requestedBy: 'Super User',
    site: 'MCC Office Tower',
    asset: 'Level 12 corridor',
    category: 'Electrical',
    priority: 2,
    status: 'New Request',
    createdAt: '08:17',
    dueBy: 'Today 14:00',
    assignedTo: 'Unassigned',
    description: 'Client reported flickering light near pantry corridor. Requires inspection before lunch crowd.',
    approvalNote: 'No approval required for minor electrical replacement.',
  },
  {
    id: 'mr-2',
    reference: 'MRQ/28/07/24010',
    title: 'Inspect service van brake light',
    requestedBy: 'Super User',
    site: 'Retail Block A',
    asset: 'Kereta 1 [KRT-01]',
    category: 'Vehicle',
    priority: 3,
    status: 'New Request',
    createdAt: '08:24',
    dueBy: 'Today 17:00',
    assignedTo: 'Daniel Tan',
    description: 'Supervisor noticed right brake light not working before supply run.',
    approvalNote: 'Workshop quote required if parts exceed demo threshold.',
  },
  {
    id: 'mr-3',
    reference: 'MRQ/28/07/24009',
    title: 'Washroom sensor tap not responding',
    requestedBy: 'Nadia Osman',
    site: 'MCC Office Tower',
    asset: 'Level 9 washroom',
    category: 'Plumbing',
    priority: 4,
    status: 'Waiting for Approval',
    createdAt: '08:38',
    dueBy: 'Today 12:30',
    assignedTo: 'Procurement',
    description: 'Sensor tap intermittently fails and causes queue during morning office peak.',
    approvalNote: 'Awaiting approval for replacement sensor module.',
  },
  {
    id: 'mr-4',
    reference: 'MRQ/28/07/24013',
    title: 'Laptop adapter replacement',
    requestedBy: 'Super User',
    site: 'Healthcare Wing',
    asset: 'Laptop [MB-001]',
    category: 'Electrical',
    priority: 3,
    status: 'In Progress',
    createdAt: '09:03',
    dueBy: 'Today 15:30',
    assignedTo: 'Adam Iskandar',
    description: 'Supervisor laptop charger damaged. Attendance upload is being done from phone until replacement.',
    approvalNote: 'Approved by operations manager at 09:18.',
  },
  {
    id: 'mr-5',
    reference: 'MRQ/28/07/24012',
    title: 'Replace wet floor sign set',
    requestedBy: 'Adam Iskandar',
    site: 'Healthcare Wing',
    asset: 'Wet floor signage set',
    category: 'Safety',
    priority: 5,
    status: 'In Progress',
    createdAt: '09:12',
    dueBy: 'Today 11:30',
    assignedTo: 'Daniel Tan',
    description: 'Two signs missing from cleaning bay. Site cannot close corrective action until replacement is issued.',
    approvalNote: 'Safety item prioritised. Store team preparing replacement set.',
  },
  {
    id: 'mr-6',
    reference: 'MRQ/27/07/24003',
    title: 'Service auto scrubber battery',
    requestedBy: 'Super User',
    site: 'MCC Office Tower',
    asset: 'Auto scrubber battery',
    category: 'Cleaning Equipment',
    priority: 2,
    status: 'Done',
    createdAt: '27 Jul 16:20',
    dueBy: '28 Jul 10:00',
    assignedTo: 'Daniel Tan',
    description: 'Battery replacement completed and equipment returned to Level B1 store.',
    approvalNote: 'Closed after supervisor verification.',
  },
  {
    id: 'mr-7',
    reference: 'MRQ/27/07/24002',
    title: 'Ride-on sweeper inspection',
    requestedBy: 'Sarah Lee',
    site: 'Education Campus',
    asset: 'Ride-on sweeper',
    category: 'Cleaning Equipment',
    priority: 4,
    status: 'Approved',
    createdAt: '27 Jul 15:10',
    dueBy: 'Today 16:00',
    assignedTo: 'External vendor',
    description: 'Sweeper loses power after 20 minutes. Approved for vendor inspection.',
    approvalNote: 'Vendor inspection approved, repair cost subject to later confirmation.',
  },
  {
    id: 'mr-8',
    reference: 'MRQ/26/07/24006',
    title: 'Office blinds replacement request',
    requestedBy: 'Client Admin',
    site: 'Residence North',
    asset: 'Management office blinds',
    category: 'Building',
    priority: 1,
    status: 'Rejected',
    createdAt: '26 Jul 11:45',
    dueBy: '27 Jul 15:00',
    assignedTo: 'Ops Manager',
    description: 'Request rejected because item is outside demo contract scope.',
    approvalNote: 'Rejected pending client variation order.',
  },
  {
    id: 'mr-9',
    reference: 'MRQ/25/07/24001',
    title: 'Cancelled vendor visit',
    requestedBy: 'Farid Rahman',
    site: 'Residence North',
    asset: 'Leaf blower service',
    category: 'Cleaning Equipment',
    priority: 2,
    status: 'Cancelled',
    createdAt: '25 Jul 10:20',
    dueBy: '26 Jul 12:00',
    assignedTo: 'External vendor',
    description: 'Cancelled after supervisor confirmed equipment is working.',
    approvalNote: 'No further action required.',
  },
];
