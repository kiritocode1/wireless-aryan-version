/**
 * One-shot asset backfill.
 *
 * Reads every local asset that used to be hardcoded in the static UI, uploads
 * it to the appropriate Supabase Storage bucket, and writes the resulting
 * public URL into the row it belongs to.
 *
 * Re-runnable: uploads use stable storage keys with upsert=true, and every
 * DB write is an UPDATE keyed on a natural column (or an upsert for home_slider).
 *
 *   Usage:
 *     bun scripts/backfill-assets.ts
 *
 *   Auth: signs in as an admin user via email/password. Set ADMIN_EMAIL and
 *   ADMIN_PASSWORD in your env (or .env.local), or you'll be prompted at run.
 *   The account must have profiles.is_admin = true.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, existsSync } from "node:fs";

// untyped client — this script touches tables not in the app's generated
// Database typings, and the strict typing fights every call.
type SB = SupabaseClient<any, any, any>;

// ---------- env ----------
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  fail("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in env.");
}

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = resolve(REPO_ROOT, "src/assets");
const PUBLIC_PDFS = resolve(REPO_ROOT, "public/pdfs");

// ---------- types ----------
type Bucket = "photos" | "pdfs";

type UploadSpec = {
  /** Local file path, absolute. */
  file: string;
  /** Stable storage key inside the bucket. Re-runs upsert here. */
  key: string;
  bucket: Bucket;
  contentType: string;
};

type Update =
  | {
      kind: "update";
      table: string;
      set: Record<string, string>;
      where: Record<string, string | number>;
    }
  | {
      kind: "kv";
      key: string;
      value_url: string;
    }
  | {
      kind: "upsert_slider";
      photo_url: string;
      title_en: string;
      title_mr: string;
      subtitle_en: string;
      subtitle_mr: string;
      display_order: number;
    };

type Job = {
  label: string;
  upload: UploadSpec;
  writes: (publicUrl: string) => Update[];
};

// ---------- manifest ----------
//
// Mapping derived from the pre-Supabase static pages at commit 0ea7b78:
//   src/pages/about/FormerDirectors.tsx     → a.png … l.png
//   src/pages/about/WelfareActivities.tsx   → 11.jpg … 17.jpg, 20.jpg
//   src/pages/about/OfficesHeadquarters.tsx → 11.jpg (placeholder, all rows)
//   src/pages/PhotoGallery.tsx              → gallery/<file>
//   src/pages/Faculty.tsx                   → no real photos existed (used /images/personN.png which is not in repo) → 21.png placeholder
//   src/pages/citizen/PressRelease.tsx      → press/press1.png, press/press2.png
//   src/components/HeroSection.tsx          → director.jpg, hero/Slider.jpeg, hero/2.jpg
//   src/pages/about/Hierarchy.tsx           → heirarchy.png
//   Ranks page                              → public/pdfs/Ranks-in-PCIT.pdf
//   src/pages/TrainingCalender.tsx          → public/pdfs/training-calendar-2025.pdf, training-calendar-2026.pdf

