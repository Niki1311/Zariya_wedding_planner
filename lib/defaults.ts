// Default content from the Functional Description (PDF §8 timeline, §12 event checklists).

export const EVENT_CHECKLISTS: Record<string, string[]> = {
  haldi: [
    "Confirm Haldi date and time",
    "Confirm Haldi location",
    "Confirm guest list for Haldi",
    "Finalize Haldi decor setup",
    "Confirm seating arrangement",
    "Confirm turmeric/ubtan materials",
    "Confirm outfits for Haldi",
    "Confirm photographer timing",
    "Confirm snacks and beverages",
    "Confirm music or dhol setup",
    "Confirm cleanup plan",
    "Confirm transition to next event",
  ],
  mehendi: [
    "Confirm mehendi date and time",
    "Confirm mehendi location",
    "Confirm bridal mehendi artist",
    "Confirm guest mehendi artist count",
    "Confirm guest mehendi stations",
    "Approve bridal seating setup",
    "Finalize floral lounge decor",
    "Confirm snacks and mocktails",
    "Confirm lighting for photos",
    "Confirm photographer timing",
    "Prepare stain-removal/touch-up kit",
    "Confirm event wrap-up plan",
  ],
  sangeet: [
    "Confirm Sangeet date and time",
    "Confirm Sangeet venue",
    "Confirm stage layout",
    "Confirm sound and lighting",
    "Confirm DJ or entertainment",
    "Finalize performance list",
    "Finalize performance order",
    "Confirm rehearsal plan",
    "Confirm couple entry cue",
    "Confirm family entry cues",
    "Confirm dinner timing",
    "Confirm after-party or dance floor timing",
  ],
  wedding: [
    "Confirm wedding date and time",
    "Confirm ceremony location",
    "Confirm priest/pandit timing",
    "Confirm muhurat",
    "Confirm mandap setup",
    "Confirm varmala setup",
    "Confirm baraat timing",
    "Confirm bridal entry timing",
    "Confirm ceremony items",
    "Confirm family seating",
    "Confirm photography shot list",
    "Confirm post-ceremony transition",
  ],
  reception: [
    "Confirm reception date and time",
    "Confirm reception venue",
    "Confirm guest list for reception",
    "Confirm stage and couple seating",
    "Confirm decor setup",
    "Confirm lighting and sound",
    "Confirm welcome/check-in setup",
    "Confirm couple entry timing",
    "Confirm speeches or toast plan",
    "Confirm dinner service timing",
    "Confirm photography area",
    "Confirm final send-off plan",
  ],
  custom: [
    "Confirm event date and time",
    "Confirm event location",
    "Confirm guest list",
    "Confirm vendors involved",
    "Confirm setup requirements",
    "Confirm food and beverage plan",
    "Confirm music or entertainment",
    "Confirm photography timing",
    "Confirm run-of-show",
    "Confirm event notes",
    "Confirm budget, if applicable",
    "Confirm wrap-up plan",
  ],
};

export function checklistForType(type: string): string[] {
  return EVENT_CHECKLISTS[type.toLowerCase()] ?? EVENT_CHECKLISTS.custom;
}

export const CEREMONY_TYPES = ["haldi", "wedding"];

// Default run-of-show by event type (PDF §11 example + sensible defaults).
export const EVENT_RUNOFSHOW: Record<string, { title: string; startTime: string; endTime: string }[]> = {
  mehendi: [
    { title: "Guest arrival & welcome drinks", startTime: "16:00", endTime: "16:30" },
    { title: "Bridal mehendi begins", startTime: "16:30", endTime: "17:00" },
    { title: "Family mehendi stations open", startTime: "17:00", endTime: "17:30" },
    { title: "Chaat & mocktail service", startTime: "17:30", endTime: "18:15" },
    { title: "Games, music & candid moments", startTime: "18:15", endTime: "18:45" },
    { title: "Group photos", startTime: "18:45", endTime: "19:00" },
    { title: "Event wrap", startTime: "19:00", endTime: "19:00" },
  ],
  haldi: [
    { title: "Guest arrival & welcome", startTime: "10:00", endTime: "10:30" },
    { title: "Haldi ceremony begins", startTime: "10:30", endTime: "11:15" },
    { title: "Music & dhol", startTime: "11:15", endTime: "11:45" },
    { title: "Group photos & wrap", startTime: "11:45", endTime: "12:00" },
  ],
  sangeet: [
    { title: "Guest arrival & cocktails", startTime: "20:00", endTime: "20:30" },
    { title: "Couple entry", startTime: "20:30", endTime: "20:45" },
    { title: "Family performances", startTime: "20:45", endTime: "21:45" },
    { title: "Dinner service", startTime: "21:45", endTime: "22:30" },
    { title: "Dance floor & DJ", startTime: "22:30", endTime: "23:00" },
  ],
  wedding: [
    { title: "Baraat arrival", startTime: "16:00", endTime: "16:30" },
    { title: "Varmala", startTime: "16:30", endTime: "17:00" },
    { title: "Pheras & ceremony", startTime: "17:00", endTime: "18:30" },
    { title: "Blessings & photos", startTime: "18:30", endTime: "19:00" },
  ],
  reception: [
    { title: "Guest welcome & check-in", startTime: "20:00", endTime: "20:30" },
    { title: "Couple grand entry", startTime: "20:30", endTime: "21:00" },
    { title: "Speeches & toasts", startTime: "21:00", endTime: "21:30" },
    { title: "Dinner service", startTime: "21:30", endTime: "22:30" },
    { title: "Send-off", startTime: "22:30", endTime: "23:00" },
  ],
};

