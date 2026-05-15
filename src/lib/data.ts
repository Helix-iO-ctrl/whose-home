// Mock seed data for the prototype. Plausible, populated, no emojis.

export type Property = {
  id: string;
  name: string;
  address: string;
  units: Unit[];
};

export type Unit = {
  id: string;
  label: string;
  rent: number;
  tenantId: string | null;
  leaseEnd: string; // ISO date
  status: "current" | "late" | "vacant";
};

export type Tenant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  unitId: string;
  moveIn: string;
};

export type MaintenanceRequest = {
  id: string;
  unitId: string;
  title: string;
  category: "appliance" | "plumbing" | "hvac" | "electrical" | "other";
  description: string;
  status: "new" | "triaging" | "needs-vendor" | "scheduled" | "in-progress" | "resolved";
  submittedBy: string; // tenant id
  submittedAt: string;
  appliance?: { make: string; model: string };
  troubleshooting?: { step: string; passed: boolean }[];
  vendorId?: string;
  scheduledFor?: string;
};

export type Vendor = {
  id: string;
  name: string;
  trade: "Plumbing" | "HVAC" | "Electrical" | "Locksmith" | "General";
  phone: string;
  email: string;
  active: boolean;
};

export type Payment = {
  id: string;
  tenantId: string;
  unitId: string;
  amount: number;
  method: "ACH" | "Card" | "Check";
  date: string;
  status: "received" | "outstanding" | "late";
};

export type Lease = {
  id: string;
  unitId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  signed: boolean;
};

export type Message = {
  id: string;
  threadId: string;
  from: "landlord" | "tenant";
  body: string;
  at: string;
};

// ───────────────────────── seed ─────────────────────────

export const tenants: Tenant[] = [
  { id: "t-sarah",  name: "Sarah Klein",   email: "sarah.k@example.com",   phone: "(801) 555-0118", unitId: "u-maple-a",  moveIn: "2024-08-01" },
  { id: "t-james",  name: "James Reyes",   email: "james.r@example.com",   phone: "(801) 555-0112", unitId: "u-maple-b",  moveIn: "2025-01-15" },
  { id: "t-maria",  name: "Maria Tovar",   email: "maria.t@example.com",   phone: "(801) 555-0140", unitId: "u-orchard",  moveIn: "2023-06-01" },
  { id: "t-tom",    name: "Tom Whitaker",  email: "tom.w@example.com",     phone: "(385) 555-0177", unitId: "u-cedar",    moveIn: "2024-03-15" },
  { id: "t-priya",  name: "Priya Shah",    email: "priya.s@example.com",   phone: "(801) 555-0153", unitId: "u-aspen-1",  moveIn: "2025-09-01" },
  { id: "t-andre",  name: "Andre Mensah",  email: "andre.m@example.com",   phone: "(801) 555-0166", unitId: "u-aspen-2",  moveIn: "2025-04-01" },
];

export const properties: Property[] = [
  {
    id: "p-maple",
    name: "214 Maple Street",
    address: "214 Maple St, Salt Lake City, UT",
    units: [
      { id: "u-maple-a", label: "Unit A", rent: 1250, tenantId: "t-sarah", leaseEnd: "2026-08-31", status: "current" },
      { id: "u-maple-b", label: "Unit B", rent: 1350, tenantId: "t-james", leaseEnd: "2026-10-31", status: "current" },
    ],
  },
  {
    id: "p-orchard",
    name: "88 Orchard Lane",
    address: "88 Orchard Ln, Salt Lake City, UT",
    units: [
      { id: "u-orchard", label: "Single Family", rent: 1450, tenantId: "t-maria", leaseEnd: "2026-12-31", status: "current" },
    ],
  },
  {
    id: "p-cedar",
    name: "41 Cedar Drive",
    address: "41 Cedar Dr, Millcreek, UT",
    units: [
      { id: "u-cedar", label: "Single Family", rent: 1600, tenantId: "t-tom", leaseEnd: "2026-06-30", status: "late" },
    ],
  },
  {
    id: "p-aspen",
    name: "9 Aspen Court",
    address: "9 Aspen Ct, South Salt Lake, UT",
    units: [
      { id: "u-aspen-1", label: "Unit 1",  rent: 1200, tenantId: "t-priya", leaseEnd: "2027-08-31", status: "current" },
      { id: "u-aspen-2", label: "Unit 2",  rent: 1200, tenantId: "t-andre", leaseEnd: "2026-04-30", status: "current" },
    ],
  },
];

export const vendors: Vendor[] = [
  { id: "v-daves",      name: "Dave's Plumbing Co.",  trade: "Plumbing",  phone: "(801) 555-0198", email: "dave@davesplumbing.example",   active: true },
  { id: "v-cool",       name: "Cool Comfort HVAC",     trade: "HVAC",      phone: "(801) 555-0221", email: "service@coolcomfort.example",  active: true },
  { id: "v-sparks",     name: "Sparks Electric",       trade: "Electrical",phone: "(385) 555-0043", email: "dispatch@sparkselec.example",  active: true },
  { id: "v-lockright",  name: "LockRight Security",    trade: "Locksmith", phone: "(801) 555-0187", email: "ops@lockright.example",        active: true },
  { id: "v-handyhill",  name: "Handy Hill General",    trade: "General",   phone: "(801) 555-0274", email: "hello@handyhill.example",      active: false },
];