const jobs: Job[] = [
  // ────────── director's desk (singleton id=1) ──────────
  {
    label: "director_current.photo_url",
    upload: {
      file: `${ASSETS}/director.jpg`,
      key: "seed/director_current/director.jpg",
      bucket: "photos",
      contentType: "image/jpeg",
    },
    writes: (url) => [
      { kind: "update", table: "director_current", set: { photo_url: url }, where: { id: 1 } },
    ],
  },

  // ────────── former directors (display_order 1..12) ──────────
  ...formerDirectorJob(1, "a.png", "Sunil Ramanand"),
  ...formerDirectorJob(2, "b.png", "Retesh Kumaarr"),
  ...formerDirectorJob(3, "c.png", "Jagannath"),
  ...formerDirectorJob(4, "d.png", "Suresh Kakkar"),
  ...formerDirectorJob(5, "e.png", "P P P Sharma"),
  ...formerDirectorJob(6, "f.png", "B T Nghinglova"),
  ...formerDirectorJob(7, "g.png", "P T Lohar"),
  ...formerDirectorJob(8, "h.png", "P K Joshi"),
  ...formerDirectorJob(9, "i.png", "A D Jog"),
  ...formerDirectorJob(10, "j.png", "S M Nabar"),
  ...formerDirectorJob(11, "k.png", "L A Paddon Row"),
  ...formerDirectorJob(12, "l.png", "E A Dodwell"),

  // ────────── welfare activities (matched by title_en) ──────────
  ...welfareJob("11.jpg", "Museum – Evolution in Wireless Department"),
  ...welfareJob("12.jpg", "Canteen – Muktai"),
  ...welfareJob("13.jpg", "Badminton Hall – Sant Tukaram Sankul"),
  ...welfareJob("14.jpg", "Senior Officers Mess – Dnyaneshwari"),
  ...welfareJob("15.jpg", "Junior officer's Mess – Sanchar"),
  ...welfareJob("16.jpg", "Open Museum – Aryabhatta Garden"),
  ...welfareJob("17.jpg", "Parade ground"),
  ...welfareJob("20.jpg", "Maharashtra Police Wireless Welfare Complex and Convention Centre"),

  // ────────── photo gallery (matched by display_order) ──────────
  ...galleryJob(
    1,
    "gallery/Dr-APJ-Abdul-Kalam-Innovation-Centre-HM-Inaugration-1.jpg",
    "image/jpeg",
    "kalam-innovation",
  ),
  ...galleryJob(2, "gallery/Republic-Day-4.jpg", "image/jpeg", "republic-day"),
  ...galleryJob(3, "gallery/Ashok-Jog-Lecture-Hall-Inauguration-2.jpeg", "image/jpeg", "ashok-jog-hall"),
  ...galleryJob(4, "gallery/DGP-Inaugration-1.jpg", "image/jpeg", "dnyaneshwari-mess"),

  // ────────── press releases (matched by published_date) ──────────
  {
    label: "press_releases[2025-08-15].photo_url",
    upload: {
      file: `${ASSETS}/press/press1.png`,
      key: "seed/press_releases/press1.png",
      bucket: "photos",
      contentType: "image/png",
    },
    writes: (url) => [
      {
        kind: "update",
        table: "press_releases",
        set: { photo_url: url },
        where: { published_date: "2025-08-15" },
      },
    ],
  },
  {
    label: "press_releases[2025-01-26].photo_url",
    upload: {
      file: `${ASSETS}/press/press2.png`,
      key: "seed/press_releases/press2.png",
      bucket: "photos",
      contentType: "image/png",
    },
    writes: (url) => [
      {
        kind: "update",
        table: "press_releases",
        set: { photo_url: url },
        where: { published_date: "2025-01-26" },
      },
    ],
  },

  // ────────── faculty (placeholder; original /images/personN.png did not exist in repo) ──────────
  {
    label: "faculty placeholder photo (shared)",
    upload: {
      file: `${ASSETS}/21.png`,
      key: "seed/faculty/placeholder-21.png",
      bucket: "photos",
      contentType: "image/png",
    },
    writes: (url) => [
      { kind: "update", table: "faculty", set: { photo_url: url }, where: { name_en: "Dr. Sanjaykumar G. Sonar" } },
      { kind: "update", table: "faculty", set: { photo_url: url }, where: { name_en: "Dr. Arati Siddharth Petkar" } },
    ],
  },

  // ────────── office_sections (all 11 rows used 11.jpg in static page) ──────────
  {
    label: "office_sections placeholder photo (shared by all rows)",
    upload: {
      file: `${ASSETS}/11.jpg`,
      key: "seed/office_sections/placeholder-11.jpg",
      bucket: "photos",
      contentType: "image/jpeg",
    },
    writes: (url) => [
      "administrative_office",
      "technical_branch",
      "development_section",
      "vsat_section",
      "store_sections",
      "committee_section",
      "test_cell",
      "central_store_admin",
      "cipher_branch",
      "license_branch",
      "traffic_branch",
    ].map((slug) => ({
      kind: "update" as const,
      table: "office_sections",
      set: { photo_url: url },
      where: { slug },
    })),
  },

  // ────────── home_slider (table is empty; we INSERT 2 slides) ──────────
  {
    label: "home_slider slide 1 (Slider.jpeg)",
    upload: {
      file: `${ASSETS}/hero/Slider.jpeg`,
      key: "seed/home_slider/01-slider.jpeg",
      bucket: "photos",
      contentType: "image/jpeg",
    },
    writes: (url) => [
      {
        kind: "upsert_slider",
        photo_url: url,
        title_en: "",
        title_mr: "",
        subtitle_en: "",
        subtitle_mr: "",
        display_order: 1,
      },
    ],
  },
  {
    label: "home_slider slide 2 (hero/2.jpg)",
    upload: {
      file: `${ASSETS}/hero/2.jpg`,
      key: "seed/home_slider/02-hero-2.jpg",
      bucket: "photos",
      contentType: "image/jpeg",
    },
    writes: (url) => [
      {
        kind: "upsert_slider",
        photo_url: url,
        title_en: "",
        title_mr: "",
        subtitle_en: "",
        subtitle_mr: "",
        display_order: 2,
      },
    ],
  },

  // ────────── site_settings (KV) ──────────
  {
    label: "site_settings.hierarchy_image_url",
    upload: {
      file: `${ASSETS}/heirarchy.png`,
      key: "seed/site_settings/hierarchy.png",
      bucket: "photos",
      contentType: "image/png",
    },
    writes: (url) => [{ kind: "kv", key: "hierarchy_image_url", value_url: url }],
  },
  {
    label: "site_settings.ranks_master_pdf_url",
    upload: {
      file: `${PUBLIC_PDFS}/Ranks-in-PCIT.pdf`,
      key: "seed/site_settings/ranks.pdf",
      bucket: "pdfs",
      contentType: "application/pdf",
    },
    writes: (url) => [{ kind: "kv", key: "ranks_master_pdf_url", value_url: url }],
  },

  // ────────── training_calendars (matched by year) ──────────
  {
    label: "training_calendars[2025].pdf_url",
    upload: {
      file: `${PUBLIC_PDFS}/training-calendar-2025.pdf`,
      key: "seed/training_calendars/2025.pdf",
      bucket: "pdfs",
      contentType: "application/pdf",
    },
    writes: (url) => [
      { kind: "update", table: "training_calendars", set: { pdf_url: url }, where: { year: 2025 } },
    ],
  },
  {
    label: "training_calendars[2026].pdf_url",
    upload: {
      file: `${PUBLIC_PDFS}/training-calendar-2026.pdf`,
      key: "seed/training_calendars/2026.pdf",
      bucket: "pdfs",
      contentType: "application/pdf",
    },
    writes: (url) => [
      { kind: "update", table: "training_calendars", set: { pdf_url: url }, where: { year: 2026 } },
    ],
  },
];