export function runOfShowForType(type: string) {
  return EVENT_RUNOFSHOW[type.toLowerCase()] ?? [];
}

// Default planning checklist by phase (PDF §8). [text, category]
export const PLANNING_CHECKLIST: Record<string, [string, string][]> = {
  "12 months before": [
    ["Set wedding date range", "Foundations"],
    ["Decide destination city", "Foundations"],
    ["Create rough guest count", "Guests & Hospitality"],
    ["Set overall budget", "Budget & Planning"],
    ["Create initial event list", "Foundations"],
    ["Shortlist venues", "Venue & Vendors"],
    ["Shortlist planner, if needed", "Venue & Vendors"],
    ["Create vendor category list", "Venue & Vendors"],
    ["Discuss key wedding priorities", "Foundations"],
    ["Set up Zariya workspace", "Budget & Planning"],
  ],
  "10 months before": [
    ["Compare venue options", "Venue & Vendors"],
    ["Confirm main venue", "Venue & Vendors"],
    ["Create first guest list", "Guests & Hospitality"],
    ["Set budget categories", "Budget & Planning"],
    ["Shortlist photographer", "Venue & Vendors"],
    ["Shortlist decor vendor", "Venue & Vendors"],
    ["Shortlist caterer", "Venue & Vendors"],
    ["Shortlist makeup artist", "Venue & Vendors"],
    ["Shortlist entertainment options", "Venue & Vendors"],
    ["Create first payment tracker", "Budget & Planning"],
  ],
  "8 months before": [
    ["Enter venue details in Zariya", "Venue & Vendors"],
    ["Confirm photographer", "Venue & Vendors"],
    ["Confirm decor direction", "Styling & Planning"],
    ["Confirm catering direction", "Venue & Vendors"],
    ["Decide rough event sequence", "Foundations"],
    ["Begin outfit planning", "Styling & Planning"],
    ["Begin invitation planning", "Styling & Planning"],
    ["Create first event timeline", "Foundations"],
    ["Add confirmed vendors to Zariya", "Venue & Vendors"],
    ["Review budget health", "Budget & Planning"],
  ],
  "6 months before": [
    ["Confirm decor proposal", "Styling & Planning"],
    ["Confirm mehendi artist", "Venue & Vendors"],
    ["Confirm entertainment/DJ", "Venue & Vendors"],
    ["Draft invitation list", "Guests & Hospitality"],
    ["Send save-the-dates", "Guests & Hospitality"],
    ["Confirm catering tasting date", "Venue & Vendors"],
    ["Start outfit fittings", "Styling & Planning"],
    ["Assign due dates to major tasks", "Budget & Planning"],
    ["Review vendor payment schedule", "Budget & Planning"],
    ["Update budget estimates", "Budget & Planning"],
  ],
  "4 months before": [
    ["Finalize event themes", "Styling & Planning"],
    ["Confirm menu for each event", "Venue & Vendors"],
    ["Finalize invitation design", "Styling & Planning"],
    ["Confirm vendor deliverables", "Venue & Vendors"],
    ["Review pending vendor confirmations", "Venue & Vendors"],
    ["Confirm ceremony requirements", "Foundations"],
    ["Plan guest welcome basics", "Guests & Hospitality"],
    ["Update payment due dates", "Budget & Planning"],
    ["Review pending tasks", "Budget & Planning"],
    ["Check budget warnings", "Budget & Planning"],
  ],
  "2 months before": [
    ["Send formal invitations", "Guests & Hospitality"],
    ["Track RSVPs", "Guests & Hospitality"],
    ["Finalize event floor plans", "Foundations"],
    ["Finalize decor details", "Styling & Planning"],
    ["Finalize sangeet performance order", "Foundations"],
    ["Finalize makeup schedule", "Venue & Vendors"],
    ["Confirm photography schedule", "Venue & Vendors"],
    ["Confirm catering guest estimates", "Venue & Vendors"],
    ["Review pending payments", "Budget & Planning"],
    ["Prepare final event checklists", "Foundations"],
  ],
  "1 month before": [
    ["Close RSVP follow-ups", "Guests & Hospitality"],
    ["Finalize guest count", "Guests & Hospitality"],
    ["Confirm vendor arrival times", "Venue & Vendors"],
    ["Confirm event-wise run-of-show", "Foundations"],
    ["Confirm VIP seating notes if needed", "Guests & Hospitality"],
    ["Confirm ceremony items", "Foundations"],
    ["Confirm outfits and accessories", "Styling & Planning"],
    ["Confirm final menus", "Venue & Vendors"],
    ["Review all unpaid payments", "Budget & Planning"],
    ["Review all event checklists", "Foundations"],
  ],
  "Wedding week": [
    ["Confirm all event timings", "Foundations"],
    ["Confirm all vendor timings", "Venue & Vendors"],
    ["Confirm guest count for each event", "Guests & Hospitality"],
    ["Confirm payment status", "Budget & Planning"],
    ["Review event checklists", "Foundations"],
    ["Review dashboard alerts", "Budget & Planning"],
    ["Mark completed items", "Foundations"],
    ["Confirm no critical task is pending", "Foundations"],
    ["Finalize wedding-day plan", "Foundations"],
  ],
};

// Decorative image keys per event type (used for event card hero strips).
export const EVENT_IMAGE_KEYS: Record<string, string> = {
  haldi: "haldi",
  mehendi: "mehendi",
  sangeet: "sangeet",
  wedding: "wedding",
  reception: "reception",
};

export function typeFromName(name: string): string {
  const key = name.trim().toLowerCase();
  if (["haldi", "mehendi", "sangeet", "wedding", "reception"].includes(key)) return key;
  return "custom";
}
