import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DB_FILE = path.join(process.cwd(), "data", "db.json");
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "dr-shahidi-key-2026";

interface DatabaseSchema {
  doctor: any;
  clinicHours: any;
  articles: any[];
  appointments: any[];
  leads: any[];
  services: any[];
  gallery: any[];
  reviews: any[];
  faqs: any[];
}

// Database helper functions
function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const initialEmpty: DatabaseSchema = {
        doctor: {},
        clinicHours: {},
        articles: [],
        appointments: [],
        leads: [],
        services: [],
        gallery: [],
        reviews: [],
        faqs: []
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialEmpty, null, 2), "utf8");
      return initialEmpty;
    }
    const raw = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed.leads) parsed.leads = [];
    return parsed;
  } catch (err) {
    console.error("Error reading database:", err);
    return {
      doctor: {},
      clinicHours: {},
      articles: [],
      appointments: [],
      leads: [],
      services: [],
      gallery: [],
      reviews: [],
      faqs: []
    };
  }
}

function writeDb(data: DatabaseSchema): boolean {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing database:", err);
    return false;
  }
}

// Authentication middleware
function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  const xApiKey = req.headers["x-api-key"] as string | undefined;
  const authHeader = req.headers["authorization"] as string | undefined;

  let providedKey = xApiKey;
  if (!providedKey && authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      providedKey = authHeader.slice(7).trim();
    } else {
      providedKey = authHeader.trim();
    }
  }

  const validKeys = [
    process.env.ADMIN_API_KEY,
    "dr-shahidi-key-2026",
    "Mahdiar87."
  ].filter(Boolean) as string[];

  if (!providedKey || !validKeys.includes(providedKey)) {
    res.status(401).json({
      success: false,
      error: "احراز هویت ناموفق: کلید API نامعتبر است یا در هدر ارسال نشده است.",
      message: "Please provide a valid x-api-key or Authorization: Bearer <key> header.",
      expectedHeader: "x-api-key: dr-shahidi-key-2026"
    });
    return;
  }

  next();
}