function formerDirectorJob(displayOrder: number, file: string, slugName: string): Job[] {
  const slug = slugName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return [
    {
      label: `former_directors[${displayOrder}].photo_url (${slugName})`,
      upload: {
        file: `${ASSETS}/${file}`,
        key: `seed/former_directors/${String(displayOrder).padStart(2, "0")}-${slug}.png`,
        bucket: "photos",
        contentType: "image/png",
      },
      writes: (url) => [
        {
          kind: "update",
          table: "former_directors",
          set: { photo_url: url },
          where: { display_order: displayOrder },
        },
      ],
    },
  ];
}

function welfareJob(file: string, titleEn: string): Job[] {
  const slug = titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
  return [
    {
      label: `welfare_activities["${titleEn}"].photo_url`,
      upload: {
        file: `${ASSETS}/${file}`,
        key: `seed/welfare_activities/${slug}.jpg`,
        bucket: "photos",
        contentType: "image/jpeg",
      },
      writes: (url) => [
        { kind: "update", table: "welfare_activities", set: { photo_url: url }, where: { title_en: titleEn } },
      ],
    },
  ];
}

function galleryJob(displayOrder: number, relPath: string, contentType: string, slugName: string): Job[] {
  const ext = relPath.split(".").pop() ?? "jpg";
  return [
    {
      label: `photo_gallery[${displayOrder}].photo_url (${slugName})`,
      upload: {
        file: `${ASSETS}/${relPath}`,
        key: `seed/photo_gallery/${String(displayOrder).padStart(2, "0")}-${slugName}.${ext}`,
        bucket: "photos",
        contentType,
      },
      writes: (url) => [
        { kind: "update", table: "photo_gallery", set: { photo_url: url }, where: { display_order: displayOrder } },
      ],
    },
  ];
}

