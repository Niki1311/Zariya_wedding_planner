import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  checklistForType,
  runOfShowForType,
  PLANNING_CHECKLIST,
  CEREMONY_TYPES,
  EVENT_IMAGE_KEYS,
} from "../lib/defaults";
import { BUDGET_CATEGORY_NAMES } from "../lib/types";

const prisma = new PrismaClient();

const DAY = 24 * 60 * 60 * 1000;
function daysFromNow(n: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return new Date(d.getTime() + n * DAY);
}

// Wedding starts ~108 days from now, spanning 3 days.
const WEDDING_START = daysFromNow(108);
const WEDDING_DAY1 = new Date(WEDDING_START);
const WEDDING_DAY2 = new Date(WEDDING_START.getTime() + 1 * DAY);
const WEDDING_DAY3 = new Date(WEDDING_START.getTime() + 2 * DAY);

async function main() {
  console.log("Seeding Zariya demo data...");

  // Wipe demo user (cascades to wedding + all relations)
  await prisma.user.deleteMany({ where: { email: "demo@zariya.app" } });

  const passwordHash = await bcrypt.hash("demo1234", 10);
  const user = await prisma.user.create({
    data: { email: "demo@zariya.app", name: "Aisha", passwordHash },
  });

  const wedding = await prisma.wedding.create({
    data: {
      userId: user.id,
      coupleNames: "Aisha & Rohan",
      weddingName: "Aisha & Rohan's Wedding",
      location: "Udaipur, Rajasthan",
      startDate: WEDDING_START,
      endDate: WEDDING_DAY3,
      totalBudget: 14000000,
      planningPhase: "4 months before",
      guideCompleted: true,
      onboardingDone: true,
    },
  });

  // ----- Events -----
  const eventDefs = [
    { name: "Haldi", type: "haldi", date: WEDDING_DAY1, startTime: "10:00", endTime: "12:00", location: "Courtyard Lawn", desc: "A bright, intimate turmeric ceremony to begin the celebrations." },
    { name: "Mehendi", type: "mehendi", date: WEDDING_DAY1, startTime: "16:00", endTime: "19:00", location: "Lotus Garden", desc: "A floral afternoon of henna, music and mocktails." },
    { name: "Sangeet", type: "sangeet", date: WEDDING_DAY1, startTime: "20:00", endTime: "23:00", location: "Lakeside Ballroom", desc: "An evening of performances, dance and dinner." },
    { name: "Wedding", type: "wedding", date: WEDDING_DAY2, startTime: "16:00", endTime: "19:00", location: "Palace Courtyard", desc: "The main ceremony — pheras and blessings." },
    { name: "Reception", type: "reception", date: WEDDING_DAY3, startTime: "20:00", endTime: "23:00", location: "Grand Durbar Hall", desc: "A grand celebration to close the festivities." },
  ];

  const events: Record<string, string> = {};
  let pos = 0;
  for (const e of eventDefs) {
    const checklist = checklistForType(e.type);
    const ros = runOfShowForType(e.type);
    const created = await prisma.event.create({
      data: {
        weddingId: wedding.id,
        name: e.name,
        type: e.type,
        isCeremony: CEREMONY_TYPES.includes(e.type),
        imageKey: EVENT_IMAGE_KEYS[e.type] ?? null,
        position: pos++,
        date: e.date,
        startTime: e.startTime,
        endTime: e.endTime,
        location: e.location,
        description: e.desc,
        notes:
          e.type === "mehendi"
            ? "Use mogra and marigold accents around the main lounge.\nKeep fans near the artist seating area.\nReserve one quiet corner for bridal photos."
            : "",
        checklist: {
          create: checklist.map((text, i) => ({
            text,
            position: i,
            // mark a believable subset done
            status: i < Math.ceil(checklist.length * (e.type === "wedding" ? 0.4 : e.type === "reception" ? 0.5 : 0.65)) ? "done" : i % 4 === 0 ? "inprogress" : "todo",
          })),
        },
        subEvents: {
          create: ros.map((s, i) => ({ title: s.title, startTime: s.startTime, endTime: s.endTime, position: i })),
        },
      },
    });
    events[e.type] = created.id;
  }

  await prisma.eventTypeOrder.createMany({
    data: eventDefs.map((e, i) => ({ weddingId: wedding.id, name: e.name, position: i })),
  });

  // ----- Vendors -----
  const vendorDefs = [
    { key: "venue", name: "The Grand Udaipur", category: "Venue", brand: "The Grand Udaipur", city: "Udaipur", contact: "Ritesh Mehta", phone: "+91 98290 11223", email: "ritesh@grandudaipur.in", contract: "Confirmed", payment: "Deposit paid", total: 3500000, advance: 1500000, events: ["wedding", "reception"], notes: "Ballroom and stay block secured." },
    { key: "catering", name: "Flavors of India", category: "Catering", brand: "Flavors of India", city: "Udaipur", contact: "Neha Kapoor", phone: "+91 98111 22334", email: "neha@flavorsofindia.in", contract: "Confirmed", payment: "Partial paid", total: 2300000, advance: 800000, events: ["mehendi", "sangeet", "wedding", "reception"], notes: "Multi-cuisine, live counters." },
    { key: "decor", name: "Design Affairs", category: "Decor", brand: "Design Affairs", city: "Jaipur", contact: "Karan Malhotra", phone: "+91 99100 55667", email: "karan@designaffairs.in", contract: "Confirmed", payment: "Advance due", total: 1925000, advance: 600000, events: ["haldi", "mehendi", "sangeet", "wedding", "reception"], notes: "Floral + lighting across all events." },
    { key: "photo", name: "Shutter Story", category: "Photography", brand: "Shutter Story", city: "Mumbai", contact: "Aditya Rao", phone: "+91 98200 77889", email: "hello@shutterstory.in", contract: "Confirmed", payment: "Deposit paid", total: 900000, advance: 350000, events: ["haldi", "mehendi", "sangeet", "wedding", "reception"], notes: "Two-shooter team + candid." },
    { key: "makeup", name: "Bridal Glow Studio", category: "Makeup", brand: "Bridal Glow Studio", city: "Delhi", contact: "Simran Kaur", phone: "+91 98700 33445", email: "simran@bridalglow.in", contract: "In review", payment: "Unpaid", total: 350000, advance: 0, events: ["haldi", "wedding", "reception"], notes: "Bridal + family packages." },
    { key: "mehendiartist", name: "Mehendi Artist Collective", category: "Mehendi artist", brand: "Mehendi Artist Collective", city: "Udaipur", contact: "Pooja Sharma", phone: "+91 99888 11002", email: "book@mehendicollective.in", contract: "Confirmed", payment: "Unpaid", total: 180000, advance: 0, events: ["mehendi"], notes: "Bridal + 4 guest stations." },
    { key: "dj", name: "Beats & Rhythm DJ", category: "Entertainment", brand: "Beats & Rhythm", city: "Mumbai", contact: "Vikram Sethi", phone: "+91 98330 99001", email: "vikram@beatsrhythm.in", contract: "Confirmed", payment: "Advance due", total: 600000, advance: 200000, events: ["sangeet", "reception"], notes: "Sound + lighting + DJ." },
    { key: "choreo", name: "Nritya Choreography", category: "Choreographer", brand: "Nritya", city: "Delhi", contact: "Meera Joshi", phone: "+91 98900 22113", email: "meera@nritya.in", contract: "Pending", payment: "Unpaid", total: 200000, advance: 0, events: ["sangeet"], notes: "Family performance rehearsals." },
    { key: "priest", name: "Pandit Sharma Ji", category: "Priest", brand: "", city: "Udaipur", contact: "Pandit Sharma", phone: "+91 99290 44556", email: "", contract: "Confirmed", payment: "Paid", total: 75000, advance: 75000, events: ["haldi", "wedding"], notes: "Muhurat confirmed." },
    { key: "hospitality", name: "Royal Stay Co", category: "Hospitality", brand: "Royal Stay Co", city: "Udaipur", contact: "Ananya Singh", phone: "+91 98260 77665", email: "ananya@royalstay.in", contract: "Confirmed", payment: "Partial paid", total: 1620000, advance: 800000, events: ["wedding", "reception"], notes: "Guest rooms + welcome baskets." },
    { key: "transport", name: "Udaipur Rides", category: "Transport", brand: "Udaipur Rides", city: "Udaipur", contact: "Manoj Verma", phone: "+91 99300 88776", email: "manoj@udaipurrides.in", contract: "Shortlisted", payment: "Unpaid", total: 450000, advance: 0, events: ["wedding", "reception"], notes: "Guest shuttles + baraat car." },
  ];

  const vendors: Record<string, string> = {};
  for (const v of vendorDefs) {
    const created = await prisma.vendor.create({
      data: {
        weddingId: wedding.id,
        name: v.name,
        category: v.category,
        brand: v.brand,
        city: v.city,
        contactPerson: v.contact,
        phone: v.phone,
        email: v.email,
        prefComm: "WhatsApp",
        contractStatus: v.contract,
        paymentStatus: v.payment,
        totalAgreed: v.total,
        advanceAmount: v.advance,
        nextDueDate: v.payment !== "Paid" ? daysFromNow(Math.floor(Math.random() * 40) + 3) : null,
        notes: v.notes,
        events: { create: v.events.map((etype) => ({ eventId: events[etype] })) },
      },
    });
    vendors[v.key] = created.id;
  }

  // ----- Payments -----
  const paymentDefs = [
    { vendor: "venue", category: "Venue", purpose: "Venue booking deposit", amount: 1500000, paid: -40, method: "Bank transfer" },
    { vendor: "venue", category: "Venue", purpose: "Venue balance", amount: 2000000, due: 30 },
    { vendor: "catering", category: "Catering", purpose: "Catering advance", amount: 800000, paid: -25, method: "UPI" },
    { vendor: "catering", category: "Catering", purpose: "Catering balance", amount: 1500000, due: 45 },
    { vendor: "decor", category: "Decor", purpose: "Decor advance", amount: 600000, paid: -10, method: "Bank transfer" },
    { vendor: "decor", category: "Decor", purpose: "Decor second installment", amount: 700000, due: 5 },
    { vendor: "photo", category: "Photography", purpose: "Photography deposit", amount: 350000, paid: -15, method: "Card" },
    { vendor: "photo", category: "Photography", purpose: "Photography balance", amount: 550000, due: 60 },
    { vendor: "dj", category: "Entertainment", purpose: "DJ advance", amount: 200000, due: 6 },
    { vendor: "mehendiartist", category: "Entertainment", purpose: "Mehendi artist fee", amount: 180000, due: 20 },
    { vendor: "hospitality", category: "Hospitality", purpose: "Hospitality advance", amount: 800000, paid: -20, method: "Bank transfer" },
    { vendor: "hospitality", category: "Hospitality", purpose: "Hospitality final settlement", amount: 820000, due: 50 },
    { vendor: "priest", category: "Miscellaneous", purpose: "Pandit dakshina", amount: 75000, paid: -5, method: "Cash" },
    { vendor: "makeup", category: "Outfits", purpose: "Makeup deposit", amount: 150000, due: -2 },
  ];

  for (const p of paymentDefs) {
    const isPaid = p.paid !== undefined;
    await prisma.payment.create({
      data: {
        weddingId: wedding.id,
        vendorId: vendors[p.vendor],
        category: p.category,
        purpose: p.purpose,
        amount: p.amount,
        method: p.method ?? "",
        status: isPaid ? "Paid" : "Due",
        paidDate: isPaid ? daysFromNow(p.paid!) : null,
        dueDate: !isPaid ? daysFromNow(p.due!) : null,
      },
    });
  }

  // ----- Budget categories -----
  const estimates: Record<string, number> = {
    Venue: 3500000,
    Catering: 2300000,
    Decor: 1750000, // actual 1,925,000 -> over by 175k
    Photography: 950000,
    Entertainment: 1050000,
    Hospitality: 1500000, // actual 1,620,000 -> over by 120k
    Transport: 500000,
    Outfits: 800000,
    Invitations: 300000,
    Gifts: 250000,
    Miscellaneous: 200000,
  };
  await prisma.budgetCategory.createMany({
    data: BUDGET_CATEGORY_NAMES.map((name, i) => ({
      weddingId: wedding.id,
      name,
      position: i,
      estimatedAmount: estimates[name] ?? 0,
    })),
  });

  // ----- Timeline tasks -----
  const phaseMonths: Record<string, number> = {
    "12 months before": 12,
    "10 months before": 10,
    "8 months before": 8,
    "6 months before": 6,
    "4 months before": 4,
    "2 months before": 2,
    "1 month before": 1,
    "Wedding week": 0,
  };
  for (const [phase, tasks] of Object.entries(PLANNING_CHECKLIST)) {
    const months = phaseMonths[phase];
    // due date = wedding start minus (months*30) days; wedding week minus 5 days
    const dueOffset = months === 0 ? -5 : -months * 30;
    const dueDate = new Date(WEDDING_START.getTime() + dueOffset * DAY);
    // earlier phases mostly done; later phases todo
    const doneRatio = months >= 6 ? 1 : months === 4 ? 0.8 : months === 2 ? 0.3 : 0;
    tasks.forEach(([text, category], i) => {
      const done = i < Math.floor(tasks.length * doneRatio);
      const inProgress = !done && months === 2 && i < Math.floor(tasks.length * 0.5);
      // a couple of overdue high-priority items (4-month phase, undone)
      const priority = !done && months <= 4 && i % 5 === 0 ? "High" : i % 3 === 0 ? "Low" : "Medium";
      prismaTaskQueue.push(
        prisma.timelineTask.create({
          data: {
            weddingId: wedding.id,
            text,
            phase,
            category,
            status: done ? "done" : inProgress ? "inprogress" : "todo",
            priority,
            dueDate,
            position: i,
          },
        })
      );
    });
  }
  await Promise.all(prismaTaskQueue);

  // ----- Guests (250) -----
  await seedGuests(wedding.id, events);

  console.log("Seed complete. Demo login: demo@zariya.app / demo1234");
}

