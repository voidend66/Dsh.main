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
    // Crucial: Do not force application/json if sending FormData (multipart uploads)
    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
    if (isFormData) {
      delete (config.headers as any)['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      (config.headers as any)['Content-Type'] = 'application/json';
    }
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
    featuredImage: formData.imageUrl,
    heroImage: formData.imageUrl,
    imageUrl: formData.imageUrl,
    image: formData.imageUrl,
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

export async function createServiceApi(srv: Partial<ClinicService> & { image?: string; featuredImage?: string }): Promise<ClinicService> {
  const payload = {
    ...srv,
    imageUrl: srv.imageUrl || srv.image,
    image: srv.imageUrl || srv.image,
    featuredImage: srv.imageUrl || srv.image
  };
  const res = await siteApi.post('/services', payload);
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
  publicUrl?: string;
  directUrl?: string;
  relativeUrl?: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  storagePath: string;
  activeDir?: string;
  error?: string;
}

export function toPublicMediaUrl(pathOrUrl?: string): string {
  if (!pathOrUrl || typeof pathOrUrl !== 'string') return '';
  const trimmed = pathOrUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const customApi = getApiBaseUrl();
  if (customApi.startsWith('http://') || customApi.startsWith('https://')) {
    const origin = customApi.replace(/\/api\/?$/, '');
    return `${origin}${cleanPath}`;
  }
  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin}${cleanPath}`;
  }
  return cleanPath;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export async function uploadImageApi(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResponse> {
  const currentBaseUrl = getApiBaseUrl();
  const apiKey = getApiKey();
  const endpoint = currentBaseUrl.endsWith('/api') ? `${currentBaseUrl}/upload` : `${currentBaseUrl}/api/upload`;

  // Strategy 1: Native XMLHttpRequest with FormData (clean multipart boundary generated by browser)
  const tryMultipartUpload = (targetUrl: string = endpoint): Promise<UploadResponse> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', targetUrl);
      xhr.setRequestHeader('x-api-key', apiKey);
      xhr.setRequestHeader('Authorization', `Bearer ${apiKey}`);
      // NOTE: Do not set Content-Type so browser sets multipart/form-data boundary automatically

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
      }

      xhr.onload = () => {
        try {
          const json = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && json.success) {
            const publicUrl = toPublicMediaUrl(json.fullUrl || json.url || `/media/drshahidi/${file.name}`);
            resolve({
              ...json,
              url: publicUrl,
              fullUrl: publicUrl,
              publicUrl
            });
          } else {
            reject(new Error(json.error || `خطای آپلود با کد وضعیت ${xhr.status}`));
          }
        } catch {
          if (xhr.status >= 200 && xhr.status < 300) {
            const publicUrl = toPublicMediaUrl(`/media/drshahidi/${file.name}`);
            resolve({
              success: true,
              message: 'فایل با موفقیت ذخیره شد.',
              url: publicUrl,
              fullUrl: publicUrl,
              publicUrl,
              filename: file.name,
              originalName: file.name,
              size: file.size,
              mimetype: file.type || 'image/jpeg',
              storagePath: `/media/drshahidi/${file.name}`
            });
          } else {
            reject(new Error(`سرور پاسخ نامعتبر با کد ${xhr.status} ارسال نمود.`));
          }
        }
      };

      xhr.onerror = () => reject(new Error('خطای شبکه حین آپلود تصویر'));

      const formData = new FormData();
      formData.append('image', file);
      formData.append('file', file);
      formData.append('filename', file.name);
      xhr.send(formData);
    });
  };

  // Strategy 2: Base64 JSON upload fallback (100% reliable across any proxy, iframe, or network environment)
  const tryBase64Upload = async (): Promise<UploadResponse> => {
    const base64Data = await fileToBase64(file);
    if (onProgress) onProgress(60);

    const postPayload = {
      imageBase64: base64Data,
      image: base64Data,
      file: base64Data,
      filename: file.name,
      originalName: file.name,
      mimetype: file.type || 'image/jpeg'
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'Authorization': `Bearer ${apiKey}`
    };

    // Try relative endpoints first
    try {
      const res = await axios.post('/api/upload', postPayload, { headers });
      if (onProgress) onProgress(100);
      const publicUrl = toPublicMediaUrl(res.data.fullUrl || res.data.url);
      return { ...res.data, url: publicUrl, fullUrl: publicUrl, publicUrl };
    } catch {
      try {
        const res2 = await axios.post('/upload', postPayload, { headers });
        if (onProgress) onProgress(100);
        const publicUrl2 = toPublicMediaUrl(res2.data.fullUrl || res2.data.url);
        return { ...res2.data, url: publicUrl2, fullUrl: publicUrl2, publicUrl: publicUrl2 };
      } catch {
        const res3 = await siteApi.post('/upload', postPayload);
        if (onProgress) onProgress(100);
        const publicUrl3 = toPublicMediaUrl(res3.data.fullUrl || res3.data.url);
        return { ...res3.data, url: publicUrl3, fullUrl: publicUrl3, publicUrl: publicUrl3 };
      }
    }
  };

  try {
    return await tryMultipartUpload(endpoint);
  } catch (err: any) {
    console.warn('[UPLOAD] Primary multipart upload failed, attempting relative multipart...', err);
    try {
      if (endpoint !== '/api/upload') {
        return await tryMultipartUpload('/api/upload');
      }
      throw err;
    } catch {
      console.warn('[UPLOAD] Switching to Base64 direct storage fallback...');
      try {
        return await tryBase64Upload();
      } catch (fallbackErr: any) {
        let msg = 'خطا در بارگذاری تصویر روی دیسک سرور';
        if (fallbackErr?.response?.data?.error) {
          msg = fallbackErr.response.data.error;
        } else if (fallbackErr?.response?.data?.message) {
          msg = fallbackErr.response.data.message;
        } else if (err?.message && !err.message.includes('status code 400') && !err.message.includes('Network error')) {
          msg = err.message;
        } else if (fallbackErr?.message && !fallbackErr.message.includes('status code 400')) {
          msg = fallbackErr.message;
        }
        throw new Error(msg);
      }
    }
  }
}

export async function getMediaFilesApi(): Promise<Array<{
  filename: string;
  url: string;
  fullUrl?: string;
  publicUrl?: string;
  relativeUrl?: string;
  size: number;
  createdAt: string;
  isImage: boolean;
}>> {
  const res = await siteApi.get('/media');
  const files = res.data?.files || [];
  return files.map((f: any) => ({
    ...f,
    url: toPublicMediaUrl(f.fullUrl || f.url),
    fullUrl: toPublicMediaUrl(f.fullUrl || f.url),
    publicUrl: toPublicMediaUrl(f.fullUrl || f.url),
    relativeUrl: f.relativeUrl || f.url
  }));
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
  publicMediaUrl?: string;
  publicOrigin?: string;
  samplePublicUrl?: string;
  exists: boolean;
  writable: boolean;
  created?: boolean;
  totalFiles: number;
  message?: string;
  error?: string | null;
}

export async function getMediaConfigApi(): Promise<MediaConfigResponse> {
  const currentBaseUrl = getApiBaseUrl();
  const endpoint = currentBaseUrl.endsWith('/api') ? '/media/config' : '/api/media/config';

  try {
    const res = await siteApi.get(endpoint);
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 404 || !err.response) {
      try {
        const fb1 = await axios.get('/api/media/config');
        return fb1.data;
      } catch {
        const fb2 = await axios.get('/media/config');
        return fb2.data;
      }
    }
    throw err;
  }
}

export async function updateMediaConfigApi(
  options: { storagePath?: string; publicMediaUrl?: string } | string
): Promise<MediaConfigResponse> {
  const currentBaseUrl = getApiBaseUrl();
  const endpoint = currentBaseUrl.endsWith('/api') ? '/media/config' : '/api/media/config';
  const payload = typeof options === 'string' ? { storagePath: options } : options;

  try {
    const res = await siteApi.post(endpoint, payload);
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 404 || !err.response) {
      try {
        const fb1 = await axios.post('/api/media/config', payload);
        return fb1.data;
      } catch {
        const fb2 = await axios.post('/media/config', payload);
        return fb2.data;
      }
    }
    throw err;
  }
}

export interface MediaDiagnosticsResponse {
  success: boolean;
  environment: {
    platform: string;
    nodeVersion: string;
    currentUser: string;
    isRoot: boolean;
    cwd: string;
  };
  storage: {
    activeDir: string;
    activeDirExists: boolean;
    activeDirWritable: boolean;
    activeDirError: string | null;
    safeLocalDir: string;
    safeLocalDirExists: boolean;
    safeLocalDirWritable: boolean;
    effectiveDir: string;
    isFallbackActive: boolean;
    fallbackWarning: string | null;
  };
  linuxHelp: {
    needsSudoPermissions: boolean;
    commandsToFixActiveDir: string[];
    zeroSudoAlternative: string;
  };
}

export async function getMediaDiagnosticsApi(): Promise<MediaDiagnosticsResponse> {
  const currentBaseUrl = getApiBaseUrl();
  const endpoint = currentBaseUrl.endsWith('/api') ? '/media/diagnostics' : '/api/media/diagnostics';

  try {
    const res = await siteApi.get(endpoint);
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 404 || !err.response) {
      try {
        const fb1 = await axios.get('/api/media/diagnostics');
        return fb1.data;
      } catch {
        const fb2 = await axios.get('/media/diagnostics');
        return fb2.data;
      }
    }
    throw err;
  }
}


