import { chromium } from "@playwright/test";
const routes = process.argv.slice(2);
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true });
await c.addInitScript(() => localStorage.setItem("onloutou-cookie-choice", JSON.stringify({ measure: false, marketing: false })));
const p = await c.newPage();
for (const r of routes) {
  await p.goto("http://localhost:3000" + r, { waitUntil: "load" });
  await p.waitForTimeout(1500);
  const d = await p.evaluate(() => {
    const t = (e) => e?.textContent?.replace(/\s+/g, " ").trim();
    const first = [...document.querySelectorAll("main a[href], main button, main [role=button]")].filter((e) => { const r = e.getBoundingClientRect(); return r.top < 1000 && r.height > 0 && r.width > 0; }).map((e) => `${t(e)?.slice(0, 50)} -> ${e.getAttribute("href") ?? "(button)"}`);
    const lead = document.querySelector("h1")?.parentElement?.querySelectorAll("p");
    const heads = [...document.querySelectorAll("main h2")].map((e) => t(e)?.slice(0, 70));
    const forms = [...document.querySelectorAll("main form")].map((f) => ({ fields: [...f.querySelectorAll("input,textarea,select")].map((i) => i.getAttribute("name") || i.getAttribute("type") || i.tagName).join(","), submit: t(f.querySelector("button[type=submit]")) }));
    const btns = [...document.querySelectorAll("main button")].map((e) => t(e)).filter((x) => /enregistr|envoyer|prépar|réserv|valider|soumettre|whatsapp|demande/i.test(x ?? "")).slice(0, 8);
    return { h1: t(document.querySelector("h1")), lead: lead ? [...lead].slice(0, 2).map((x) => t(x)?.slice(0, 220)) : [], ctas: first.slice(0, 8), h2: heads.slice(0, 14), forms, actionButtons: btns };
  });
  console.log("\n#### " + r + "\n" + JSON.stringify(d, null, 1));
}
await b.close();