const prismaTaskQueue: Promise<unknown>[] = [];

async function seedGuests(weddingId: string, events: Record<string, string>) {
  const first = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Krishna", "Ishaan", "Shaurya", "Ananya", "Diya", "Aadhya", "Saanvi", "Pari", "Anika", "Navya", "Myra", "Sara", "Kiara", "Rohan", "Kabir", "Dev", "Yash", "Nikhil", "Karan", "Rahul", "Amit", "Sunita", "Meera", "Pooja", "Neha", "Ritu", "Kavya", "Tara", "Riya", "Isha", "Nisha", "Priya", "Sneha"];
  const last = ["Mehra", "Kapoor", "Sharma", "Singh", "Verma", "Gupta", "Malhotra", "Reddy", "Nair", "Iyer", "Joshi", "Rao", "Khanna", "Bansal", "Chopra", "Bhatia", "Sethi", "Agarwal", "Desai", "Menon"];
  const segments = ["Family", "Friends", "Work", "Family Friends"];
  const sides = ["Bride side", "Groom side"];
  const allEventKeys = ["haldi", "mehendi", "sangeet", "wedding", "reception"];

  const TOTAL = 250;
  const data: any[] = [];
  for (let i = 0; i < TOTAL; i++) {
    const name = `${first[i % first.length]} ${last[Math.floor(i / first.length) % last.length]}`;
    // distribution: 176 accepted, 42 pending, 32 declined
    let rsvp = "Accepted";
    if (i >= 176 && i < 218) rsvp = "Pending";
    else if (i >= 218) rsvp = "Declined";
    const side = sides[i % 2];
    const segment = segments[i % segments.length];
    // everyone invited to wedding + reception; subsets to others
    const invited = new Set<string>(["wedding", "reception"]);
    if (i % 2 === 0) invited.add("sangeet");
    if (i % 3 === 0) invited.add("mehendi");
    if (i % 4 === 0) invited.add("haldi");
    data.push({
      name,
      side,
      segment,
      rsvp,
      phone: `+91 9${(800000000 + i * 137).toString().slice(0, 9)}`,
      email: `${name.toLowerCase().replace(/\s/g, ".")}@email.com`,
      notes: i % 11 === 0 ? "Vegetarian, VIP seating" : i % 7 === 0 ? "Needs accommodation" : "",
      invited: [...invited],
    });
  }

  for (const g of data) {
    await prisma.guest.create({
      data: {
        weddingId,
        name: g.name,
        phone: g.phone,
        email: g.email,
        side: g.side,
        segment: g.segment,
        rsvpStatus: g.rsvp,
        notes: g.notes,
        events: { create: g.invited.map((k: string) => ({ eventId: events[k] })) },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
