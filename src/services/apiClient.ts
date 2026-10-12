import axios, { AxiosInstance } from 'axios';
import {
  ArticleItem,
  OnlineAppointment,
  DoctorProfile,
  ClinicHours,
  ClinicService,
  GalleryItem,
  ReviewItem,
  FaqItem,
  Lead
} from '../types';

// ==========================================
// DYNAMIC CONFIGURATION & PERSISTENCE
// ==========================================
export const STORAGE_KEY_API_URL = 'dr_shahidi_site_api_url';
export const STORAGE_KEY_API_KEY = 'dr_shahidi_site_api_key';

// Default values: reads from Vite environment variable or defaults to /api
export const DEFAULT_API_URL = ((import.meta as any).env?.VITE_SITE_API_URL as string) || '/api';
export const DEFAULT_API_KEY = ((import.meta as any).env?.VITE_SITE_API_KEY as string) || 'dr-shahidi-key-2026';

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem(STORAGE_KEY_API_URL);
    if (custom && custom.trim()) {
      return custom.trim().replace(/\/+$/, '');
    }
  }
  return DEFAULT_API_URL.replace(/\/+$/, '');
}

export function setApiBaseUrl(url: string): void {
  if (typeof window !== 'undefined') {
    if (url && url.trim()) {
      localStorage.setItem(STORAGE_KEY_API_URL, url.trim().replace(/\/+$/, ''));
    } else {
      localStorage.removeItem(STORAGE_KEY_API_URL);
    }
  }
}

export function getApiKey(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem(STORAGE_KEY_API_KEY);
    if (custom && custom.trim()) {
      return custom.trim();
    }
  }
  return DEFAULT_API_KEY;
}

export function setApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
    }
  }
}

export function resetApiConfig(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_API_URL);
    localStorage.removeItem(STORAGE_KEY_API_KEY);
  }
}

// ==========================================
// AXIOS CLIENT (Central Dynamic Client)
// ==========================================
export const siteApi: AxiosInstance = axios.create({
  timeout: 8000
});

// Dynamic Interceptor: always attaches current Base URL and API Key
siteApi.interceptors.request.use((config) => {
  const currentBaseUrl = getApiBaseUrl();
  const currentKey = getApiKey();

  config.baseURL = currentBaseUrl;
  if (config.headers) {
    (config.headers as any)['Content-Type'] = 'application/json';
    (config.headers as any)['x-api-key'] = currentKey;
    (config.headers as any)['Authorization'] = `Bearer ${currentKey}`;
  }

  return config;
});

