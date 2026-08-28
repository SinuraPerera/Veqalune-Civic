import React, { useState, useRef } from 'react';
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
} from 'lucide-react';
import { ReportCategory, AnalysisRequestPayload } from '../types';
import { CategoryIcon } from '../components/CategoryIcon';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  onStartAnalysis: (payload: AnalysisRequestPayload) => void;
}

export const ReportPage: React.FC<Props> = ({ onStartAnalysis }) => {
  const { t, formatCategory } = useLanguage();

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
      },
      (err) => {
        console.warn('Geolocation failed or denied:', err);
        setGeoLocating(false);
        // Fallback to Colombo Pilot Community coordinates
        setLatitude(6.9271);
        setLongitude(79.8612);
        setLocationLabel('Colombo Pilot Community (Central Sector)');
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
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-xs font-mono text-emerald-400">
          <BrainCircuit className="w-3.5 h-3.5" />
          {t.nav.ai}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
          {t.reportPage.heading}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          {t.reportPage.subheading}
        </p>
      </div>

      {/* Quick Scenario Preset Selector */}
      <div className="mb-6 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            {t.reportPage.presetsTitle}
          </span>
          <span className="text-zinc-400 text-[11px]">{t.brand.syntheticDataNotice}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {PRESET_SCENARIOS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/90 hover:border-emerald-500/50 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200 group-hover:text-emerald-400">
                <CategoryIcon category={preset.category} size={14} />
                <span className="truncate">{preset.title}</span>
              </div>
              <p className="text-[10px] text-zinc-400 truncate mt-1">
                {preset.locationLabel}
              </p>
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 text-amber-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-amber-400 hover:text-amber-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Visual Evidence Upload */}
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              {t.reportPage.step1Title}
            </label>
            <span className="text-[11px] text-zinc-400">{t.reportPage.step1Desc}</span>
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
            <div className="relative rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950 group">
              <img
                src={imagePreview}
                alt="Preview"
                referrerPolicy="no-referrer"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-zinc-100 text-xs font-semibold border border-zinc-700 shadow-md hover:bg-zinc-800 cursor-pointer"
                >
                  {t.reportPage.orUseCamera}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageBase64(null);
                  }}
                  className="p-1.5 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-800/80 hover:bg-rose-900 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[11px] font-mono text-zinc-300">
                Visual Evidence Attached
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-700/80 hover:border-emerald-500/60 rounded-xl p-8 text-center cursor-pointer transition-all bg-zinc-950/40 hover:bg-zinc-950/70"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-400 group-hover:text-emerald-400">
                <UploadCloud className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-zinc-200">
                {t.reportPage.uploadBoxTitle}
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                {t.reportPage.uploadBoxSubtitle}
              </p>
            </div>
          )}
        </div>

        {/* 2. Category Selector */}
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            {t.reportPage.step2Title}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/30'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CategoryIcon
                      category={cat.id}
                      size={18}
                      className={isSelected ? 'text-emerald-400' : 'text-zinc-400'}
                    />
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="font-bold text-xs text-zinc-100">{cat.label}</div>
                  <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                    {cat.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Location Information */}
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              {t.reportPage.locationLabel}
            </label>
            <button
              type="button"
              onClick={handleFetchGeolocation}
              disabled={geoLocating}
              className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 transition-colors cursor-pointer"
            >
              <Compass className={`w-3.5 h-3.5 ${geoLocating ? 'animate-spin' : ''}`} />
              {geoLocating ? 'Acquiring GPS...' : geoSuccess ? t.reportPage.gpsActive : t.reportPage.detectGps}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                {t.reportPage.locationPlaceholder}
              </label>
              <input
                type="text"
                value={locationLabel}
                onChange={(e) => setLocationLabel(e.target.value)}
                placeholder="e.g. Sector 4 Green Corridor, Canal Walkway"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none text-xs text-zinc-100 placeholder-zinc-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Geotag Coordinates (WGS84)
              </label>
              <div className="px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-emerald-400 flex items-center justify-between">
                <span>{latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
                <span className="text-[10px] text-zinc-400">PostGIS</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Description (Optional) */}
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center justify-between">
            <span>{t.reportPage.issueDescription}</span>
            <span className="text-[11px] font-normal text-zinc-400">(Optional details)</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.reportPage.issueDescriptionPlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none text-xs text-zinc-100 placeholder-zinc-600 leading-relaxed"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-zinc-950" />
            <span>{t.reportPage.analyzeButton}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-center text-[11px] text-zinc-400 mt-2.5">
            {t.reportPage.fillRequired}
          </p>
        </div>
      </form>
    </div>
  );
};