export const requests: MaintenanceRequest[] = [
  {
    id: "r-001",
    unitId: "u-maple-b",
    title: "Dishwasher leaking",
    category: "appliance",
    description: "Water is pooling under the dishwasher after each cycle. Started two days ago.",
    status: "needs-vendor",
    submittedBy: "t-james",
    submittedAt: "2026-05-13T18:42:00Z",
    appliance: { make: "Bosch", model: "SHE53C85N" },
    troubleshooting: [
      { step: "Checked door seal — no damage",                               passed: true  },
      { step: "Inspected drain hose — clean and connected",                  passed: true  },
      { step: "Ran rinse cycle after reset — leak continued",                passed: false },
    ],
  },
  {
    id: "r-002",
    unitId: "u-orchard",
    title: "A/C not cooling",
    category: "hvac",
    description: "Set to 68°F, blowing room-temp air. Outdoor unit running.",
    status: "triaging",
    submittedBy: "t-maria",
    submittedAt: "2026-05-12T14:10:00Z",
  },
  {
    id: "r-003",
    unitId: "u-aspen-1",
    title: "Kitchen sink slow drain",
    category: "plumbing",
    description: "Drains very slowly, gurgles when running disposal.",
    status: "new",
    submittedBy: "t-priya",
    submittedAt: "2026-05-14T09:05:00Z",
  },
  {
    id: "r-004",
    unitId: "u-cedar",
    title: "Garage door opener intermittent",
    category: "electrical",
    description: "Sometimes stops mid-cycle. Light bulb in opener also flickers.",
    status: "scheduled",
    submittedBy: "t-tom",
    submittedAt: "2026-05-08T20:22:00Z",
    vendorId: "v-sparks",
    scheduledFor: "2026-05-19T14:00:00Z",
  },
];

export const payments: Payment[] = [
  { id: "pay-1", tenantId: "t-sarah", unitId: "u-maple-a", amount: 1250, method: "ACH",  date: "2026-05-01", status: "received" },
  { id: "pay-2", tenantId: "t-james", unitId: "u-maple-b", amount: 1350, method: "Card", date: "2026-05-02", status: "received" },
  { id: "pay-3", tenantId: "t-maria", unitId: "u-orchard", amount: 1450, method: "ACH",  date: "2026-05-01", status: "received" },
  { id: "pay-4", tenantId: "t-priya", unitId: "u-aspen-1", amount: 1200, method: "ACH",  date: "2026-05-01", status: "received" },
  { id: "pay-5", tenantId: "t-andre", unitId: "u-aspen-2", amount: 1200, method: "Card", date: "2026-05-03", status: "received" },
  { id: "pay-6", tenantId: "t-tom",   unitId: "u-cedar",   amount: 1600, method: "ACH",  date: "2026-05-01", status: "late" },
];

export const leases: Lease[] = [
  { id: "l-1", unitId: "u-maple-a",  tenantId: "t-sarah", startDate: "2024-08-01", endDate: "2026-08-31", monthlyRent: 1250, signed: true },
  { id: "l-2", unitId: "u-maple-b",  tenantId: "t-james", startDate: "2025-01-15", endDate: "2026-10-31", monthlyRent: 1350, signed: true },
  { id: "l-3", unitId: "u-orchard",  tenantId: "t-maria", startDate: "2023-06-01", endDate: "2026-12-31", monthlyRent: 1450, signed: true },
  { id: "l-4", unitId: "u-cedar",    tenantId: "t-tom",   startDate: "2024-03-15", endDate: "2026-06-30", monthlyRent: 1600, signed: true },
  { id: "l-5", unitId: "u-aspen-1",  tenantId: "t-priya", startDate: "2025-09-01", endDate: "2027-08-31", monthlyRent: 1200, signed: true },
  { id: "l-6", unitId: "u-aspen-2",  tenantId: "t-andre", startDate: "2025-04-01", endDate: "2026-04-30", monthlyRent: 1200, signed: true },
];

export const messages: Message[] = [
  { id: "m-1", threadId: "thread-james", from: "tenant",   body: "Heads up — dishwasher started leaking after the cycle today.",                       at: "2026-05-13T18:42:00Z" },
  { id: "m-2", threadId: "thread-james", from: "landlord", body: "Got it. AI triage will walk you through a quick check first, then I'll dispatch.",   at: "2026-05-13T19:01:00Z" },
  { id: "m-3", threadId: "thread-james", from: "landlord", body: "Dave's Plumbing booked for Tuesday May 19, 2pm window.",                              at: "2026-05-15T08:14:00Z" },
  { id: "m-4", threadId: "thread-maria", from: "tenant",   body: "A/C is blowing warm air. Submitted a request.",                                       at: "2026-05-12T14:12:00Z" },
  { id: "m-5", threadId: "thread-tom",   from: "landlord", body: "May rent is showing late — let me know if you need to set up a partial.",             at: "2026-05-04T10:00:00Z" },
];

// ───────────────────────── helpers ─────────────────────────

export function getTenant(id: string)   { return tenants.find((t) => t.id === id) ?? null; }
export function getUnit(id: string)     { for (const p of properties) for (const u of p.units) if (u.id === id) return { unit: u, property: p }; return null; }
export function getVendor(id: string)   { return vendors.find((v) => v.id === id) ?? null; }
export function getProperty(id: string) { return properties.find((p) => p.id === id) ?? null; }
export function getRequest(id: string)  { return requests.find((r) => r.id === id) ?? null; }

export function totalUnits()        { return properties.reduce((acc, p) => acc + p.units.length, 0); }
export function totalCollected()    { return payments.filter((p) => p.status === "received").reduce((a, p) => a + p.amount, 0); }
export function totalOutstanding()  { return payments.filter((p) => p.status !== "received").reduce((a, p) => a + p.amount, 0); }
export function openRequests()      { return requests.filter((r) => r.status !== "resolved").length; }