// ==========================================
// HEALTH & PING CHECK
// ==========================================
export async function pingApiHealth(): Promise<{
  ok: boolean;
  status: string;
  latencyMs: number;
  data?: any;
  error?: string;
  testedUrl: string;
}> {
  const start = performance.now();
  const baseUrl = getApiBaseUrl();
  const testedUrl = `${baseUrl}/health`;

  try {
    const res = await siteApi.get('/health');
    const latencyMs = Math.round(performance.now() - start);
    return {
      ok: true,
      status: `${res.status} OK`,
      latencyMs,
      data: res.data,
      testedUrl
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    const msg = err.response?.data?.error || err.message || 'عدم پاسخگویی سرور';
    return {
      ok: false,
      status: err.response ? `HTTP ${err.response.status}` : 'Connection Failed',
      latencyMs,
      error: msg,
      testedUrl
    };
  }
}

// ==========================================
// 1. ARTICLES (مدیریت مقالات و آموزش‌ها)
// ==========================================
export async function getArticles(params?: { search?: string; category?: string; status?: string }): Promise<ArticleItem[]> {
  const res = await siteApi.get('/articles', { params });
  return res.data?.data || [];
}

export async function createArticleApi(article: Partial<ArticleItem>): Promise<ArticleItem> {
  const res = await siteApi.post('/articles', article);
  return res.data?.data;
}

// تابع اختصاصی ساخت مقاله از فرم پنل با فیلدهای درخواستی
export async function createArticleFromPanel(formData: {
  title: string;
  category?: string;
  readTime?: string;
  summary?: string;
  imageUrl?: string;
  content?: string;
}): Promise<any> {
  const res = await siteApi.post('/articles', {
    title: formData.title,
    category: formData.category || 'ایمپلنت دندان',
    readTime: formData.readTime || '۵ دقیقه مطالعه',
    summary: formData.summary,
    heroImage: formData.imageUrl,
    sections: [
      {
        title: 'مقدمه و توضیحات',
        paragraphs: [formData.content || '']
      }
    ]
  });
  return res.data?.data || res.data;
}

export async function updateArticleApi(id: string, article: Partial<ArticleItem>): Promise<ArticleItem> {
  const res = await siteApi.put(`/articles/${id}`, article);
  return res.data?.data;
}

export async function deleteArticleApi(id: string): Promise<boolean> {
  const res = await siteApi.delete(`/articles/${id}`);
  return res.status === 200 || res.status === 204;
}

// ==========================================
// 2. APPOINTMENTS (نوبت‌های آنلاین بیماران)
// ==========================================
export async function getAppointments(status?: string): Promise<OnlineAppointment[]> {
  const res = await siteApi.get('/appointments', {
    params: status && status !== 'all' ? { status } : undefined
  });
  return res.data?.data || [];
}

// دریافت نوبت‌های جدید در انتظار تایید
export async function getPendingAppointments(): Promise<OnlineAppointment[]> {
  const res = await siteApi.get('/appointments?status=pending');
  return res.data?.data || [];
}

// تایید نوبت توسط منشی در پنل
export async function confirmAppointment(appointmentId: string, notes?: string): Promise<any> {
  const res = await siteApi.patch(`/appointments/${appointmentId}`, {
    status: 'confirmed',
    adminNotes: notes || 'هماهنگی تلفنی با بیمار انجام شد.'
  });
  return res.data?.data || res.data;
}

export async function patchAppointmentStatus(id: string, status: 'confirmed' | 'pending' | 'cancelled', notes?: string): Promise<boolean> {
  const res = await siteApi.patch(`/appointments/${id}`, {
    status,
    notes,
    adminNotes: notes
  });
  return res.status === 200;
}

export async function createAppointmentApi(appointment: Partial<OnlineAppointment>): Promise<OnlineAppointment> {
  const res = await siteApi.post('/appointments', appointment);
  return res.data?.data;
}

export async function deleteAppointmentApi(id: string): Promise<boolean> {
  const res = await siteApi.delete(`/appointments/${id}`);
  return res.status === 200 || res.status === 204;
}

// ==========================================
// 3. DOCTOR PROFILE & CLINIC PHONES
// ==========================================
export async function getDoctorProfile(): Promise<DoctorProfile> {
  const res = await siteApi.get('/doctor');
  return res.data?.data;
}

export async function updateDoctorProfile(profile: Partial<DoctorProfile>): Promise<DoctorProfile> {
  const res = await siteApi.put('/doctor', profile);
  return res.data?.data;
}

// تغییر شماره تماس یا مشخصات مطب از پنل
export async function updateClinicPhones(phone1: string, phone2: string): Promise<any> {
  const res = await siteApi.put('/doctor', {
    phone: phone1,
    mobile: phone2
  });
  return res.data?.data || res.data;
}

// ==========================================
// 4. CLINIC HOURS (ساعات کاری مطب)
// ==========================================
export async function getClinicHours(): Promise<ClinicHours> {
  const res = await siteApi.get('/clinic-hours');
  return res.data?.data;
}

export async function updateClinicHours(hours: Partial<ClinicHours>): Promise<ClinicHours> {
  const res = await siteApi.put('/clinic-hours', hours);
  return res.data?.data;
}

// ==========================================
// 5. SERVICES (سرویس‌ها و خدمات)
// ==========================================
export async function getServicesApi(): Promise<ClinicService[]> {
  const res = await siteApi.get('/services');
  return res.data?.data || [];
}

export async function createServiceApi(srv: Partial<ClinicService>): Promise<ClinicService> {
  const res = await siteApi.post('/services', srv);
  return res.data?.data;
}

export async function deleteServiceApi(id: string): Promise<boolean> {
  const res = await siteApi.delete(`/services/${id}`);
  return res.status === 200 || res.status === 204;
}

// ==========================================
// 6. GALLERY (نمونه‌کارهای قبل و بعد)
// ==========================================
export async function getGalleryApi(): Promise<GalleryItem[]> {
  const res = await siteApi.get('/gallery');
  return res.data?.data || [];
}

export async function createGalleryApi(item: Partial<GalleryItem>): Promise<GalleryItem> {
  const res = await siteApi.post('/gallery', item);
  return res.data?.data;
}

// ==========================================
// 7. REVIEWS & FAQS
// ==========================================
export async function getReviewsApi(): Promise<ReviewItem[]> {
  const res = await siteApi.get('/reviews');
  return res.data?.data || [];
}

export async function patchReviewStatus(id: string, verified: boolean): Promise<boolean> {
  const res = await siteApi.patch(`/reviews/${id}`, { verified });
  return res.status === 200;
}

export async function getFaqsApi(): Promise<FaqItem[]> {
  const res = await siteApi.get('/faqs');
  return res.data?.data || [];
}

export async function createFaqApi(faq: Partial<FaqItem>): Promise<FaqItem> {
  const res = await siteApi.post('/faqs', faq);
  return res.data?.data;
}

// ==========================================
// 8. LEADS & PATIENTS (پرونده مراجعین و بیماران)
// ==========================================
export async function getLeadsApi(): Promise<Lead[]> {
  const res = await siteApi.get('/leads');
  return res.data?.data || [];
}

export async function createLeadApi(lead: Partial<Lead>): Promise<Lead> {
  const res = await siteApi.post('/leads', lead);
  return res.data?.data;
}

export async function updateLeadApi(id: string, updates: Partial<Lead>): Promise<Lead> {
  const res = await siteApi.patch(`/leads/${id}`, updates);
  return res.data?.data;
}

export async function deleteLeadApi(id: string): Promise<boolean> {
  const res = await siteApi.delete(`/leads/${id}`);
  return res.status === 200 || res.status === 204;
}

// ==========================================
// 9. MEDIA & FILE UPLOAD (/media/drshahidi)
// ==========================================
export interface UploadResponse {
  success: boolean;
  message: string;
  url: string;
  fullUrl: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  storagePath: string;
}

export async function uploadImageApi(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await siteApi.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    }
  });

  return res.data;
}

export async function getMediaFilesApi(): Promise<Array<{
  filename: string;
  url: string;
  size: number;
  createdAt: string;
  isImage: boolean;
}>> {
  const res = await siteApi.get('/media');
  return res.data?.files || [];
}

export async function deleteMediaFileApi(filename: string): Promise<boolean> {
  const res = await siteApi.delete(`/media/${encodeURIComponent(filename)}`);
  return res.data?.success || false;
}

export interface MediaConfigResponse {
  success: boolean;
  currentPath: string;
  resolvedPath?: string;
  defaultPath: string;
  exists: boolean;
  writable: boolean;
  created?: boolean;
  totalFiles: number;
  message?: string;
  error?: string | null;
}

export async function getMediaConfigApi(): Promise<MediaConfigResponse> {
  const res = await siteApi.get('/media/config');
  return res.data;
}

export async function updateMediaConfigApi(storagePath: string): Promise<MediaConfigResponse> {
  const res = await siteApi.post('/media/config', { storagePath });
  return res.data;
}