// ---------- runner ----------
async function main() {
  // pre-flight: all local files exist
  const missing = jobs
    .map((j) => j.upload.file)
    .filter((f) => !existsSync(f));
  if (missing.length) {
    fail("Missing local files:\n  " + missing.join("\n  "));
  }

  const supabase: SB = createClient(SUPABASE_URL!, SUPABASE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const email = process.env.ADMIN_EMAIL ?? (await ask("Admin email: "));
  const password = process.env.ADMIN_PASSWORD ?? (await ask("Admin password: ", true));

  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
  if (authErr || !auth.session) fail(`Sign-in failed: ${authErr?.message ?? "no session"}`);

  // Verify is_admin
  const { data: prof, error: profErr } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", auth.user!.id)
    .single();
  if (profErr || !prof?.is_admin) {
    fail(
      `Signed in as ${email} but profiles.is_admin is not true.\n` +
        `Run this SQL in Supabase as a superuser to grant admin:\n` +
        `  update profiles set is_admin = true where id = '${auth.user!.id}';`,
    );
  }
  console.log(`✓ Authed as ${email} (is_admin)`);

  let ok = 0;
  let fails = 0;

  for (const job of jobs) {
    try {
      const url = await upload(supabase, job.upload);
      for (const w of job.writes(url)) {
        await applyWrite(supabase, w);
      }
      console.log(`✓ ${job.label}`);
      ok++;
    } catch (e: any) {
      console.error(`✗ ${job.label}: ${e?.message ?? e}`);
      fails++;
    }
  }

  // verification pass
  console.log("\n— Verification —");
  await verify(supabase);

  console.log(`\nDone. ${ok} ok, ${fails} failed.`);
  process.exit(fails === 0 ? 0 : 1);
}

async function upload(supabase: SB, spec: UploadSpec): Promise<string> {
  const bytes = readFileSync(spec.file);
  const { error } = await supabase.storage
    .from(spec.bucket)
    .upload(spec.key, bytes, {
      contentType: spec.contentType,
      cacheControl: "3600",
      upsert: true,
    });
  if (error) throw new Error(`upload ${spec.key}: ${error.message}`);
  const { data } = supabase.storage.from(spec.bucket).getPublicUrl(spec.key);
  return data.publicUrl;
}

async function applyWrite(supabase: SB, w: Update): Promise<void> {
  const db = supabase as any;
  if (w.kind === "update") {
    let q: any = db.from(w.table).update(w.set, { count: "exact" });
    for (const [k, v] of Object.entries(w.where)) {
      q = q.eq(k, v);
    }
    const { error, count } = await q;
    if (error) throw new Error(`update ${w.table}: ${error.message}`);
    if (count === 0) {
      throw new Error(
        `update ${w.table} matched 0 rows for ${JSON.stringify(w.where)} — row not seeded?`,
      );
    }
    return;
  }

  if (w.kind === "kv") {
    const { error } = await db
      .from("site_settings")
      .upsert(
        { key: w.key, value_url: w.value_url, updated_at: new Date().toISOString() },
        { onConflict: "key" },
      );
    if (error) throw new Error(`site_settings ${w.key}: ${error.message}`);
    return;
  }

  if (w.kind === "upsert_slider") {
    // home_slider has no natural unique key; key on (display_order) idempotently.
    const { data: existing, error: selErr } = await db
      .from("home_slider")
      .select("id")
      .eq("display_order", w.display_order)
      .limit(1);
    if (selErr) throw new Error(`home_slider lookup: ${selErr.message}`);
    if (existing && existing.length > 0) {
      const { error } = await db
        .from("home_slider")
        .update({
          photo_url: w.photo_url,
          title_en: w.title_en,
          title_mr: w.title_mr,
          subtitle_en: w.subtitle_en,
          subtitle_mr: w.subtitle_mr,
          is_active: true,
        })
        .eq("id", existing[0].id);
      if (error) throw new Error(`home_slider update: ${error.message}`);
    } else {
      const { error } = await db.from("home_slider").insert({
        photo_url: w.photo_url,
        title_en: w.title_en,
        title_mr: w.title_mr,
        subtitle_en: w.subtitle_en,
        subtitle_mr: w.subtitle_mr,
        display_order: w.display_order,
        is_active: true,
      });
      if (error) throw new Error(`home_slider insert: ${error.message}`);
    }
    return;
  }
}

async function verify(supabase: SB) {
  const db = supabase as any;
  const checks: { label: string; run: () => Promise<any> }[] = [
    {
      label: "director_current photo_url",
      run: () => db.from("director_current").select("photo_url").eq("id", 1).single(),
    },
    {
      label: "former_directors with photo_url",
      run: () => db.from("former_directors").select("id", { count: "exact", head: true }).not("photo_url", "is", null),
    },
    {
      label: "welfare_activities with photo_url",
      run: () => db.from("welfare_activities").select("id", { count: "exact", head: true }).not("photo_url", "is", null),
    },
    {
      label: "photo_gallery photo_url (non-/assets)",
      run: () => db.from("photo_gallery").select("id", { count: "exact", head: true }).not("photo_url", "like", "/assets/%"),
    },
    {
      label: "press_releases with photo_url",
      run: () => db.from("press_releases").select("id", { count: "exact", head: true }).not("photo_url", "is", null),
    },
    {
      label: "office_sections with photo_url",
      run: () => db.from("office_sections").select("id", { count: "exact", head: true }).not("photo_url", "is", null),
    },
    {
      label: "faculty with photo_url",
      run: () => db.from("faculty").select("id", { count: "exact", head: true }).not("photo_url", "is", null),
    },
    {
      label: "training_calendars pdf_url (storage URL)",
      run: () => db.from("training_calendars").select("id", { count: "exact", head: true }).like("pdf_url", "%/storage/v1/object/public/pdfs/%"),
    },
    {
      label: "home_slider active rows",
      run: () => db.from("home_slider").select("id", { count: "exact", head: true }).eq("is_active", true),
    },
    {
      label: "site_settings.hierarchy_image_url",
      run: () => db.from("site_settings").select("value_url").eq("key", "hierarchy_image_url").single(),
    },
    {
      label: "site_settings.ranks_master_pdf_url",
      run: () => db.from("site_settings").select("value_url").eq("key", "ranks_master_pdf_url").single(),
    },
  ];

  for (const c of checks) {
    const res = await c.run();
    if (res.error) {
      console.log(`  ? ${c.label}: ${res.error.message}`);
      continue;
    }
    if (typeof res.count === "number") {
      console.log(`  • ${c.label}: ${res.count}`);
    } else if (res.data) {
      const v = res.data.photo_url ?? res.data.value_url;
      console.log(`  • ${c.label}: ${v ? "set" : "NULL"}`);
    }
  }
}

// ---------- helpers ----------
function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

async function ask(prompt: string, secret = false): Promise<string> {
  if (secret) {
    process.stdout.write(prompt);
    process.stdin.setRawMode?.(true);
    return await new Promise<string>((res) => {
      let buf = "";
      const onData = (d: Buffer) => {
        const s = d.toString();
        for (const ch of s) {
          if (ch === "\r" || ch === "\n") {
            process.stdin.setRawMode?.(false);
            process.stdin.removeListener("data", onData);
            process.stdout.write("\n");
            return res(buf);
          }
          if (ch === "") {
            process.exit(130);
          }
          if (ch === "" || ch === "\b") {
            buf = buf.slice(0, -1);
            continue;
          }
          buf += ch;
        }
      };
      process.stdin.on("data", onData);
      process.stdin.resume();
    });
  }
  process.stdout.write(prompt);
  return await new Promise<string>((res) => {
    process.stdin.once("data", (d) => res(d.toString().trim()));
    process.stdin.resume();
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
