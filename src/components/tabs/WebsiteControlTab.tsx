import React, { useState, useEffect, useCallback } from 'react';
import { 
  Globe, 
  FileText, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Plus, 
  RefreshCw, 
  Search,
  Code,
  User,
  Phone,
  MapPin,
  Instagram,
  Send,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Check,
  Copy,
  Terminal,
  Layers,
  Sparkles,
  MessageSquare,
  HelpCircle,
  Image,
  AlertCircle,
  Server,
  Settings2,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  HardDrive,
  FolderOpen,
  FolderPlus,
  Folder,
  Upload
} from 'lucide-react';
import { 
  ArticleItem, 
  OnlineAppointment, 
  DoctorProfile, 
  ClinicHours, 
  ClinicService, 
  GalleryItem, 
  ReviewItem, 
  FaqItem 
} from '../../types';
import { toPersianDigits } from '../../utils/formatters';
import { 
  siteApi,
  getApiBaseUrl,
  setApiBaseUrl,
  getApiKey,
  setApiKey,
  resetApiConfig,
  pingApiHealth, 
  getArticles, 
  createArticleFromPanel,
  deleteArticleApi,
  getDoctorProfile, 
  updateDoctorProfile, 
  updateClinicPhones,
  getClinicHours, 
  updateClinicHours,
  getAppointments,
  getPendingAppointments,
  confirmAppointment,
  createAppointmentApi,
  patchAppointmentStatus,
  deleteAppointmentApi,
  getServicesApi,
  createServiceApi,
  deleteServiceApi,
  getGalleryApi,
  getReviewsApi,
  getFaqsApi,
  getMediaFilesApi,
  deleteMediaFileApi,
  getMediaConfigApi,
  updateMediaConfigApi,
  MediaConfigResponse
} from '../../services/apiClient';
import { ImageUploader } from '../ImageUploader';

interface WebsiteControlTabProps {
  articles: ArticleItem[];
  appointments: OnlineAppointment[];
  onAddArticle?: (art: ArticleItem) => void;
  onUpdateAppointmentStatus?: (id: string, status: 'confirmed' | 'pending' | 'cancelled') => void;
  showToast: (msg: string) => void;
}

