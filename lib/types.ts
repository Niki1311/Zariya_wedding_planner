// Serialized shapes returned by /api/wedding (dates as ISO strings).

export type TaskStatus = "todo" | "inprogress" | "done";
export type RsvpStatus = "Accepted" | "Pending" | "Declined";
export type Priority = "High" | "Medium" | "Low";

export interface ChecklistItem {
  id: string;
  text: string;
  status: TaskStatus;
  position: number;
}

export interface SubEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  position: number;
}

export interface EventData {
  id: string;
  name: string;
  type: string;
  isCeremony: boolean;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string;
  description: string;
  notes: string;
  imageKey: string | null;
  position: number;
  checklist: ChecklistItem[];
  subEvents: SubEvent[];
  vendorIds: string[];
}

export interface GuestData {
  id: string;
  name: string;
  phone: string;
  email: string;
  side: string;
  segment: string;
  rsvpStatus: RsvpStatus;
  notes: string;
  eventIds: string[];
}

export interface VendorData {
  id: string;
  name: string;
  category: string;
  brand: string;
  city: string;
  contactPerson: string;
  phone: string;
  email: string;
  altContact: string;
  prefComm: string;
  contractStatus: string;
  paymentStatus: string;
  totalAgreed: number;
  advanceAmount: number;
  nextDueDate: string | null;
  notes: string;
  eventIds: string[];
}

export interface PaymentData {
  id: string;
  vendorId: string | null;
  category: string;
  purpose: string;
  amount: number;
  dueDate: string | null;
  paidDate: string | null;
  method: string;
  status: string;
  notes: string;
}

export interface BudgetCategoryData {
  id: string;
  name: string;
  estimatedAmount: number;
  position: number;
}

export interface TimelineTaskData {
  id: string;
  text: string;
  phase: string;
  category: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  assignee: string | null;
  position: number;
}

export interface WeddingData {
  id: string;
  coupleNames: string;
  weddingName: string;
  location: string;
  startDate: string | null;
  endDate: string | null;
  totalBudget: number;
  planningPhase: string;
  guideCompleted: boolean;
  onboardingDone: boolean;
  notifyPayments: boolean;
  notifyTasks: boolean;
  notifyRsvp: boolean;
  notifyBudget: boolean;
  eventOrder: string[];
  events: EventData[];
  guests: GuestData[];
  vendors: VendorData[];
  payments: PaymentData[];
  budgetCategories: BudgetCategoryData[];
  timelineTasks: TimelineTaskData[];
  user: { name: string | null; email: string };
}

export const PLANNING_PHASES = [
  "12 months before",
  "10 months before",
  "8 months before",
  "6 months before",
  "4 months before",
  "2 months before",
  "1 month before",
  "Wedding week",
] as const;

export const VENDOR_CATEGORIES = [
  "Venue",
  "Decor",
  "Catering",
  "Photography",
  "Makeup",
  "Mehendi artist",
  "Entertainment",
  "Choreographer",
  "Priest",
  "Transport",
  "Hospitality",
  "Other",
] as const;

export const CONTRACT_STATUSES = [
  "Not contacted",
  "Shortlisted",
  "In review",
  "Pending",
  "Confirmed",
  "Cancelled",
] as const;

export const PAYMENT_STATUSES = [
  "Unpaid",
  "Advance due",
  "Deposit paid",
  "Partial paid",
  "Paid",
  "Overdue",
] as const;

export const PAYMENT_METHODS = ["Bank transfer", "UPI", "Card", "Cash", "Other"] as const;

export const BUDGET_CATEGORY_NAMES = [
  "Venue",
  "Catering",
  "Decor",
  "Photography",
  "Entertainment",
  "Hospitality",
  "Transport",
  "Outfits",
  "Invitations",
  "Gifts",
  "Miscellaneous",
] as const;

export const EVENT_OPTIONS = [
  "Haldi",
  "Mehendi",
  "Sangeet",
  "Wedding",
  "Reception",
  "Engagement",
  "Cocktail",
  "Welcome dinner",
  "After party",
] as const;