async function startServer() {
  const app = express();

  // 1. Enable CORS for all external origins, frameworks and domains
  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-api-key", "X-Requested-With", "Accept"]
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logger for API calls
  app.use("/api", (req, _res, next) => {
    console.log(`[API ${req.method}] ${req.originalUrl} - ${new Date().toISOString()}`);
    next();
  });

  // ==========================================
  // API HEALTH & DOCUMENTATION
  // ==========================================
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      server: "Dr. Shahidi Clinic RESTful API",
      timestamp: new Date().toISOString(),
      cors: "enabled (all origins)",
      authType: "x-api-key or Bearer",
      uptimeSeconds: Math.floor(process.uptime())
    });
  });

  app.get("/api", (_req, res) => {
    res.json({
      name: "وب‌سرویس و API یکپارچه وب‌سایت دکتر اکبر شهیدی پیام",
      version: "1.0.0",
      baseUrl: "/api",
      auth: {
        method: "Header",
        headers: ["x-api-key: dr-shahidi-key-2026", "Authorization: Bearer dr-shahidi-key-2026"]
      },
      endpoints: {
        articles: {
          "GET /api/articles": "دریافت مقالات با جستجو (?search=...) و دسته‌بندی (?category=...)",
          "GET /api/articles/:idOrSlug": "دریافت جزئیات مقاله با شناسه یا اسلاگ",
          "POST /api/articles": "ثبت مقاله جدید (نیازمند x-api-key)",
          "PUT /api/articles/:id": "ویرایش مقاله (نیازمند x-api-key)",
          "DELETE /api/articles/:id": "حذف مقاله (نیازمند x-api-key)"
        },
        doctorProfile: {
          "GET /api/doctor": "مشخصات بیوگرافی، تلفن، آدرس، پیج اینستاگرام و عکس دکتر",
          "PUT /api/doctor": "به‌روزرسانی اطلاعات یا عکس پرتره دکتر (نیازمند x-api-key)"
        },
        clinicHours: {
          "GET /api/clinic-hours": "دریافت ساعات کاری مطب پاسداران",
          "PUT /api/clinic-hours": "تغییر و تنظیم ساعات کاری مطب (نیازمند x-api-key)"
        },
        appointments: {
          "GET /api/appointments": "لیست نوبت‌های بیماران (?status=pending یا confirmed)",
          "POST /api/appointments": "ثبت نوبت جدید از طرف سایت یا منشی",
          "PATCH /api/appointments/:id": "تغییر وضعیت نوبت و درج یادداشت مطب (نیازمند x-api-key)",
          "DELETE /api/appointments/:id": "حذف نوبت (نیازمند x-api-key)"
        },
        services: {
          "GET /api/services": "لیست خدمات جراحی فک و ایمپلنت",
          "POST /api/services": "افزودن خدمت جدید (نیازمند x-api-key)",
          "PUT /api/services/:id": "ویرایش خدمت (نیازمند x-api-key)",
          "DELETE /api/services/:id": "حذف خدمت (نیازمند x-api-key)"
        },
        gallery: {
          "GET /api/gallery": "نمونه‌کارهای قبل و بعد جراحی",
          "POST /api/gallery": "افزودن نمونه‌کار جدید (نیازمند x-api-key)",
          "DELETE /api/gallery/:id": "حذف نمونه‌کار (نیازمند x-api-key)"
        },
        reviews: {
          "GET /api/reviews": "نظرات بیماران و مراجعین",
          "POST /api/reviews": "ارسال نظر جدید از وب‌سایت",
          "PATCH /api/reviews/:id": "تایید یا تغییر وضعیت نظر (نیازمند x-api-key)",
          "DELETE /api/reviews/:id": "حذف نظر (نیازمند x-api-key)"
        },
        faqs: {
          "GET /api/faqs": "سوالات متداول مراجعین",
          "POST /api/faqs": "افزودن سوال و پاسخ (نیازمند x-api-key)",
          "PUT /api/faqs/:id": "ویرایش سوال (نیازمند x-api-key)",
          "DELETE /api/faqs/:id": "حذف سوال (نیازمند x-api-key)"
        }
      }
    });
  });

  // ==========================================
  // 1. ARTICLES ENDPOINTS
  // ==========================================
  app.get("/api/articles", (req, res) => {
    const db = readDb();
    let articles = [...(db.articles || [])];

    const { search, category, status } = req.query;

    if (search && typeof search === "string") {
      const q = search.trim().toLowerCase();
      articles = articles.filter(
        a =>
          a.title?.toLowerCase().includes(q) ||
          a.category?.toLowerCase().includes(q) ||
          a.targetKeyword?.toLowerCase().includes(q) ||
          a.excerpt?.toLowerCase().includes(q) ||
          a.slug?.toLowerCase().includes(q)
      );
    }

    if (category && typeof category === "string") {
      articles = articles.filter(a => a.category === category);
    }

    if (status && typeof status === "string") {
      articles = articles.filter(a => a.status === status);
    }

    res.json({
      success: true,
      count: articles.length,
      data: articles
    });
  });

  app.get("/api/articles/:idOrSlug", (req, res) => {
    const db = readDb();
    const param = req.params.idOrSlug;
    const article = (db.articles || []).find(a => a.id === param || a.slug === param);

    if (!article) {
      res.status(404).json({ success: false, error: "مقاله مورد نظر یافت نشد." });
      return;
    }

    // Increment views counter
    article.views = (article.views || 0) + 1;
    writeDb(db);

    res.json({ success: true, data: article });
  });

  app.post("/api/articles", requireApiKey, (req, res) => {
    const db = readDb();
    const { 
      title, 
      category, 
      targetKeyword, 
      readTimeMin, 
      readTime,
      status, 
      excerpt, 
      summary,
      content, 
      featuredImage, 
      heroImage,
      sections,
      author 
    } = req.body;

    if (!title) {
      res.status(400).json({ success: false, error: "عنوان مقاله الزامی است." });
      return;
    }

    const calculatedReadTimeMin = typeof readTimeMin === "number" 
      ? readTimeMin 
      : (typeof readTime === "string" ? parseInt(readTime, 10) || 5 : 5);

    const newArticle = {
      id: `art-${Date.now()}`,
      slug: (req.body.slug || title.toLowerCase().replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, "-")).slice(0, 80),
      title,
      category: category || "ایمپلنت دندان",
      publishDate: req.body.publishDate || "۱۴۰۳/۰۶/۲۸",
      status: status || "published",
      seoScore: req.body.seoScore || 92,
      targetKeyword: targetKeyword || title,
      readTimeMin: calculatedReadTimeMin,
      readTime: readTime || `${calculatedReadTimeMin} دقیقه مطالعه`,
      views: 0,
      excerpt: summary || excerpt || title,
      summary: summary || excerpt || title,
      content: content || (Array.isArray(sections) && sections.length > 0 ? sections.map((s: any) => `${s.title ? `## ${s.title}\n` : ''}${Array.isArray(s.paragraphs) ? s.paragraphs.join('\n\n') : ''}`).join('\n\n') : ""),
      sections: sections || [],
      author: author || "دکتر اکبر شهیدی پیام",
      featuredImage: heroImage || featuredImage || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
      heroImage: heroImage || featuredImage || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80"
    };

    db.articles = [newArticle, ...(db.articles || [])];
    writeDb(db);

    res.status(201).json({
      success: true,
      message: "مقاله با موفقیت ایجاد گردید.",
      data: newArticle
    });
  });

  app.put("/api/articles/:id", requireApiKey, (req, res) => {
    const db = readDb();
    const id = req.params.id;
    const index = (db.articles || []).findIndex(a => a.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, error: "مقاله برای ویرایش یافت نشد." });
      return;
    }

    const updated = {
      ...db.articles[index],
      ...req.body,
      id // preserve ID
    };

    db.articles[index] = updated;
    writeDb(db);

    res.json({
      success: true,
      message: "مقاله با موفقیت به‌روزرسانی شد.",
      data: updated
    });
  });

  app.delete("/api/articles/:id", requireApiKey, (req, res) => {
    const db = readDb();
    const id = req.params.id;
    const initialLength = (db.articles || []).length;
    db.articles = (db.articles || []).filter(a => a.id !== id);

    if (db.articles.length === initialLength) {
      res.status(404).json({ success: false, error: "مقاله برای حذف یافت نشد." });
      return;
    }

    writeDb(db);
    res.json({ success: true, message: "مقاله با موفقیت حذف گردید." });
  });

  // ==========================================
  // 2. DOCTOR PROFILE ENDPOINTS
  // ==========================================
  app.get("/api/doctor", (_req, res) => {
    const db = readDb();
    res.json({
      success: true,
      data: db.doctor || {}
    });
  });

  app.put("/api/doctor", requireApiKey, (req, res) => {
    const db = readDb();
    db.doctor = {
      ...(db.doctor || {}),
      ...req.body
    };
    writeDb(db);

    res.json({
      success: true,
      message: "اطلاعات و مشخصات دکتر با موفقیت به‌روزرسانی شد.",
      data: db.doctor
    });
  });

  // ==========================================
  // 3. CLINIC HOURS ENDPOINTS
  // ==========================================
  app.get("/api/clinic-hours", (_req, res) => {
    const db = readDb();
    res.json({
      success: true,
      data: db.clinicHours || {}
    });
  });

  app.put("/api/clinic-hours", requireApiKey, (req, res) => {
    const db = readDb();
    db.clinicHours = {
      ...(db.clinicHours || {}),
      ...req.body
    };
    writeDb(db);

    res.json({
      success: true,
      message: "ساعات کاری مطب با موفقیت به‌روزرسانی شد.",
      data: db.clinicHours
    });
  });

  // ==========================================
  // 4. APPOINTMENTS ENDPOINTS
  // ==========================================
  app.get("/api/appointments", (req, res) => {
    const db = readDb();
    let list = [...(db.appointments || [])];
    const { status, search } = req.query;

    if (status && typeof status === "string") {
      list = list.filter(a => a.status === status);
    }

    if (search && typeof search === "string") {
      const q = search.trim().toLowerCase();
      list = list.filter(
        a =>
          a.patientName?.toLowerCase().includes(q) ||
          a.phone?.includes(q) ||
          a.service?.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  });

  // POST /api/appointments: can be called from website form (public or auth)
  app.post("/api/appointments", (req, res) => {
    const db = readDb();
    const { patientName, phone, service, requestedDate, timeSlot, notes, source } = req.body;

    if (!patientName || !phone) {
      res.status(400).json({ success: false, error: "نام بیمار و شماره تماس الزامی است." });
      return;
    }

    const trackingCode = `SH-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppointment = {
      id: `app-${Date.now()}`,
      patientName,
      phone,
      service: service || "مشاوره حضوری جراحی فک و صورت",
      requestedDate: requestedDate || "امروز",
      timeSlot: timeSlot || "ساعت ۱۷:۰۰",
      status: "pending",
      bookedAt: "هم‌اکنون از وب‌سایت",
      source: source || "سایت اصلی (فرم آنلاین)",
      notes: notes || "",
      trackingCode
    };

    // Auto-create lead in secretary CRM as well
    const newLead = {
      id: `lead-app-${Date.now()}`,
      name: patientName,
      phone,
      service: "jaw_surgery",
      serviceNameFa: service || "مشاوره جراحی فک و صورت",
      source: "website",
      sourceNameFa: source || "فرم نوبت‌دهی آنلاین وب‌سایت",
      date: new Intl.DateTimeFormat("fa-IR").format(new Date()),
      timeAgo: "لحظاتی پیش",
      status: "new",
      priority: "high",
      hasXray: false,
      chiefComplaint: notes || `درخواست نوبت آنلاین برای تاریخ ${requestedDate || 'امروز'} (${timeSlot || 'عصر'})`,
      notes: `ثبت آنلاین در وب‌سایت مطب. کد رهگیری: ${trackingCode}`,
      appointmentId: newAppointment.id,
      battlecard: {
        patientConcern: "استعلام ساعت دقیق حضور و تایید نهایی ویزیت",
        talkingPoint: "هماهنگی ساعت دقیق حضور در مطب پاسداران و یادآوری همراه داشتن عکس رادیولوژی (CBCT/OPG)",
        doctorHighlight: "دکتر اکبر شهیدی پیام، بورد تخصصی جراحی دهان، فک و صورت",
        specialOfferOrFee: "ویزیت تشخیصی و طرح درمان"
      },
      smsHistory: []
    };

    db.appointments = [newAppointment, ...(db.appointments || [])];
    db.leads = [newLead, ...(db.leads || [])];
    writeDb(db);

    res.status(201).json({
      success: true,
      message: "نوبت با موفقیت در سامانه مطب ثبت شد و در کارتابل منشی قرار گرفت.",
      data: newAppointment
    });
  });

  app.patch("/api/appointments/:id", requireApiKey, (req, res) => {
    const db = readDb();
    const id = req.params.id;
    const index = (db.appointments || []).findIndex(a => a.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, error: "نوبت مورد نظر یافت نشد." });
      return;
    }

    const { status, notes, adminNotes } = req.body;
    if (status) db.appointments[index].status = status;
    const finalNotes = adminNotes !== undefined ? adminNotes : notes;
    if (finalNotes !== undefined) {
      db.appointments[index].notes = finalNotes;
      db.appointments[index].adminNotes = finalNotes;
    }

    // Sync with corresponding lead if exists
    const leadIndex = (db.leads || []).findIndex(l => l.appointmentId === id);
    if (leadIndex !== -1 && status) {
      db.leads[leadIndex].status = status === 'confirmed' ? 'booked' : status === 'cancelled' ? 'cancelled' : 'new';
    }

    writeDb(db);

    res.json({
      success: true,
      message: "وضعیت نوبت با موفقیت تغییر یافت.",
      data: db.appointments[index]
    });
  });

  app.delete("/api/appointments/:id", requireApiKey, (req, res) => {
    const db = readDb();
    const id = req.params.id;
    const initialLen = (db.appointments || []).length;
    db.appointments = (db.appointments || []).filter(a => a.id !== id);

    if (db.appointments.length === initialLen) {
      res.status(404).json({ success: false, error: "نوبت برای حذف یافت نشد." });
      return;
    }

    // Also remove linked lead if present
    db.leads = (db.leads || []).filter(l => l.appointmentId !== id);

    writeDb(db);
    res.json({ success: true, message: "نوبت با موفقیت حذف گردید." });
  });

  // ==========================================
  // 4.5. LEADS (PATIENT CRM) ENDPOINTS
  // ==========================================
  app.get("/api/leads", (req, res) => {
    const db = readDb();
    let list = [...(db.leads || [])];
    const { status, search } = req.query;

    if (status && typeof status === "string" && status !== "all") {
      list = list.filter(l => l.status === status);
    }

    if (search && typeof search === "string") {
      const q = search.trim().toLowerCase();
      list = list.filter(
        l =>
          l.name?.toLowerCase().includes(q) ||
          l.phone?.includes(q) ||
          l.serviceNameFa?.toLowerCase().includes(q) ||
          l.chiefComplaint?.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  });

  app.post("/api/leads", (req, res) => {
    const db = readDb();
    const { name, phone, service, serviceNameFa, source, sourceNameFa, chiefComplaint, notes, priority, battlecard } = req.body;

    if (!name || !phone) {
      res.status(400).json({ success: false, error: "نام بیمار و شماره تماس الزامی است." });
      return;
    }

    const newLead = {
      id: `lead-${Date.now()}`,
      name,
      phone,
      service: service || "implant",
      serviceNameFa: serviceNameFa || (service === "jaw_surgery" ? "جراحی فک و صورت" : "ایمپلنت دیجیتال فوری"),
      source: source || "website",
      sourceNameFa: sourceNameFa || "ثبت دستی منشی",
      date: new Intl.DateTimeFormat("fa-IR").format(new Date()),
      timeAgo: "لحظاتی پیش",
      status: "new",
      priority: priority || "high",
      hasXray: Boolean(req.body.hasXray),
      xrayUrl: req.body.xrayUrl || undefined,
      chiefComplaint: chiefComplaint || "مراجعه حضوری به مطب پاسداران",
      notes: notes || "ثبت شده توسط منشی مطب",
      battlecard: battlecard || {
        patientConcern: "استعلام ساعت ویزیت و هزینه جراحی",
        talkingPoint: "توضیح زمان‌های ویزیت دکتر شهیدی در مطب پاسداران و تجهیزات کم‌تهاجمی",
        doctorHighlight: "دکتر اکبر شهیدی پیام، بورد تخصصی جراحی دهان، فک و صورت",
        specialOfferOrFee: "تعرفه مصوب مطب"
      },
      smsHistory: []
    };

    db.leads = [newLead, ...(db.leads || [])];
    writeDb(db);

    res.status(201).json({
      success: true,
      message: "پرونده بیمار با موفقیت در کارتابل مطب ثبت شد.",
      data: newLead
    });
  });

  app.patch("/api/leads/:id", (req, res) => {
    const db = readDb();
    const id = req.params.id;
    const index = (db.leads || []).findIndex(l => l.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, error: "پرونده بیمار یافت نشد." });
      return;
    }

    db.leads[index] = {
      ...db.leads[index],
      ...req.body,
      id // preserve ID
    };

    writeDb(db);

    res.json({
      success: true,
      message: "پرونده بیمار با موفقیت به‌روزرسانی شد.",
      data: db.leads[index]
    });
  });

  app.delete("/api/leads/:id", (req, res) => {
    const db = readDb();
    const id = req.params.id;
    const initialLen = (db.leads || []).length;
    db.leads = (db.leads || []).filter(l => l.id !== id);

    if (db.leads.length === initialLen) {
      res.status(404).json({ success: false, error: "پرونده بیمار برای حذف یافت نشد." });
      return;
    }

    writeDb(db);
    res.json({ success: true, message: "پرونده بیمار با موفقیت از سیستم حذف گردید." });
  });

  // ==========================================
  // 5. SERVICES ENDPOINTS
  // ==========================================
  app.get("/api/services", (_req, res) => {
    const db = readDb();
    res.json({
      success: true,
      count: (db.services || []).length,
      data: db.services || []
    });
  });

  app.post("/api/services", requireApiKey, (req, res) => {
    const db = readDb();
    const { title, category, description, duration, recoveryDays, featured } = req.body;

    if (!title) {
      res.status(400).json({ success: false, error: "عنوان خدمت الزامی است." });
      return;
    }

    const newService = {
      id: `srv-${Date.now()}`,
      title,
      category: category || "جراحی فک",
      description: description || "",
      duration: duration || "۳۰ دقیقه",
      recoveryDays: recoveryDays || "۳ روز",
      featured: featured !== undefined ? featured : true
    };

    db.services = [...(db.services || []), newService];
    writeDb(db);

    res.status(201).json({
      success: true,
      message: "خدمت جدید ثبت شد.",
      data: newService
    });
  });

  app.put("/api/services/:id", requireApiKey, (req, res) => {
    const db = readDb();
    const id = req.params.id;
    const index = (db.services || []).findIndex(s => s.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, error: "خدمت یافت نشد." });
      return;
    }

    db.services[index] = { ...db.services[index], ...req.body, id };
    writeDb(db);

    res.json({
      success: true,
      message: "خدمت به‌روزرسانی شد.",
      data: db.services[index]
    });
  });

  app.delete("/api/services/:id", requireApiKey, (req, res) => {
    const db = readDb();
    const id = req.params.id;
    db.services = (db.services || []).filter(s => s.id !== id);
    writeDb(db);
    res.json({ success: true, message: "خدمت حذف شد." });
  });

  // ==========================================
  // 6. GALLERY (BEFORE & AFTER) ENDPOINTS
  // ==========================================
  app.get("/api/gallery", (_req, res) => {
    const db = readDb();
    res.json({
      success: true,
      count: (db.gallery || []).length,
      data: db.gallery || []
    });
  });

  app.post("/api/gallery", requireApiKey, (req, res) => {
    const db = readDb();
    const { title, category, beforeImageUrl, afterImageUrl, description, patientAgeGender, procedureDuration } = req.body;

    if (!title || !beforeImageUrl || !afterImageUrl) {
      res.status(400).json({ success: false, error: "عنوان و تصاویر قبل و بعد الزامی است." });
      return;
    }

    const newItem = {
      id: `gal-${Date.now()}`,
      title,
      category: category || "جراحی ارتوگناتیک",
      beforeImageUrl,
      afterImageUrl,
      patientAgeGender: patientAgeGender || "",
      procedureDuration: procedureDuration || "",
      description: description || ""
    };

    db.gallery = [newItem, ...(db.gallery || [])];
    writeDb(db);

    res.status(201).json({
      success: true,
      message: "نمونه‌کار قبل و بعد ثبت شد.",
      data: newItem
    });
  });

  app.delete("/api/gallery/:id", requireApiKey, (req, res) => {
    const db = readDb();
    const id = req.params.id;
    db.gallery = (db.gallery || []).filter(g => g.id !== id);
    writeDb(db);
    res.json({ success: true, message: "نمونه‌کار حذف شد." });
  });

  // ==========================================
  // 7. REVIEWS ENDPOINTS
  // ==========================================
  app.get("/api/reviews", (_req, res) => {
    const db = readDb();
    res.json({
      success: true,
      count: (db.reviews || []).length,
      data: db.reviews || []
    });
  });

  app.post("/api/reviews", (req, res) => {
    const db = readDb();
    const { patientName, procedure, rating, comment } = req.body;

    if (!patientName || !comment) {
      res.status(400).json({ success: false, error: "نام بیمار و متن نظر الزامی است." });
      return;
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      patientName,
      procedure: procedure || "جراحی فک",
      rating: rating || 5,
      comment,
      date: "هم‌اکنون",
      verified: false
    };

    db.reviews = [newReview, ...(db.reviews || [])];
    writeDb(db);

    res.status(201).json({
      success: true,
      message: "نظر شما با موفقیت ثبت شد و پس از بررسی توسط مطب نمایش داده می‌شود.",
      data: newReview
    });
  });

  app.patch("/api/reviews/:id", requireApiKey, (req, res) => {
    const db = readDb();
    const id = req.params.id;
    const index = (db.reviews || []).findIndex(r => r.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, error: "نظر یافت نشد." });
      return;
    }

    if (req.body.verified !== undefined) {
      db.reviews[index].verified = Boolean(req.body.verified);
    }

    writeDb(db);
    res.json({ success: true, message: "وضعیت نظر تغییر کرد.", data: db.reviews[index] });
  });

  app.delete("/api/reviews/:id", requireApiKey, (req, res) => {
    const db = readDb();
    const id = req.params.id;
    db.reviews = (db.reviews || []).filter(r => r.id !== id);
    writeDb(db);
    res.json({ success: true, message: "نظر حذف شد." });
  });

  // ==========================================
  // 8. FAQS ENDPOINTS
  // ==========================================
  app.get("/api/faqs", (_req, res) => {
    const db = readDb();
    res.json({
      success: true,
      count: (db.faqs || []).length,
      data: db.faqs || []
    });
  });

  app.post("/api/faqs", requireApiKey, (req, res) => {
    const db = readDb();
    const { question, answer, category } = req.body;

    if (!question || !answer) {
      res.status(400).json({ success: false, error: "صورت سوال و پاسخ الزامی است." });
      return;
    }

    const newFaq = {
      id: `faq-${Date.now()}`,
      question,
      answer,
      category: category || "عمومی"
    };

    db.faqs = [...(db.faqs || []), newFaq];
    writeDb(db);

    res.status(201).json({
      success: true,
      message: "سوال متداول ایجاد شد.",
      data: newFaq
    });
  });

  app.put("/api/faqs/:id", requireApiKey, (req, res) => {
    const db = readDb();
    const id = req.params.id;
    const index = (db.faqs || []).findIndex(f => f.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, error: "سوال یافت نشد." });
      return;
    }

    db.faqs[index] = { ...db.faqs[index], ...req.body, id };
    writeDb(db);

    res.json({ success: true, message: "سوال متداول به‌روزرسانی شد.", data: db.faqs[index] });
  });

  app.delete("/api/faqs/:id", requireApiKey, (req, res) => {
    const db = readDb();
    const id = req.params.id;
    db.faqs = (db.faqs || []).filter(f => f.id !== id);
    writeDb(db);
    res.json({ success: true, message: "سوال متداول حذف شد." });
  });

  // ==========================================
  // VITE MIDDLEWARE (DEV) & STATIC SERVING (PROD)
  // ==========================================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Dr. Shahidi API & App running on http://0.0.0.0:${PORT}`);
    console.log(`[SERVER] REST API Base URL: http://localhost:${PORT}/api`);
    console.log(`[SERVER] Admin API Key: ${ADMIN_API_KEY}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