export const WebsiteControlTab: React.FC<WebsiteControlTabProps> = ({
  onAddArticle,
  onUpdateAppointmentStatus,
  showToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'articles' | 'appointments' | 'doctor_profile' | 'services' | 'media' | 'api_docs'
  >('articles');

  // Dynamic API configuration state
  const [customApiUrl, setCustomApiUrl] = useState<string>(getApiBaseUrl());
  const [customApiKey, setCustomApiKey] = useState<string>(getApiKey());
  const [showConfigDrawer, setShowConfigDrawer] = useState<boolean>(false);

  // Connection & Health state
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // 100% Live API data states (No mock fallbacks!)
  const [articlesList, setArticlesList] = useState<ArticleItem[]>([]);
  const [appointmentsList, setAppointmentsList] = useState<OnlineAppointment[]>([]);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [clinicHours, setClinicHours] = useState<ClinicHours | null>(null);
  const [services, setServices] = useState<ClinicService[]>([]);
  const [mediaList, setMediaList] = useState<Array<{ filename: string; url: string; size: number; createdAt: string; isImage?: boolean }>>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState<boolean>(false);
  const [mediaSearch, setMediaSearch] = useState<string>('');
  const [mediaConfig, setMediaConfig] = useState<MediaConfigResponse | null>(null);
  const [customStoragePath, setCustomStoragePath] = useState<string>('/media/drshahidi');
  const [isSavingStoragePath, setIsSavingStoragePath] = useState<boolean>(false);
  const [storagePathMessage, setStoragePathMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Search and filters
  const [articleSearch, setArticleSearch] = useState<string>('');
  const [articleCategoryFilter, setArticleCategoryFilter] = useState<string>('all');
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  // Quick Action Modals & Forms
  // 1. Fast Article Form (createArticleFromPanel)
  const [showFastArticleModal, setShowFastArticleModal] = useState<boolean>(false);
  const [fastArtTitle, setFastArtTitle] = useState<string>('');
  const [fastArtCategory, setFastArtCategory] = useState<string>('ایمپلنت دندان');
  const [fastArtReadTime, setFastArtReadTime] = useState<string>('۵ دقیقه مطالعه');
  const [fastArtSummary, setFastArtSummary] = useState<string>('');
  const [fastArtImageUrl, setFastArtImageUrl] = useState<string>('');
  const [fastArtContent, setFastArtContent] = useState<string>('');
  const [isSubmittingArticle, setIsSubmittingArticle] = useState<boolean>(false);

  // 2. Fast Phone Update Form (updateClinicPhones)
  const [showFastPhoneModal, setShowFastPhoneModal] = useState<boolean>(false);
  const [fastPhone1, setFastPhone1] = useState<string>('');
  const [fastPhone2, setFastPhone2] = useState<string>('');
  const [isSubmittingPhones, setIsSubmittingPhones] = useState<boolean>(false);

  // 3. Confirm Appointment Notes Modal (confirmAppointment)
  const [selectedAppForConfirm, setSelectedAppForConfirm] = useState<OnlineAppointment | null>(null);
  const [confirmNotes, setConfirmNotes] = useState<string>('هماهنگی تلفنی با بیمار انجام شد و زمان ویزیت نهایی گردید.');
  const [isConfirmingApp, setIsConfirmingApp] = useState<boolean>(false);

  // New Service Modal
  const [showAddServiceModal, setShowAddServiceModal] = useState<boolean>(false);
  const [newSrvTitle, setNewSrvTitle] = useState<string>('');
  const [newSrvCategory, setNewSrvCategory] = useState<string>('جراحی فک');
  const [newSrvDesc, setNewSrvDesc] = useState<string>('');
  const [newSrvImageUrl, setNewSrvImageUrl] = useState<string>('');
  const [newSrvEstimatedTime, setNewSrvEstimatedTime] = useState<string>('۱ الی ۲ جلسه');

  // API Tester state
  const [apiTesterEndpoint, setApiTesterEndpoint] = useState<string>('GET /articles');
  const [apiTesterResponse, setApiTesterResponse] = useState<string>('');
  const [apiTesterStatus, setApiTesterStatus] = useState<string>('');
  const [apiTesterTime, setApiTesterTime] = useState<number>(0);
  const [isExecutingApiTest, setIsExecutingApiTest] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [codeSnippetLang, setCodeSnippetLang] = useState<'curl' | 'axios' | 'python' | 'php'>('axios');

  // Load all live data from the direct API connection
  const loadLiveData = useCallback(async () => {
    setIsRefreshing(true);
    setConnectionStatus('checking');
    setConnectionError(null);

    // 1. First ping the health endpoint
    const pingRes = await pingApiHealth();
    if (!pingRes.ok) {
      setConnectionStatus('error');
      setConnectionError(pingRes.error || 'ارتباط با وب‌سرویس برقرار نشد.');
      setPingLatency(null);
      setIsRefreshing(false);
      // STRICT CONSTRAINT: Do NOT populate with mock data on failure!
      setArticlesList([]);
      setAppointmentsList([]);
      return;
    }

    setConnectionStatus('connected');
    setPingLatency(pingRes.latencyMs);

    // 2. Fetch live collections from direct API
    try {
      const [articlesData, appointmentsData, doctorData, hoursData, servicesData, mediaData, configData] = await Promise.all([
        getArticles(),
        getAppointments(),
        getDoctorProfile(),
        getClinicHours(),
        getServicesApi(),
        getMediaFilesApi(),
        getMediaConfigApi().catch(() => null)
      ]);

      setArticlesList(Array.isArray(articlesData) ? articlesData : []);
      setAppointmentsList(Array.isArray(appointmentsData) ? appointmentsData : []);
      if (doctorData) {
        setDoctor(doctorData);
        setFastPhone1(doctorData.phone || '021-22589000');
        setFastPhone2(doctorData.mobile || '0912-1112233');
      }
      if (hoursData) setClinicHours(hoursData);
      if (Array.isArray(servicesData)) setServices(servicesData);
      if (Array.isArray(mediaData)) setMediaList(mediaData);
      if (configData && configData.currentPath) {
        setMediaConfig(configData);
        setCustomStoragePath(configData.currentPath);
      }
    } catch (err: any) {
      console.error('Error fetching live data from API:', err);
      setConnectionStatus('error');
      setConnectionError(err.message || 'خطا در واکشی اطلاعات از API');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleRefreshMedia = async () => {
    setIsLoadingMedia(true);
    try {
      const [files, cfg] = await Promise.all([
        getMediaFilesApi(),
        getMediaConfigApi().catch(() => null)
      ]);
      setMediaList(files);
      if (cfg && cfg.currentPath) {
        setMediaConfig(cfg);
        setCustomStoragePath(cfg.currentPath);
      }
      showToast('فهرست تصاویر و وضعیت پوشه ذخیره‌سازی به‌روزرسانی شد.');
    } catch (err: any) {
      showToast(`خطا در بازخوانی فایل‌های رسانه: ${err.message}`);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const handleSaveStoragePath = async (overridePath?: string) => {
    const targetPath = (overridePath || customStoragePath || '').trim();
    if (!targetPath) {
      showToast('لطفاً یک مسیر ذخیره‌سازی معتبر وارد کنید.');
      return;
    }
    setIsSavingStoragePath(true);
    setStoragePathMessage(null);
    try {
      const res = await updateMediaConfigApi(targetPath);
      if (res && res.success) {
        setMediaConfig(res);
        setCustomStoragePath(res.currentPath);
        setStoragePathMessage({
          type: 'success',
          text: res.message || 'مسیر با موفقیت تنظیم و ذخیره شد.'
        });
        showToast(res.message || 'مسیر ذخیره‌سازی با موفقیت تنظیم شد.');
        const files = await getMediaFilesApi();
        setMediaList(files);
      } else {
        const errText = res?.error || 'خطا در ثبت مسیر جدید';
        setStoragePathMessage({ type: 'error', text: errText });
        showToast(errText);
      }
    } catch (err: any) {
      let errMsg = err.response?.data?.error || err.message || 'خطا در ارتباط با سرور';
      if (errMsg.includes('status code 400') || errMsg.includes('400')) {
        errMsg = 'خطا در تنظیم مسیر ذخیره‌سازی. لطفاً فرمت آدرس را بررسی یا از گزینه‌های پیش‌فرض استفاده نمایید.';
      }
      setStoragePathMessage({ type: 'error', text: errMsg });
      showToast(`خطا: ${errMsg}`);
    } finally {
      setIsSavingStoragePath(false);
    }
  };

  const handleDeleteMedia = async (filename: string) => {
    const activeDir = mediaConfig?.currentPath || customStoragePath || '/media/drshahidi';
    if (!window.confirm(`آیا از حذف عکس «${filename}» از مسیر «${activeDir}» اطمینان دارید؟`)) return;
    try {
      const ok = await deleteMediaFileApi(filename);
      if (ok) {
        showToast(`تصویر «${filename}» از حافظه سیستم حذف شد.`);
        setMediaList(prev => prev.filter(m => m.filename !== filename));
      } else {
        showToast('خطا در حذف تصویر از سیستم.');
      }
    } catch (err: any) {
      showToast(`خطا: ${err.message}`);
    }
  };

  // Run on mount
  useEffect(() => {
    loadLiveData();
  }, [loadLiveData]);

  // Handle saving new dynamic API configuration (URL & Key)
  const handleSaveApiConfig = () => {
    setApiBaseUrl(customApiUrl);
    setApiKey(customApiKey);
    showToast('آدرس پایه و کلید API ذخیره شد. در حال اتصال مجدد...');
    setShowConfigDrawer(false);
    loadLiveData();
  };

  const handleResetApiConfig = () => {
    resetApiConfig();
    const defUrl = getApiBaseUrl();
    const defKey = getApiKey();
    setCustomApiUrl(defUrl);
    setCustomApiKey(defKey);
    showToast('تنظیمات API به حالت پیش‌فرض بازگشت.');
    setShowConfigDrawer(false);
    loadLiveData();
  };

  const handleApplyPresetUrl = (url: string) => {
    setCustomApiUrl(url);
  };

  // 1. Action: Create Article using createArticleFromPanel
  const handleCreateArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fastArtTitle.trim()) {
      showToast('لطفاً عنوان مقاله را وارد کنید.');
      return;
    }

    setIsSubmittingArticle(true);
    try {
      const created = await createArticleFromPanel({
        title: fastArtTitle.trim(),
        category: fastArtCategory,
        readTime: fastArtReadTime,
        summary: fastArtSummary.trim() || fastArtTitle.trim(),
        imageUrl: fastArtImageUrl.trim(),
        content: fastArtContent.trim() || fastArtTitle.trim()
      });

      if (created) {
        showToast(`مقاله «${created.title || fastArtTitle}» مستقیماً از طریق API در وب‌سایت ذخیره شد.`);
        if (onAddArticle) onAddArticle(created);
        setShowFastArticleModal(false);
        setFastArtTitle('');
        setFastArtSummary('');
        setFastArtContent('');
        setFastArtImageUrl('');
        // Reload live list directly from API
        const updatedList = await getArticles();
        setArticlesList(updatedList);
      }
    } catch (err: any) {
      showToast(`خطا در ثبت مقاله از طریق API: ${err.message || 'خطای سرور'}`);
    } finally {
      setIsSubmittingArticle(false);
    }
  };

  // 2. Action: Delete Article
  const handleDeleteArticle = async (id: string, title: string) => {
    if (!window.confirm(`آیا از حذف مقاله «${title}» از پایگاه داده سایت اطمینان دارید؟`)) return;

    try {
      const ok = await deleteArticleApi(id);
      if (ok) {
        showToast(`مقاله «${title}» از وب‌سایت حذف شد.`);
        setArticlesList(prev => prev.filter(a => a.id !== id));
      } else {
        showToast('خطا در حذف مقاله.');
      }
    } catch (err: any) {
      showToast(`خطای ارتباط با API: ${err.message}`);
    }
  };

  // 3. Action: Confirm Appointment via confirmAppointment
  const handleConfirmAppointmentSubmit = async () => {
    if (!selectedAppForConfirm) return;

    setIsConfirmingApp(true);
    try {
      await confirmAppointment(selectedAppForConfirm.id, confirmNotes);
      showToast(`نوبت «${selectedAppForConfirm.patientName}» تایید و یادداشت در سایت ثبت شد.`);
      if (onUpdateAppointmentStatus) {
        onUpdateAppointmentStatus(selectedAppForConfirm.id, 'confirmed');
      }
      setSelectedAppForConfirm(null);
      // Reload live appointments
      const updated = await getAppointments();
      setAppointmentsList(updated);
    } catch (err: any) {
      showToast(`خطا در تایید نوبت از طریق API: ${err.message}`);
    } finally {
      setIsConfirmingApp(false);
    }
  };

  // 4. Action: Change Appointment Status directly
  const handleDirectStatusChange = async (id: string, status: 'confirmed' | 'pending' | 'cancelled') => {
    try {
      const ok = await patchAppointmentStatus(id, status);
      if (ok) {
        showToast(`وضعیت نوبت در سایت به «${status === 'confirmed' ? 'تایید شده' : status === 'cancelled' ? 'لغو شده' : 'در انتظار'}» تغییر یافت.`);
        if (onUpdateAppointmentStatus) onUpdateAppointmentStatus(id, status);
        const updated = await getAppointments();
        setAppointmentsList(updated);
      }
    } catch (err: any) {
      showToast(`خطا در تغییر وضعیت: ${err.message}`);
    }
  };

  const handleDeleteAppointment = async (id: string, name: string) => {
    if (!window.confirm(`آیا نوبت «${name}» از وب‌سایت حذف شود؟`)) return;
    try {
      const ok = await deleteAppointmentApi(id);
      if (ok) {
        showToast(`نوبت «${name}» حذف گردید.`);
        setAppointmentsList(prev => prev.filter(a => a.id !== id));
      }
    } catch (err: any) {
      showToast(`خطا: ${err.message}`);
    }
  };

  // 5. Action: Fast Phone Update (updateClinicPhones)
  const handleFastPhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPhones(true);
    try {
      await updateClinicPhones(fastPhone1.trim(), fastPhone2.trim());
      showToast('شماره‌های تماس مطب مستقیماً در وب‌سایت به‌روزرسانی شد.');
      setShowFastPhoneModal(false);
      const updatedDoc = await getDoctorProfile();
      if (updatedDoc) setDoctor(updatedDoc);
    } catch (err: any) {
      showToast(`خطا در به‌روزرسانی تلفن‌ها: ${err.message}`);
    } finally {
      setIsSubmittingPhones(false);
    }
  };

  // 6. Action: Add Service
  const handleAddServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrvTitle.trim()) return;

    try {
      const created = await createServiceApi({
        title: newSrvTitle.trim(),
        category: newSrvCategory,
        description: newSrvDesc.trim(),
        imageUrl: newSrvImageUrl.trim(),
        iconName: 'Sparkles',
        estimatedTime: newSrvEstimatedTime.trim() || '۱ الی ۲ جلسه'
      });
      if (created) {
        showToast(`خدمت «${created.title}» همراه با تصویر در وب‌سایت ثبت شد.`);
        setShowAddServiceModal(false);
        setNewSrvTitle('');
        setNewSrvDesc('');
        setNewSrvImageUrl('');
        setNewSrvEstimatedTime('۱ الی ۲ جلسه');
        const updated = await getServicesApi();
        setServices(updated);
      }
    } catch (err: any) {
      showToast(`خطا: ${err.message}`);
    }
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (!window.confirm(`خدمت «${title}» حذف شود؟`)) return;
    try {
      await deleteServiceApi(id);
      showToast(`خدمت حذف شد.`);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      showToast(`خطا: ${err.message}`);
    }
  };

  // 7. API Tester execution
  const executeApiTest = async () => {
    setIsExecutingApiTest(true);
    const start = performance.now();

    try {
      const [method, path] = apiTesterEndpoint.split(' ');
      let res: any;

      if (method === 'GET') {
        res = await siteApi.get(path);
      } else if (method === 'POST' && path === '/articles') {
        res = await siteApi.post('/articles', {
          title: 'مقاله تستی از کاوشگر API',
          category: 'ایمپلنت دندان',
          readTimeMin: 4,
          summary: 'تست موفق ارسال داده از پنل'
        });
      } else if (method === 'POST' && path === '/appointments') {
        res = await siteApi.post('/appointments', {
          patientName: 'بیمار تستی API',
          phone: '09120000000',
          service: 'مشاوره ایمپلنت دیجیتال'
        });
      } else if (method === 'PUT' && path === '/doctor') {
        res = await siteApi.put('/doctor', {
          phone: '021-22589000',
          mobile: '0912-1112233'
        });
      } else {
        res = await siteApi.get(path || '/health');
      }

      const elapsed = Math.round(performance.now() - start);
      setApiTesterTime(elapsed);
      setApiTesterStatus(`${res.status} ${res.statusText}`);
      setApiTesterResponse(JSON.stringify(res.data, null, 2));
      showToast(`پاسخ وب‌سرویس دریافت شد (${toPersianDigits(elapsed)} میلی‌ثانیه)`);
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - start);
      setApiTesterTime(elapsed);
      setApiTesterStatus(err.response ? `HTTP ${err.response.status}` : 'Connection Failed');
      setApiTesterResponse(
        JSON.stringify(err.response?.data || { error: err.message, note: 'ارتباط برقرار نشد.' }, null, 2)
      );
      showToast('خطا در اجرای درخواست وب‌سرویس.');
    } finally {
      setIsExecutingApiTest(false);
    }
  };

  // Filtered lists
  const filteredArticles = articlesList.filter(a => {
    const matchesSearch = !articleSearch.trim() || 
      a.title?.toLowerCase().includes(articleSearch.toLowerCase()) ||
      a.category?.toLowerCase().includes(articleSearch.toLowerCase());
    const matchesCategory = articleCategoryFilter === 'all' || a.category === articleCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredAppointments = appointmentsList.filter(a => {
    if (appointmentFilter === 'all') return true;
    return a.status === appointmentFilter;
  });

  const pendingAppointmentsCount = appointmentsList.filter(a => a.status === 'pending').length;

  return (
    <div className="space-y-6 text-slate-800" dir="rtl">
      
      {/* ======================================================== */}
      {/* 1. TOP HEADER & CONNECTION STATUS BAR */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shadow-inner">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">اتصال زنده به وب‌سایت اصلی دکتر شهیدی پیام</h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  RESTful JSON API
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                تبادل مستقیم اطلاعات بدون دیتای فیک، با پورت و آدرس دینامیک
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live Connection Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium ${
              connectionStatus === 'connected'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : connectionStatus === 'checking'
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}>
              <div className={`w-2.5 h-2.5 rounded-full ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-500 animate-pulse'
                  : connectionStatus === 'checking'
                  ? 'bg-amber-500 animate-bounce'
                  : 'bg-rose-500'
              }`} />
              <span>
                {connectionStatus === 'connected'
                  ? `متصل به API (${toPersianDigits(pingLatency || 0)}ms)`
                  : connectionStatus === 'checking'
                  ? 'در حال برقراری ارتباط...'
                  : 'قطع ارتباط با سرور'}
              </span>
            </div>

            {/* Current Target URL Pill */}
            <button
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-mono transition-colors"
              title="برای تغییر پورت یا آدرس سرور کلیک کنید"
            >
              <Server className="w-3.5 h-3.5 text-slate-500" />
              <span className="dir-ltr">{customApiUrl}</span>
              <Settings2 className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Refresh Button */}
            <button
              onClick={loadLiveData}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>همگام‌سازی زنده</span>
            </button>
          </div>
        </div>

        {/* CONNECTION ERROR BANNER (When API is unreachable) */}
        {connectionStatus === 'error' && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-900">ارتباط با وب‌سرویس برقرار نشد</h4>
                <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                  آدرس فعلی <span className="font-mono font-bold dir-ltr">{customApiUrl}</span> پاسخی نداد ({connectionError}). 
                  طبق دستور، هیچ دیتای فیک یا نمایشی در این بخش لود نمی‌شود. مطمئن شوید سرور وب‌سایت در حال اجراست و پورت مورد نظر درست تنظیم شده باشد.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowConfigDrawer(true)}
                className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-800 text-xs font-medium hover:bg-rose-100 transition-colors"
              >
                تغییر پورت و آدرس
              </button>
              <button
                onClick={loadLiveData}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-medium hover:bg-rose-700 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>تلاش مجدد</span>
              </button>
            </div>
          </div>
        )}

        {/* DYNAMIC PORT & URL SETTINGS DRAWER (Collapsible) */}
        {showConfigDrawer && (
          <div className="mt-4 pt-4 border-t border-slate-200 bg-slate-50/70 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-800">تنظیمات پورت و آدرس دینامیک API</h3>
              </div>
              <span className="text-xs text-slate-500">ذخیره در تنظیمات مرورگر (Local Storage)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  آدرس پایه وب‌سرویس (Base URL):
                </label>
                <input
                  type="text"
                  value={customApiUrl}
                  onChange={(e) => setCustomApiUrl(e.target.value)}
                  placeholder="مثال: http://localhost:8088/api یا /api"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-teal-500 dir-ltr text-left"
                />
                {/* Presets */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-500">پیش‌فرض‌ها:</span>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetUrl('http://localhost:8088/api')}
                    className="text-[11px] px-2 py-0.5 rounded bg-white border border-slate-200 hover:border-teal-400 text-slate-700 font-mono"
                  >
                    پورت 8088
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetUrl('http://localhost:3000/api')}
                    className="text-[11px] px-2 py-0.5 rounded bg-white border border-slate-200 hover:border-teal-400 text-slate-700 font-mono"
                  >
                    پورت 3000
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetUrl('/api')}
                    className="text-[11px] px-2 py-0.5 rounded bg-white border border-slate-200 hover:border-teal-400 text-slate-700 font-mono"
                  >
                    دامنه جاری (/api)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetUrl('https://api.drshahidi.ir/api')}
                    className="text-[11px] px-2 py-0.5 rounded bg-white border border-slate-200 hover:border-teal-400 text-slate-700 font-mono"
                  >
                    ساب‌دامین رسمی
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  کلید دسترسی امن (x-api-key):
                </label>
                <input
                  type="text"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="dr-shahidi-key-2026"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-teal-500 dir-ltr text-left"
                />
                <p className="text-[11px] text-slate-500 mt-1.5">
                  ارسال خودکار در هدر <span className="font-mono font-bold text-slate-700">x-api-key</span> و هدر <span className="font-mono font-bold text-slate-700">Authorization: Bearer</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={handleResetApiConfig}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-medium"
              >
                بازنشانی به پیش‌فرض
              </button>
              <button
                type="button"
                onClick={handleSaveApiConfig}
                className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>ذخیره و اتصال مجدد</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. THREE KEY QUICK-ACTION CARDS (User Explicit Requests) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Action 1: createArticleFromPanel */}
        <div className="bg-white border border-slate-200 hover:border-teal-300 p-4 rounded-2xl shadow-sm transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-700">
                POST /articles
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-3">۱. ارسال سریع مقاله به وب‌سایت</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              انتشار مستقیم مقاله در سایت با متد <span className="font-mono text-teal-700 font-semibold">createArticleFromPanel</span> شامل عکس، زمان مطالعه و دسته‌بندی.
            </p>
          </div>
          <button
            onClick={() => setShowFastArticleModal(true)}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>نوشتن و انتشار مقاله در سایت</span>
          </button>
        </div>

        {/* Action 2: getPendingAppointments & confirmAppointment */}
        <div className="bg-white border border-slate-200 hover:border-indigo-300 p-4 rounded-2xl shadow-sm transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                PATCH /appointments
              </span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <h3 className="text-sm font-bold text-slate-900">۲. کارتابل نوبت‌های در انتظار</h3>
              {pendingAppointmentsCount > 0 ? (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                  {toPersianDigits(pendingAppointmentsCount)} جدید
                </span>
              ) : (
                <span className="text-xs text-slate-400">بدون نوبت باز</span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              مشاهده نوبت‌های در انتظار با <span className="font-mono text-indigo-700 font-semibold">getPendingAppointments</span> و تایید فوری با یادداشت مطب.
            </p>
          </div>
          <button
            onClick={() => {
              setActiveSubTab('appointments');
              setAppointmentFilter('pending');
            }}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span>بررسی نوبت‌های در انتظار ({toPersianDigits(pendingAppointmentsCount)})</span>
          </button>
        </div>

        {/* Action 3: updateClinicPhones */}
        <div className="bg-white border border-slate-200 hover:border-sky-300 p-4 rounded-2xl shadow-sm transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700">
                PUT /doctor
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-3">۳. ویرایش سریع تلفن‌های مطب</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              تغییر بلادرنگ شماره ثابت و همراه منشی در هدر و فوتر سایت با متد <span className="font-mono text-sky-700 font-semibold">updateClinicPhones</span>.
            </p>
          </div>
          <button
            onClick={() => setShowFastPhoneModal(true)}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>تغییر شماره‌های تماس وب‌سایت</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. NAVIGATION SUB-TABS */}
      {/* ======================================================== */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('articles')}
          className={`px-4 py-2 text-sm font-bold rounded-t-xl transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeSubTab === 'articles'
              ? 'border-teal-600 text-teal-700 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>مقالات و آموزش‌ها</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
            {toPersianDigits(articlesList.length)}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('appointments')}
          className={`px-4 py-2 text-sm font-bold rounded-t-xl transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeSubTab === 'appointments'
              ? 'border-indigo-600 text-indigo-700 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>نوبت‌های آنلاین وب‌سایت</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
            pendingAppointmentsCount > 0 ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-slate-100 text-slate-700'
          }`}>
            {toPersianDigits(appointmentsList.length)}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('doctor_profile')}
          className={`px-4 py-2 text-sm font-bold rounded-t-xl transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeSubTab === 'doctor_profile'
              ? 'border-sky-600 text-sky-700 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>مشخصات، تلفن‌ها و ساعات مطب</span>
        </button>

        <button
          onClick={() => setActiveSubTab('services')}
          className={`px-4 py-2 text-sm font-bold rounded-t-xl transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeSubTab === 'services'
              ? 'border-emerald-600 text-emerald-700 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>خدمات و تعرفه‌های جراحی</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
            {toPersianDigits(services.length)}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('media')}
          className={`px-4 py-2 text-sm font-bold rounded-t-xl transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeSubTab === 'media'
              ? 'border-teal-600 text-teal-700 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <HardDrive className="w-4 h-4 text-teal-600" />
          <span>حافظه تصاویر ({mediaConfig?.currentPath || customStoragePath})</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
            {toPersianDigits(mediaList.length)}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('api_docs')}
          className={`px-4 py-2 text-sm font-bold rounded-t-xl transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeSubTab === 'api_docs'
              ? 'border-slate-800 text-slate-900 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>مستندات API، کدهای آماده و تست زنده</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 4. SUB-TAB CONTENT PANELS */}
      {/* ======================================================== */}

      {/* -------------------------------------------------------- */}
      {/* PANEL 1: ARTICLES (مقالات وب‌سایت) */}
      {/* -------------------------------------------------------- */}
      {activeSubTab === 'articles' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  placeholder="جستجو در عناوین یا دسته‌بندی مقالات..."
                  className="w-full pl-3 pr-9 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <select
                value={articleCategoryFilter}
                onChange={(e) => setArticleCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-500"
              >
                <option value="all">همه دسته‌ها</option>
                <option value="ایمپلنت دندان">ایمپلنت دندان</option>
                <option value="جراحی فک">جراحی فک</option>
                <option value="ارتودنسی">ارتودنسی</option>
                <option value="جراحی دندان عقل">جراحی دندان عقل</option>
              </select>
            </div>

            <button
              onClick={() => setShowFastArticleModal(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن مقاله جدید به سایت</span>
            </button>
          </div>

          {/* Real Live Articles Table / Cards */}
          {filteredArticles.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">هیچ مقاله‌ای در پایگاه داده وب‌سایت یافت نشد</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                تمام داده‌های این بخش منحصراً از اتصال مستقیم API در آدرس <span className="font-mono dir-ltr">{customApiUrl}</span> دریافت می‌شوند.
              </p>
              <button
                onClick={() => setShowFastArticleModal(true)}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>ارسال اولین مقاله به وب‌سایت</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {article.featuredImage && (
                      <div className="w-full h-36 rounded-xl overflow-hidden mb-3 bg-slate-100">
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-medium">
                        {article.category}
                      </span>
                      <span>{article.readTime || `${article.readTimeMin || 5} دقیقه مطالعه`}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                      {article.title}
                    </h4>

                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {article.summary || article.excerpt || 'بدون خلاصه'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>بازدید: {toPersianDigits(article.views || 0)}</span>
                      {article.seoScore && (
                        <span className="text-emerald-700 font-semibold font-mono">
                          SEO: {article.seoScore}%
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteArticle(article.id, article.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="حذف مقاله از وب‌سایت"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* PANEL 2: APPOINTMENTS (نوبت‌های آنلاین وب‌سایت) */}
      {/* -------------------------------------------------------- */}
      {activeSubTab === 'appointments' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-semibold text-slate-500">فیلتر وضعیت:</span>
              <button
                onClick={() => setAppointmentFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-colors ${
                  appointmentFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                همه ({toPersianDigits(appointmentsList.length)})
              </button>
              <button
                onClick={() => setAppointmentFilter('pending')}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5 ${
                  appointmentFilter === 'pending'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <span>در انتظار تایید</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/30 text-[10px] font-mono">
                  {toPersianDigits(pendingAppointmentsCount)}
                </span>
              </button>
              <button
                onClick={() => setAppointmentFilter('confirmed')}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-colors ${
                  appointmentFilter === 'confirmed'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                تایید شده ({toPersianDigits(appointmentsList.filter(a => a.status === 'confirmed').length)})
              </button>
              <button
                onClick={() => setAppointmentFilter('cancelled')}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-colors ${
                  appointmentFilter === 'cancelled'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                }`}
              >
                لغو شده ({toPersianDigits(appointmentsList.filter(a => a.status === 'cancelled').length)})
              </button>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              GET /api/appointments
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">هیچ نوبتی با این وضعیت ثبت نشده است</h3>
              <p className="text-xs text-slate-500 mt-1">
                اطلاعات نوبت‌ها مستقیماً از فرم رزرو وب‌سایت اصلی در پایگاه داده ثبت می‌شود.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((app) => (
                <div
                  key={app.id}
                  className={`bg-white border rounded-2xl p-4 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    app.status === 'pending'
                      ? 'border-amber-300 bg-amber-50/30'
                      : app.status === 'confirmed'
                      ? 'border-emerald-200'
                      : 'border-slate-200 opacity-75'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      app.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : app.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <User className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{app.patientName}</h4>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          app.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : app.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {app.status === 'pending' ? 'در انتظار تایید منشی' : app.status === 'confirmed' ? 'تایید نهایی شده' : 'لغو شده'}
                        </span>
                        {app.trackingCode && (
                          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {app.trackingCode}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1.5">
                        <span className="flex items-center gap-1 font-mono text-slate-700">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span className="dir-ltr">{app.phone}</span>
                        </span>
                        <span className="text-slate-600 font-medium">خدمت: {app.service}</span>
                        <span>تاریخ درخواستی: {app.requestedDate} ({app.timeSlot || 'عصر'})</span>
                      </div>

                      {(app.notes || app.adminNotes) && (
                        <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-200 inline-block">
                          <span className="font-semibold text-slate-700">یادداشت: </span>
                          {app.adminNotes || app.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions for this appointment */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {app.status === 'pending' && (
                      <button
                        onClick={() => {
                          setSelectedAppForConfirm(app);
                          setConfirmNotes('هماهنگی تلفنی با بیمار انجام شد و زمان قطعی گردید.');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>تایید نوبت (confirmAppointment)</span>
                      </button>
                    )}

                    {app.status !== 'confirmed' && (
                      <button
                        onClick={() => handleDirectStatusChange(app.id, 'confirmed')}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 text-xs font-medium"
                        title="تایید مستقیم"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}

                    {app.status !== 'cancelled' && (
                      <button
                        onClick={() => handleDirectStatusChange(app.id, 'cancelled')}
                        className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 text-xs font-medium"
                        title="علامت‌گذاری به عنوان لغو شده"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteAppointment(app.id, app.patientName)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                      title="حذف نوبت"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* PANEL 3: DOCTOR PROFILE & CLINIC HOURS */}
      {/* -------------------------------------------------------- */}
      {activeSubTab === 'doctor_profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doctor info */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <User className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">مشخصات پزشک و شماره‌های مطب</h3>
              </div>
              <button
                onClick={() => setShowFastPhoneModal(true)}
                className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 text-xs font-semibold hover:bg-teal-100"
              >
                ویرایش تلفن‌ها
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <img
                  src={doctor?.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80"}
                  alt={doctor?.name || "دکتر شهیدی"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">{doctor?.name || "دکتر اکبر شهیدی پیام"}</h4>
                <p className="text-xs text-teal-700 font-medium">{doctor?.title || "متخصص جراحی دهان، فک و صورت"}</p>
                <p className="text-xs text-slate-400 mt-0.5">شماره نظام پزشکی: {doctor?.medicalLicenseNumber || "۷۲۵۱۸"}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  تلفن ثابت مطب:
                </span>
                <span className="font-mono font-bold text-slate-800 dir-ltr">{doctor?.phone || "021-22589000"}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  تلفن همراه و نوبت‌دهی:
                </span>
                <span className="font-mono font-bold text-slate-800 dir-ltr">{doctor?.mobile || "0912-1112233"}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block mb-1">آدرس کلینیک در وب‌سایت:</span>
                <span className="text-slate-800 font-medium leading-relaxed block">
                  {doctor?.address || "تهران، پاسداران، نبش بوستان پنجم، ساختمان پزشکان پارس، طبقه ۳"}
                </span>
              </div>
            </div>
          </div>

          {/* Clinic Hours */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">ساعات حضور و پذیرش مطب پاسداران</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">PUT /clinic-hours</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {clinicHours?.schedule ? (
                Object.entries(clinicHours.schedule).map(([day, time]) => (
                  <div key={day} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-700">{day}</span>
                    <span className="text-slate-600 font-mono">{String(time)}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 text-slate-500 text-center">
                  شنبه تا چهارشنبه: ۱۶:۰۰ الی ۲۰:۰۰ (پنج‌شنبه و جمعه تعطیل)
                </div>
              )}
            </div>

            {clinicHours?.notes && (
              <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
                {clinicHours.notes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* PANEL 4: SERVICES (خدمات جراحی) */}
      {/* -------------------------------------------------------- */}
      {activeSubTab === 'services' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">خدمات جراحی فک و ایمپلنت در وب‌سایت</h3>
              <p className="text-xs text-slate-500 mt-0.5">مدیریت لیست خدماتی که در منو و صفحه اول سایت نمایش داده می‌شوند</p>
            </div>
            <button
              onClick={() => setShowAddServiceModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن خدمت جدید</span>
            </button>
          </div>

          {services.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
              <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-xs text-slate-500">هیچ خدمتی ثبت نشده است.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((srv) => (
                <div key={srv.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    {srv.imageUrl && (
                      <div className="w-full h-36 rounded-xl overflow-hidden mb-3 bg-slate-100">
                        <img
                          src={srv.imageUrl}
                          alt={srv.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                        {srv.category}
                      </span>
                      <button
                        onClick={() => handleDeleteService(srv.id, srv.title)}
                        className="text-slate-400 hover:text-rose-600"
                        title="حذف خدمت"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-2">{srv.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-3">
                      {srv.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>جلسات: {srv.estimatedTime || '۱ الی ۲ جلسه'}</span>
                    {srv.imageUrl && (
                      <span className="text-[10px] text-teal-600 font-mono" dir="ltr">
                        {srv.imageUrl.split('/').pop()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* PANEL 5: MEDIA & FILE UPLOADS (/media/drshahidi) */}
      {/* -------------------------------------------------------- */}
      {activeSubTab === 'media' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-teal-800/40">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-400/30">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold">
                    حافظه ذخیره‌سازی تصاویر مطب ({mediaConfig?.currentPath || customStoragePath})
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  تمام تصاویری که در بخش <strong>خدمات جدید</strong> یا <strong>مقالات جدید</strong> یا مستقیماً در این پنل آپلود می‌کنید، در مسیر مشخص‌شده ذخیره شده و از طریق وب‌سایت در دسترس قرار می‌گیرند. اگر مسیر وجود نداشته باشد، به‌طور خودکار ساخته می‌شود.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                    mediaConfig?.writable !== false
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {mediaConfig?.writable !== false ? 'آماده ذخیره‌سازی و دسترسی نوشتن دیسک فعال است' : 'نیاز به بررسی دسترسی نوشتن'}
                  </span>
                  {mediaConfig?.created && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40">
                      <Sparkles className="w-3.5 h-3.5" />
                      پوشه جدید به‌صورت خودکار توسط سیستم ایجاد شد
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl shrink-0 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">تعداد فایل‌های ذخیره شده:</span>
                  <span className="text-teal-300 font-bold">{toPersianDigits(mediaList.length)} تصویر</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">مسیر فعال ذخیره:</span>
                  <span className="text-amber-300 font-bold select-all dir-ltr">{mediaConfig?.currentPath || customStoragePath}</span>
                </div>
                <button
                  type="button"
                  onClick={handleRefreshMedia}
                  disabled={isLoadingMedia}
                  className="w-full mt-1 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-sans font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMedia ? 'animate-spin' : ''}`} />
                  <span>به‌روزرسانی لیست و بررسی وضعیت</span>
                </button>
              </div>
            </div>
          </div>

          {/* STORAGE PATH CONFIGURATION & AUTO-CREATE CARD */}
          <div className="bg-white border-2 border-teal-500/30 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    تنظیم دستی مسیر ذخیره‌سازی و ساخت خودکار پوشه
                  </h4>
                  <p className="text-xs text-slate-500">
                    می‌توانید مسیر دلخواه خود را تایپ کنید؛ در صورت عدم وجود، پوشه به‌صورت خودکار (mkdir -p) ساخته می‌شود.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">مسیر پیش‌فرض سیستم:</span>
                <button
                  type="button"
                  onClick={() => {
                    setCustomStoragePath('/media/drshahidi');
                    handleSaveStoragePath('/media/drshahidi');
                  }}
                  disabled={isSavingStoragePath}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-800 font-mono text-[11px] font-semibold transition-colors dir-ltr"
                  title="بازنشانی به مسیر پیش‌فرض"
                  dir="ltr"
                >
                  /media/drshahidi
                </button>
              </div>
            </div>

            {/* Path Input Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  آدرس پوشه مورد نظر در حافظه سیستم (دایرکتوری مقصد):
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <Folder className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customStoragePath}
                      onChange={(e) => setCustomStoragePath(e.target.value)}
                      placeholder="/media/drshahidi یا ./media/drshahidi یا /var/www/uploads"
                      className="w-full pr-10 pl-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500 bg-slate-50/60 focus:bg-white text-left dir-ltr"
                      dir="ltr"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveStoragePath()}
                    disabled={isSavingStoragePath}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shrink-0 shadow-xs cursor-pointer"
                  >
                    {isSavingStoragePath ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>در حال بررسی و ساخت خودکار پوشه...</span>
                      </>
                    ) : (
                      <>
                        <FolderPlus className="w-4 h-4" />
                        <span>ذخیره مسیر و ایجاد خودکار پوشه</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-slate-400 font-medium text-[11px]">پیشنهادهای سریع:</span>
                {[
                  { tag: 'پیش‌فرض', path: '/media/drshahidi' },
                  { tag: 'پوشه محلی پروژه', path: './media/drshahidi' },
                  { tag: 'پوشه عکس‌ها', path: '/media/clinic_photos' },
                  { tag: 'پوشه var', path: '/var/media/drshahidi' }
                ].map((preset) => (
                  <button
                    key={preset.path}
                    type="button"
                    onClick={() => {
                      setCustomStoragePath(preset.path);
                      handleSaveStoragePath(preset.path);
                    }}
                    disabled={isSavingStoragePath}
                    className={`px-2.5 py-1 rounded-xl text-[11px] border transition-all flex items-center gap-1.5 cursor-pointer ${
                      (mediaConfig?.currentPath || customStoragePath) === preset.path
                        ? 'bg-teal-50 text-teal-800 border-teal-300 font-bold'
                        : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <code className="font-mono dir-ltr" dir="ltr">{preset.path}</code>
                    <span className="text-[10px] text-slate-500 font-sans">({preset.tag})</span>
                  </button>
                ))}
              </div>

              {/* Status & Feedback message */}
              {storagePathMessage && (
                <div
                  className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${
                    storagePathMessage.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}
                >
                  {storagePathMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span className="font-medium leading-relaxed">{storagePathMessage.text}</span>
                </div>
              )}
            </div>
          </div>

          {/* Direct Upload Section */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">آپلود سریع تصویر جدید به حافظه سیستم</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  عکس انتخابی مستقیماً در مسیر <code className="font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded dir-ltr">{mediaConfig?.currentPath || customStoragePath}</code> ذخیره می‌شود (اگر پوشه نباشد خودکار ساخته می‌شود).
                </p>
              </div>
            </div>

            <ImageUploader
              label="فایل تصویر برای آپلود مستقیم"
              value=""
              storagePath={mediaConfig?.currentPath || customStoragePath}
              onChange={async (uploadedUrl) => {
                if (uploadedUrl) {
                  showToast(`تصویر با موفقیت در «${mediaConfig?.currentPath || customStoragePath}» ذخیره شد: ${uploadedUrl}`);
                  const files = await getMediaFilesApi();
                  setMediaList(files);
                }
              }}
              description={`عکس بلافاصله روی دیسک سیستم در پوشه ${mediaConfig?.currentPath || customStoragePath} ذخیره شده و در سایت متصل می‌گردد.`}
            />
          </div>

          {/* Media Files Gallery */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-teal-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  فهرست تصاویر ذخیره‌شده ({toPersianDigits(mediaList.length)})
                </h4>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="جستجو بر اساس نام فایل..."
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  className="w-full pr-9 pl-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-500 font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            {mediaList.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <HardDrive className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">هنوز تصویری در مسیر /media/drshahidi ذخیره نشده است.</p>
                <p className="text-[11px] text-slate-400">با استفاده از فرم آپلود بالا یا هنگام افزودن خدمات و مقالات، اولین تصویر خود را ذخیره کنید.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaList
                  .filter(m => !mediaSearch.trim() || m.filename.toLowerCase().includes(mediaSearch.toLowerCase()))
                  .map((file) => {
                    const formattedSize = file.size > 1024 * 1024
                      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                      : `${Math.round(file.size / 1024)} KB`;

                    return (
                      <div
                        key={file.filename}
                        className="bg-slate-50 border border-slate-200 hover:border-teal-400 rounded-2xl p-3 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 mb-2 border border-slate-200 relative group">
                            <img
                              src={file.url}
                              alt={file.filename}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noreferrer"
                              className="absolute top-1.5 left-1.5 p-1 rounded-md bg-black/60 text-white hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="مشاهده اندازه کامل"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>

                          <p className="text-xs font-mono font-medium text-slate-800 truncate" title={file.filename} dir="ltr">
                            {file.filename}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                            <span>{formattedSize}</span>
                            <span>{new Date(file.createdAt).toLocaleDateString('fa-IR')}</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(file.url);
                              showToast(`آدرس نسبی کپی شد: ${file.url}`);
                            }}
                            className="text-[11px] px-2 py-1 rounded-lg bg-white border border-slate-200 hover:border-teal-400 text-slate-700 font-medium flex items-center gap-1 shadow-2xs transition-colors"
                            title="کپی آدرس نسبی (/media/drshahidi/...)"
                          >
                            <Copy className="w-3 h-3 text-teal-600" />
                            <span>کپی لینک</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteMedia(file.filename)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="حذف از دیسک"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Integration Guide for External Site */}
          <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 shadow-sm border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-teal-400">
              <Code className="w-5 h-5" />
              <h4 className="text-sm font-bold text-white">راهنمای نحوه اتصال و استفاده از تصاویر در وب‌سایت اصلی</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-300">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-teal-300 block">۱. اگر فرانت‌اند روی همین سرور ران است:</span>
                <p>نیازی به هیچ تغییری ندارید؛ تصویر مستقیماً از مسیر زیر در تگ HTML قابل فراخوانی است:</p>
                <code className="block bg-slate-900 p-2 rounded-lg font-mono text-amber-300 dir-ltr text-left">
                  {`<img src="/media/drshahidi/example.jpg" alt="خدمت" />`}
                </code>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-teal-300 block">۲. اگر وب‌سایت از سرور یا پورت دیگری اجرا می‌شود:</span>
                <p>آدرس کامل سرور را در ابتدای مسیر قرار دهید:</p>
                <code className="block bg-slate-900 p-2 rounded-lg font-mono text-emerald-300 dir-ltr text-left">
                  {`<img src="${customApiUrl.replace('/api', '')}/media/drshahidi/example.jpg" />`}
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* PANEL 5: API DOCUMENTATION & LIVE EXPLORER */}
      {/* -------------------------------------------------------- */}
      {activeSubTab === 'api_docs' && (
        <div className="space-y-6">
          {/* Dynamic Port Explanation Card */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-teal-400" />
                  <h3 className="text-base font-bold">چرا پورت و آدرس در این سیستم کاملاً دینامیک است؟</h3>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-2xl">
                  در بک‌اند سایت، پورت مستقیماً از متغیر محیطی <code className="bg-slate-800 px-1.5 py-0.5 rounded text-teal-300 font-mono">PORT</code> خوانده می‌شود:
                  <br />
                  <code className="bg-slate-800/80 px-2 py-1 rounded text-amber-300 font-mono inline-block my-1.5">
                    const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
                  </code>
                  <br />
                  بنابراین اگر پورت ۳۰۰۰ اشغال باشد یا بخواهید سایت را روی پورت ۸۰۸۸ ران کنید، به راحتی با <code className="font-mono text-teal-300">PORT=8088 npm run dev</code> سرور بدون هیچ تغییری در کد بالا می‌آید.
                </p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl shrink-0 text-xs font-mono space-y-2">
                <div>
                  <span className="text-slate-400">آدرس فعال فعلی: </span>
                  <span className="text-emerald-400">{customApiUrl}</span>
                </div>
                <div>
                  <span className="text-slate-400">کلید هدر: </span>
                  <span className="text-amber-400">x-api-key: {customApiKey}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ready-to-use Code Snippets (User's Exact Requested Samples) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">کدهای نمونه آماده (Copy & Paste)</h3>
                <p className="text-xs text-slate-500 mt-0.5">۳ تابع اصلی درخواست شده برای تعامل پنل با وب‌سایت</p>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setCodeSnippetLang('axios')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    codeSnippetLang === 'axios' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Axios (جاوااسکریپت)
                </button>
                <button
                  onClick={() => setCodeSnippetLang('curl')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    codeSnippetLang === 'curl' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  cURL
                </button>
                <button
                  onClick={() => setCodeSnippetLang('python')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    codeSnippetLang === 'python' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  پایتون
                </button>
                <button
                  onClick={() => setCodeSnippetLang('php')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    codeSnippetLang === 'php' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  PHP
                </button>
              </div>
            </div>

            <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto dir-ltr text-left">
              {codeSnippetLang === 'axios' && (
                <pre>{`// ۱) افزودن مقاله جدید از فرم پنل:
export async function createArticleFromPanel(formData) {
  const res = await siteApi.post('/articles', {
    title: formData.title,
    category: formData.category || 'ایمپلنت دندان',
    readTime: formData.readTime || '۵ دقیقه مطالعه',
    summary: formData.summary,
    heroImage: formData.imageUrl,
    sections: [
      {
        title: 'مقدمه و توضیحات',
        paragraphs: [formData.content]
      }
    ]
  });
  return res.data;
}

// ۲) مشاهده نوبت‌های در انتظار تایید و تایید آن‌ها:
export async function getPendingAppointments() {
  const res = await siteApi.get('/appointments?status=pending');
  return res.data.data;
}

export async function confirmAppointment(appointmentId, notes) {
  const res = await siteApi.patch(\`/appointments/\${appointmentId}\`, {
    status: 'confirmed',
    adminNotes: notes || 'هماهنگی تلفنی با بیمار انجام شد.'
  });
  return res.data;
}

// ۳) تغییر شماره تماس یا مشخصات مطب از پنل:
export async function updateClinicPhones(phone1, phone2) {
  const res = await siteApi.put('/doctor', {
    phone: phone1,
    mobile: phone2
  });
  return res.data;
}`}</pre>
              )}

              {codeSnippetLang === 'curl' && (
                <pre>{`# 1. تست سلامت و پینگ سرور:
curl -X GET "${customApiUrl}/health"

# 2. ثبت مقاله جدید:
curl -X POST "${customApiUrl}/articles" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${customApiKey}" \\
  -d '{"title":"جراحی ایمپلنت یک‌روزه","category":"ایمپلنت دندان","summary":"توضیحات کوتاه"}'

# 3. تایید نوبت بیمار:
curl -X PATCH "${customApiUrl}/appointments/app-1" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${customApiKey}" \\
  -d '{"status":"confirmed","adminNotes":"تایید تلفنی شد"}'`}</pre>
              )}

              {codeSnippetLang === 'python' && (
                <pre>{`import requests

BASE_URL = "${customApiUrl}"
HEADERS = {"x-api-key": "${customApiKey}", "Content-Type": "application/json"}

# 1. دریافت نوبت‌های در انتظار:
r = requests.get(f"{BASE_URL}/appointments?status=pending", headers=HEADERS)
print(r.json())

# 2. تایید نوبت:
r = requests.patch(f"{BASE_URL}/appointments/app-1", json={"status": "confirmed"}, headers=HEADERS)
print(r.json())`}</pre>
              )}

              {codeSnippetLang === 'php' && (
                <pre>{`<?php
$ch = curl_init("${customApiUrl}/articles");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "Content-Type: application/json",
  "x-api-key: ${customApiKey}"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>`}</pre>
              )}
            </div>
          </div>

          {/* Interactive Live API Tester */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">کاوشگر و تست‌کننده زنده اندپوینت‌ها (API Tester)</h3>
              </div>
              <span className="text-xs text-slate-400">اجرای درخواست واقعی روی آدرس {customApiUrl}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <select
                value={apiTesterEndpoint}
                onChange={(e) => setApiTesterEndpoint(e.target.value)}
                className="px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-800"
              >
                <option value="GET /health">GET /health (تست سلامت سرور و پینگ)</option>
                <option value="GET /articles">GET /articles (دریافت لیست مقالات سایت)</option>
                <option value="GET /appointments">GET /appointments (لیست نوبت‌های بیماران)</option>
                <option value="GET /appointments?status=pending">GET /appointments?status=pending (نوبت‌های در انتظار)</option>
                <option value="GET /doctor">GET /doctor (مشخصات و تلفن‌های مطب)</option>
                <option value="GET /clinic-hours">GET /clinic-hours (ساعات کاری مطب پاسداران)</option>
                <option value="GET /services">GET /services (لیست خدمات جراحی)</option>
                <option value="POST /articles">POST /articles (ثبت تستی یک مقاله)</option>
                <option value="POST /appointments">POST /appointments (ثبت تستی یک نوبت بیمار)</option>
              </select>

              <button
                onClick={executeApiTest}
                disabled={isExecutingApiTest}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50"
              >
                <Zap className={`w-4 h-4 text-amber-400 ${isExecutingApiTest ? 'animate-spin' : ''}`} />
                <span>ارسال درخواست و مشاهده پاسخ JSON</span>
              </button>
            </div>

            {apiTesterResponse && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">پاسخ دریافتی از سرور:</span>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-700 font-mono font-bold">{apiTesterStatus}</span>
                    <span className="text-slate-400 font-mono">{toPersianDigits(apiTesterTime)}ms</span>
                  </div>
                </div>
                <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-72 dir-ltr text-left">
                  <pre>{apiTesterResponse}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MODALS & DRAWERS */}
      {/* ======================================================== */}

      {/* MODAL 1: Fast Article Form (createArticleFromPanel) */}
      {showFastArticleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">ارسال مستقیم مقاله با متد createArticleFromPanel</h3>
              </div>
              <button
                onClick={() => setShowFastArticleModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateArticleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">عنوان مقاله (title):</label>
                <input
                  type="text"
                  required
                  value={fastArtTitle}
                  onChange={(e) => setFastArtTitle(e.target.value)}
                  placeholder="مثال: مراحل کاشت ایمپلنت دندان در یک جلسه"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">دسته‌بندی (category):</label>
                  <select
                    value={fastArtCategory}
                    onChange={(e) => setFastArtCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500"
                  >
                    <option value="ایمپلنت دندان">ایمپلنت دندان</option>
                    <option value="جراحی فک">جراحی فک</option>
                    <option value="جراحی دندان عقل">جراحی دندان عقل</option>
                    <option value="ارتودنسی و جراحی">ارتودنسی و جراحی</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">زمان مطالعه (readTime):</label>
                  <input
                    type="text"
                    value={fastArtReadTime}
                    onChange={(e) => setFastArtReadTime(e.target.value)}
                    placeholder="مثال: ۵ دقیقه مطالعه"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">خلاصه مقاله (summary):</label>
                <textarea
                  rows={2}
                  value={fastArtSummary}
                  onChange={(e) => setFastArtSummary(e.target.value)}
                  placeholder="خلاصه برای نمایش در کارت‌ها و سئو..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <ImageUploader
                  label="عکس شاخص مقاله (heroImage / ذخیره مستقیم در حافظه سیستم)"
                  value={fastArtImageUrl}
                  onChange={setFastArtImageUrl}
                  storagePath={mediaConfig?.currentPath || customStoragePath}
                  description={`فایل انتخابی مستقیماً در حافظه سیستم (${mediaConfig?.currentPath || customStoragePath}) ذخیره و به وب‌سایت متصل می‌شود (اگر پوشه نباشد خودکار ساخته می‌شود).`}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">متن و محتوای اصلی مقاله (content):</label>
                <textarea
                  rows={4}
                  value={fastArtContent}
                  onChange={(e) => setFastArtContent(e.target.value)}
                  placeholder="توضیحات کامل جهت قرارگیری در sections مقاله..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFastArticleModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingArticle}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-sm transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingArticle ? 'در حال ارسال به API...' : 'انتشار در سایت'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Fast Phone Update Form (updateClinicPhones) */}
      {showFastPhoneModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900">ویرایش تلفن‌های مطب (updateClinicPhones)</h3>
              </div>
              <button
                onClick={() => setShowFastPhoneModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFastPhoneSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">تلفن ثابت مطب پاسداران (phone1):</label>
                <input
                  type="text"
                  required
                  value={fastPhone1}
                  onChange={(e) => setFastPhone1(e.target.value)}
                  placeholder="021-22589000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500 font-mono dir-ltr text-left"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">شماره همراه و هماهنگی منشی (phone2):</label>
                <input
                  type="text"
                  required
                  value={fastPhone2}
                  onChange={(e) => setFastPhone2(e.target.value)}
                  placeholder="0912-1112233"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500 font-mono dir-ltr text-left"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFastPhoneModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPhones}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  {isSubmittingPhones ? 'در حال ثبت...' : 'ذخیره در وب‌سایت'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Confirm Appointment Notes (confirmAppointment) */}
      {selectedAppForConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">تایید نوبت و ثبت یادداشت مطب</h3>
              </div>
              <button
                onClick={() => setSelectedAppForConfirm(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2">
              <p className="text-slate-600">
                بیمار: <strong className="text-slate-900">{selectedAppForConfirm.patientName}</strong> ({selectedAppForConfirm.phone})
              </p>
              <p className="text-slate-600">
                خدمت: <strong className="text-slate-900">{selectedAppForConfirm.service}</strong>
              </p>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">یادداشت منشی برای پرونده سایت (adminNotes):</label>
                <textarea
                  rows={3}
                  value={confirmNotes}
                  onChange={(e) => setConfirmNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedAppForConfirm(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-medium"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleConfirmAppointmentSubmit}
                disabled={isConfirmingApp}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
                {isConfirmingApp ? 'در حال ثبت در سایت...' : 'تایید قطعی نوبت'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Add Service */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">افزودن خدمت جدید به سایت</h3>
              </div>
              <button
                onClick={() => setShowAddServiceModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddServiceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">نام خدمت:</label>
                <input
                  type="text"
                  required
                  value={newSrvTitle}
                  onChange={(e) => setNewSrvTitle(e.target.value)}
                  placeholder="مثال: بازسازی پیشرفته استخوان فک"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">دسته‌بندی:</label>
                <select
                  value={newSrvCategory}
                  onChange={(e) => setNewSrvCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="جراحی فک">جراحی فک</option>
                  <option value="ایمپلنت دندان">ایمپلنت دندان</option>
                  <option value="جراحی زیبایی فک و صورت">جراحی زیبایی فک و صورت</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">توضیحات مختصر خدمت:</label>
                <textarea
                  rows={3}
                  value={newSrvDesc}
                  onChange={(e) => setNewSrvDesc(e.target.value)}
                  placeholder="توضیح جهت نمایش در کارت خدمت وب‌سایت..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <ImageUploader
                  label="عکس اختصاصی خدمت (بارگذاری در حافظه سیستم)"
                  value={newSrvImageUrl}
                  onChange={setNewSrvImageUrl}
                  storagePath={mediaConfig?.currentPath || customStoragePath}
                  description={`عکس به طور مستقیم در حافظه سیستم (${mediaConfig?.currentPath || customStoragePath}) ذخیره و به وب‌سایت متصل می‌شود (اگر پوشه نباشد خودکار ساخته می‌شود).`}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">مدت زمان و تعداد جلسات تقریبی (estimatedTime):</label>
                <input
                  type="text"
                  value={newSrvEstimatedTime}
                  onChange={(e) => setNewSrvEstimatedTime(e.target.value)}
                  placeholder="مثال: ۱ الی ۲ جلسه"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition-colors"
                >
                  افزودن به سایت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
