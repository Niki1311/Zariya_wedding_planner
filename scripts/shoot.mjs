import puppeteer from "puppeteer-core";
import fs from "fs";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = "http://localhost:3000";
const OUT = "shots";
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--window-size=1440,900"],
});

async function shot(page, path, name, full = false) {
  await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full });
  console.log("shot", name);
}

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// Public pages
await shot(page, "/", "01-landing", true);
await shot(page, "/features", "02-features");
await shot(page, "/signin", "03-signin");
await shot(page, "/signup", "04-signup");

// Login via form
await page.goto(BASE + "/signin", { waitUntil: "networkidle2" });
await page.type('input[type=email]', "demo@zariya.app");
await page.type('input[type=password]', "demo1234");
await Promise.all([
  page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 }).catch(() => {}),
  page.click('button[type=submit]'),
]);
await new Promise((r) => setTimeout(r, 2000));

await shot(page, "/app", "05-dashboard", true);
await shot(page, "/app/timeline", "06-timeline", true);
await shot(page, "/app/timeline/calendar", "07-calendar", true);
await shot(page, "/app/events", "08-events", true);
const wid = await (await fetch(BASE + "/api/wedding", { headers: { cookie: (await page.cookies()).map(c=>c.name+"="+c.value).join("; ") } }).then(r=>r.json()).catch(()=>null));
// event detail
const evId = wid?.events?.[0]?.id;
if (evId) await shot(page, "/app/events/" + evId, "09-event-detail", true);
await shot(page, "/app/schedule", "10-schedule", true);
await shot(page, "/app/guests", "11-guests", true);
await shot(page, "/app/vendors", "12-vendors", true);
await shot(page, "/app/vendors/new", "13-vendor-new", true);
await shot(page, "/app/budget", "14-budget", true);
await shot(page, "/app/budget/categories", "15-budget-categories", true);
await shot(page, "/app/payments", "16-payments", true);
await shot(page, "/app/settings", "17-settings", true);

await browser.close();
console.log("DONE");
