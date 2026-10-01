import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  BrainCircuit,
  FileText,
  Home,
  MapPin,
  PlusCircle,
  Search,
  X,
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

const commands: CommandItem[] = [
  { id: 'home', label: 'Overview', description: 'Return to community intelligence overview', path: '/', icon: Home, keywords: 'home overview landing' },
  { id: 'report', label: 'Report an issue', description: 'Open AI-assisted civic issue intake', path: '/report', icon: PlusCircle, keywords: 'new report submit issue ai' },
  { id: 'map', label: 'Open live map', description: 'Explore incidents and spatial hotspots', path: '/map', icon: MapPin, keywords: 'gis location incidents hotspots' },
  { id: 'dashboard', label: 'Open command dashboard', description: 'Review metrics and recent incidents', path: '/dashboard', icon: BarChart3, keywords: 'metrics command operations analytics' },
  { id: 'reports', label: 'Browse reports', description: 'Search and filter the incident register', path: '/reports', icon: FileText, keywords: 'table incidents search filter' },
  { id: 'insights', label: 'Open predictive insights', description: 'Review patterns, forecasts, and interventions', path: '/insights', icon: BrainCircuit, keywords: 'forecast ai prediction trends' },
];

export const CommandPalette: React.FC<Props> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return commands;
    return commands.filter((command) => `${command.label} ${command.description} ${command.keywords}`.toLowerCase().includes(normalized));
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setActiveIndex(0);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [isOpen]);

  useEffect(() => {
    if (activeIndex >= filteredCommands.length) setActiveIndex(0);
  }, [activeIndex, filteredCommands.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % Math.max(filteredCommands.length, 1));
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((index) => (index - 1 + Math.max(filteredCommands.length, 1)) % Math.max(filteredCommands.length, 1));
      }
      if (event.key === 'Enter' && filteredCommands[activeIndex]) {
        event.preventDefault();
        onNavigate(filteredCommands[activeIndex].path);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, filteredCommands, isOpen, onClose, onNavigate]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-900/25 px-4 pt-[12vh] backdrop-blur-md"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl glass-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-slate-200/60 px-4">
          <Search className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search civic actions..."
            className="h-14 min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            aria-label="Search civic actions"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Close command palette"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[min(50vh,360px)] overflow-y-auto p-2" role="listbox" aria-label="Civic actions">
          {filteredCommands.length > 0 ? filteredCommands.map((command, index) => {
            const Icon = command.icon;
            const isActive = index === activeIndex;
            return (
              <button
                key={command.id}
                type="button"
                role="option"
                aria-selected={isActive}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => { onNavigate(command.path); onClose(); }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-slate-800'
                    : 'text-slate-700 hover:bg-slate-50/80'
                }`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                  isActive
                    ? 'border-emerald-300/70 bg-emerald-100/70 text-emerald-600'
                    : 'border-slate-200 bg-white text-slate-400'
                }`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-800">{command.label}</span>
                  <span className="block truncate text-xs text-slate-500">{command.description}</span>
                </span>
                {isActive && <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500">Enter</span>}
              </button>
            );
          }) : (
            <div className="px-4 py-10 text-center text-sm text-slate-400">No civic actions match "{query}".</div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center gap-4 border-t border-slate-200/60 px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          <span>↑↓ Navigate</span>
          <span>Enter Open</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
};
