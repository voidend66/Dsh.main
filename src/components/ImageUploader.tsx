import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Check, 
  Copy, 
  Trash2, 
  HardDrive, 
  FolderOpen, 
  Loader2, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { uploadImageApi, getMediaFilesApi, getMediaConfigApi, toPublicMediaUrl, UploadResponse } from '../services/apiClient';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  description?: string;
  required?: boolean;
  storagePath?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  description,
  required = false,
  storagePath
}) => {
  const [activeStoragePath, setActiveStoragePath] = useState<string>(storagePath || '/media/drshahidi');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState<boolean>(false);
  const [libraryFiles, setLibraryFiles] = useState<Array<{ filename: string; url: string; size: number; createdAt: string }>>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState<boolean>(false);
  const [showDirectUrlInput, setShowDirectUrlInput] = useState<boolean>(false);

  // If storagePath is not provided via prop, fetch active storage config
  React.useEffect(() => {
    if (storagePath) {
      setActiveStoragePath(storagePath);
    } else {
      getMediaConfigApi()
        .then((cfg) => {
          if (cfg && cfg.currentPath) {
            setActiveStoragePath(cfg.currentPath);
          }
        })
        .catch(() => {});
    }
  }, [storagePath]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileProcess = async (file: File) => {
    if (!file) return;

    // Check if image
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|svg|gif|avif|bmp|jfif|heic|heif|tiff|tif|ico|dcm)$/i.test(file.name) || !file.name.includes('.');
    if (!isImage) {
      setErrorMessage('فایل انتخابی یک تصویر معتبر نیست. لطفاً یک فایل عکس انتخاب کنید.');
      return;
    }

    // Check max size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('حجم فایل بیشتر از ۵۰ مگابایت است.');
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response: UploadResponse = await uploadImageApi(file, (percent) => {
        setUploadProgress(percent);
      });

      if (response && response.success && (response.fullUrl || response.url)) {
        const publicUrl = toPublicMediaUrl(response.fullUrl || response.url);
        onChange(publicUrl);
      } else {
        setErrorMessage(response?.message || 'خطا در آپلود عکس.');
      }
    } catch (err: any) {
      let msg = err.response?.data?.error || err.message || 'خطا در ارتباط با سرور آپلود';
      if (msg.includes('status code 400') || msg.includes('400')) {
        msg = 'خطا در دریافت یا پردازش فایل توسط سرور. لطفاً فایل عکس را مجدداً انتخاب و امتحان کنید.';
      }
      setErrorMessage(`خطا: ${msg}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleCopyUrl = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenLibrary = async () => {
    setShowMediaLibrary(true);
    setIsLoadingLibrary(true);
    try {
      const files = await getMediaFilesApi();
      setLibraryFiles(files);
    } catch (err) {
      console.error('Error fetching media files:', err);
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  const handleSelectFromLibrary = (url: string) => {
    onChange(toPublicMediaUrl(url));
    setShowMediaLibrary(false);
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <div className="flex items-center gap-2 text-[11px]">
          <button
            type="button"
            onClick={handleOpenLibrary}
            className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>آرشیو تصاویر</span>
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={() => setShowDirectUrlInput(prev => !prev)}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            {showDirectUrlInput ? 'مخفی کردن فیلد لینک' : 'درج دستی آدرس URL'}
          </button>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 flex items-center gap-1">
        <HardDrive className="w-3 h-3 text-teal-600 shrink-0" />
        <span>
          {description || `عکس در حافظه سیستم (${activeStoragePath}) ذخیره شده و لینک عمومی مستقیم برای وب‌سایت تولید می‌گردد.`}
        </span>
      </p>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.jpg,.jpeg,.png,.webp,.svg,.gif,.avif,.bmp,.jfif,.heic,.heif,.tiff,.tif,.ico,.dcm"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Dropzone / Preview Area */}
      {value ? (
        <div className="border border-teal-200 bg-teal-50/40 rounded-2xl p-3 flex flex-col sm:flex-row items-center gap-4 transition-all">
          {/* Image Thumbnail Preview */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-teal-300/50 shadow-xs group">
            <img
              src={value}
              alt="پیش‌نمایش تصویر"
              className="w-full h-full object-cover"
              onError={(e) => {
                // If relative url fails in local preview, try full host or fallback placeholder
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <div className="absolute top-1 right-1 bg-teal-600 text-white p-1 rounded-md shadow-xs">
              <Check className="w-3 h-3" />
            </div>
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-1 left-1 bg-black/60 hover:bg-black text-white p-1 rounded-md text-[10px] flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              title="مشاهده مستقیم تصویر در تب جدید"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Details & Controls */}
          <div className="flex-1 w-full space-y-2 text-right">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Check className="w-3 h-3 text-emerald-600" />
                لینک عمومی مستقیم و فعال
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <HardDrive className="w-3 h-3 text-teal-600" />
                {activeStoragePath}
              </span>
              <span className="text-[10px] font-mono text-slate-400 truncate max-w-[160px]" dir="ltr">
                {value.split('/').pop()}
              </span>
            </div>

            <div className="p-1.5 bg-white border border-teal-200 rounded-lg text-[11px] font-mono text-slate-800 flex items-center justify-between gap-2 shadow-2xs" dir="ltr">
              <span className="truncate select-all text-teal-900 font-medium">{value}</span>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 text-slate-400 hover:text-teal-600 rounded-md transition-colors"
                  title="باز کردن لینک عمومی"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-2 py-0.5 bg-teal-50 hover:bg-teal-100 text-teal-700 font-sans text-[11px] font-semibold rounded-md border border-teal-200 flex items-center gap-1 transition-colors cursor-pointer"
                  title="کپی لینک عمومی تصویر برای استفاده در سایت یا هر جای دیگر"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'کپی شد!' : 'کپی لینک مستقیم'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-teal-600" />
                <span>تغییر و آپلود عکس جدید</span>
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="px-2.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium flex items-center gap-1 transition-colors"
                title="حذف تصویر"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف</span>
              </button>

              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                title="مشاهده تصویر در تب جدید"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
            isDragOver 
              ? 'border-teal-500 bg-teal-50/60 scale-[1.01]' 
              : 'border-slate-300 hover:border-teal-400 bg-slate-50/70 hover:bg-teal-50/20'
          }`}
        >
          {isUploading ? (
            <div className="py-4 space-y-3 flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-800">
                  در حال بارگذاری و ذخیره در پوشه {activeStoragePath}...
                </p>
                <p className="text-[11px] text-slate-400">
                  {uploadProgress > 0 ? `${uploadProgress}٪ آپلود شد` : 'در حال ساخت پوشه در صورت نبودن و ثبت فایل روی دیسک...'}
                </p>
              </div>
              {uploadProgress > 0 && (
                <div className="w-48 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-1.5 rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="py-2 space-y-2 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  کلیک کنید یا عکس را اینجا بکشید و رها کنید (Drag & Drop)
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  فرمت‌های JPG, PNG, WEBP, SVG تا سقف ۳۰ مگابایت
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
                <HardDrive className="w-3 h-3" />
                <span>مسیر ذخیره: <code className="font-mono dir-ltr">{activeStoragePath}</code> (ساخت خودکار پوشه در صورت عدم وجود)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Optional Direct URL Input */}
      {showDirectUrlInput && (
        <div className="pt-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="یا آدرس مستقیم تصویر را وارد کنید: /media/drshahidi/example.jpg"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500 dir-ltr text-left font-mono"
          />
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-rose-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-2xl w-full max-h-[85vh] shadow-2xl border border-slate-200 flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-teal-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">آرشیو تصاویر در /media/drshahidi</h3>
                  <p className="text-[11px] text-slate-400">عکس‌های قبلاً بارگذاری شده در سیستم</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaLibrary(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[220px]">
              {isLoadingLibrary ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                  <span className="text-xs">در حال بارگذاری لیست تصاویر سرور...</span>
                </div>
              ) : libraryFiles.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <ImageIcon className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-xs">هنوز هیچ عکسی در مسیر /media/drshahidi بارگذاری نشده است.</p>
                  <p className="text-[11px] text-slate-400">با اولین آپلود، تصاویر در این بخش نمایش داده می‌شوند.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {libraryFiles.map((file) => (
                    <div
                      key={file.filename}
                      onClick={() => handleSelectFromLibrary(file.url)}
                      className={`group relative rounded-xl border p-2 cursor-pointer transition-all hover:shadow-md hover:border-teal-500 bg-slate-50 hover:bg-teal-50/20 ${
                        value === file.url ? 'border-teal-600 ring-2 ring-teal-500/20 bg-teal-50/40' : 'border-slate-200'
                      }`}
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-slate-900 mb-1.5 relative">
                        <img
                          src={file.url}
                          alt={file.filename}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                        {value === file.url && (
                          <div className="absolute top-1 right-1 bg-teal-600 text-white p-0.5 rounded-md">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-slate-700 truncate" dir="ltr">
                        {file.filename}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-400 text-[11px]">
                تعداد فایل‌ها: {libraryFiles.length} تصویر
              </span>
              <button
                type="button"
                onClick={() => setShowMediaLibrary(false)}
                className="px-4 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-medium"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
