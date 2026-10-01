import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  MapPin,
  Compass,
  Sparkles,
  BrainCircuit,
  X,
  Check,
  AlertCircle,
  Camera,
  Layers,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { ReportCategory, AnalysisRequestPayload, AnalysisResponseData } from '../types';
import { CategoryIcon } from '../components/CategoryIcon';
import { useLanguage } from '../context/LanguageContext';
import { submitReportForAnalysis, saveAnalyzedReport } from '../services/api';
import { useToast } from '../components/Toast';

interface Props {
  onStartAnalysis: (payload: AnalysisRequestPayload) => void;
}

export const ReportPage: React.FC<Props> = ({ onStartAnalysis }) => {
  const { t, formatCategory } = useLanguage();
  const { showToast } = useToast();

  const CATEGORIES: { id: ReportCategory; label: string; desc: string }[] = [
    { id: 'Waste', label: formatCategory('Waste'), desc: 'Overflowing dumpsters, illicit debris' },
    { id: 'Road Damage', label: formatCategory('Road Damage'), desc: 'Potholes, asphalt collapse' },
    { id: 'Water', label: formatCategory('Water'), desc: 'Main bursts, low pressure' },
    { id: 'Drainage', label: formatCategory('Drainage'), desc: 'Blocked culverts, flood risks' },
    { id: 'Energy', label: formatCategory('Energy'), desc: 'Broken street lamps, exposed wiring' },
    { id: 'Public Safety', label: formatCategory('Public Safety'), desc: 'Structural hazards, obstructions' },
    { id: 'Other', label: formatCategory('Other'), desc: 'General civic infrastructure issues' },
  ];

  const PRESET_SCENARIOS = [
    {
      title: t.reportPage.preset1Title,
      category: 'Waste' as ReportCategory,
      desc: t.reportPage.preset1Desc,
      locationLabel: 'Sector 4 Canal Access Lane, Colombo Pilot Community',
      lat: 6.9312,
      lng: 79.8645,
      imageUrl: 'https://images.unsplash.com/photo-1611288879855-ab06e7a2b97f?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: t.reportPage.preset2Title,
      category: 'Road Damage' as ReportCategory,
      desc: t.reportPage.preset2Desc,
      locationLabel: 'St. Anthony School Access Road Crosswalk, Colombo Pilot Community',
      lat: 6.9355,
      lng: 79.8682,
      imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: t.reportPage.preset3Title,
      category: 'Drainage' as ReportCategory,
      desc: t.reportPage.preset3Desc,
      locationLabel: 'Lowland Storm Basin, South Canal Intake, Colombo Pilot Community',
      lat: 6.9221,
      lng: 79.8633,
      imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: t.reportPage.preset4Title,
      category: 'Water' as ReportCategory,
      desc: t.reportPage.preset4Desc,
      locationLabel: 'Old Moor Street & Canal Link Road, Colombo Pilot Community',
      lat: 6.9284,
      lng: 79.8591,
      imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=900&q=80',
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>('Waste');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Location state
  const [locationLabel, setLocationLabel] = useState('Sector 4 Canal Access Lane, Colombo Pilot Community');
  const [latitude, setLatitude] = useState<number>(6.9312);
  const [longitude, setLongitude] = useState<number>(79.8645);
  const [geoLocating, setGeoLocating] = useState(false);
  const [geoSuccess, setGeoSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file) return;
    setErrorMessage(null);

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB limit. Please upload a smaller image.');
      return;
    }

    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFetchGeolocation = () => {
    setErrorMessage(null);
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser. Using pilot default coordinates.');
      return;
    }

    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocationLabel(`Current Geolocation (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        setGeoLocating(false);
        setGeoSuccess(true);
        showToast('success', 'Location found', 'Using your current GPS coordinates');
      },
      (err) => {
        console.warn('Geolocation failed or denied:', err);
        setGeoLocating(false);
        // Fallback to Colombo Pilot Community coordinates
        setLatitude(6.9271);
        setLongitude(79.8612);
        setLocationLabel('Colombo Pilot Community (Central Sector)');
        showToast('warning', 'Location unavailable', 'Using default pilot community coordinates');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const applyPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setErrorMessage(null);
    setSelectedCategory(preset.category);
    setDescription(preset.desc);
    setLocationLabel(preset.locationLabel);
    setLatitude(preset.lat);
    setLongitude(preset.lng);
    setImagePreview(preset.imageUrl);
    setImageBase64(null); // URL is used
    showToast('success', 'Preset applied', `${preset.title} loaded successfully`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: AnalysisRequestPayload = {
      imageBase64: imageBase64 || undefined,
      imageUrl: (!imageBase64 && imagePreview) ? imagePreview : undefined,
      mimeType,
      description: description || `Reported ${selectedCategory} hazard requiring municipal assessment.`,
      category: selectedCategory,
      locationLabel,
      latitude,
      longitude,
    };

    onStartAnalysis(payload);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-xs font-mono text-emerald-600 border border-emerald-200">
          <BrainCircuit className="w-4 h-4" />
          {t.nav.ai}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          {t.reportPage.heading}
        </h1>
        <p className="text-sm text-slate-500">
          {t.reportPage.subheading}
        </p>
      </div>

      {/* Quick Scenario Preset Selector */}
      <div className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-2xl sm:rounded-3xl glass-card space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5 sm:gap-2">
            <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
            </div>
            {t.reportPage.presetsTitle}
          </span>
          <span className="text-slate-500 text-[10px] sm:text-xs">{t.brand.syntheticDataNotice}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {PRESET_SCENARIOS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="p-3 sm:p-4 rounded-xl sm:rounded-2xl glass border border-slate-200/60 hover:border-emerald-300 text-left transition-all group cursor-pointer hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-500 transition-colors">
                <CategoryIcon category={preset.category} size={14} />
                <span className="truncate">{preset.title}</span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 truncate mt-1.5 sm:mt-2">
                {preset.locationLabel}
              </p>
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between gap-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-700 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Visual Evidence Upload */}
        <div className="p-8 rounded-3xl glass-card space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                <Camera className="w-4 h-4 text-emerald-500" />
              </div>
              {t.reportPage.step1Title}
            </label>
            <span className="text-xs text-slate-500">{t.reportPage.step1Desc}</span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
            }}
          />

          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/70 bg-white group">
              <img
                src={imagePreview}
                alt="Preview"
                referrerPolicy="no-referrer"
                className="w-full h-72 object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-white/90 text-slate-800 text-sm font-semibold border border-slate-200 shadow-sm hover:bg-white cursor-pointer transition-all"
                >
                  {t.reportPage.orUseCamera}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageBase64(null);
                  }}
                  className="p-2.5 rounded-xl bg-white/90 text-rose-500 border border-slate-200 hover:text-rose-600 shadow-sm cursor-pointer transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-sm text-xs font-mono text-emerald-600 border border-emerald-100 shadow-sm">
                Visual Evidence Attached
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-12 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-slate-50 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm">
                <UploadCloud className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-base font-semibold text-slate-800">
                {t.reportPage.uploadBoxTitle}
              </p>
              <p className="text-sm text-slate-500 mt-2">
                {t.reportPage.uploadBoxSubtitle}
              </p>
            </div>
          )}
        </div>

        {/* 2. Category Selector */}
        <div className="p-8 rounded-3xl glass-card space-y-5">
          <label className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
              <Layers className="w-4 h-4 text-emerald-500" />
            </div>
            {t.reportPage.step2Title}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-white border-emerald-400 text-emerald-600 shadow-sm'
                      : 'bg-slate-50/50 border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <CategoryIcon
                      category={cat.id}
                      size={20}
                      className={isSelected ? 'text-emerald-500' : 'text-slate-400'}
                    />
                    {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <div className="font-bold text-sm text-slate-800">{cat.label}</div>
                  <div className="text-xs text-slate-500 line-clamp-1 mt-1">
                    {cat.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Location Information */}
        <div className="p-8 rounded-3xl glass-card space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                <MapPin className="w-4 h-4 text-emerald-500" />
              </div>
              {t.reportPage.locationLabel}
            </label>
            <button
              type="button"
              onClick={handleFetchGeolocation}
              disabled={geoLocating}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-emerald-600 border border-slate-200 transition-all cursor-pointer shadow-sm"
            >
              <Compass className={`w-4 h-4 ${geoLocating ? 'animate-spin' : ''}`} />
              {geoLocating ? 'Acquiring GPS...' : geoSuccess ? t.reportPage.gpsActive : t.reportPage.detectGps}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-2">
                {t.reportPage.locationPlaceholder}
              </label>
              <input
                type="text"
                value={locationLabel}
                onChange={(e) => setLocationLabel(e.target.value)}
                placeholder="e.g. Sector 4 Green Corridor, Canal Walkway"
                required
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-400 focus:outline-none text-sm text-slate-800 placeholder-slate-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">
                Geotag Coordinates (WGS84)
              </label>
              <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-emerald-600 flex items-center justify-between">
                <span>{latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
                <span className="text-xs text-slate-400">PostGIS</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Description (Optional) */}
        <div className="p-8 rounded-3xl glass-card space-y-4">
          <label className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center justify-between">
            <span>{t.reportPage.issueDescription}</span>
            <span className="text-xs font-normal text-slate-500">(Optional details)</span>
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.reportPage.issueDescriptionPlaceholder}
            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-400 focus:outline-none text-sm text-slate-800 placeholder-slate-400 leading-relaxed transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-base shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer hover:shadow-emerald-500/40"
          >
            <Sparkles className="w-5 h-5 text-white" />
            <span>{t.reportPage.analyzeButton}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-center text-xs text-slate-500 mt-3">
            {t.reportPage.fillRequired}
          </p>
        </div>
      </form>
    </div>
  );
};
