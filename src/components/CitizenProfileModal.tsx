import React, { useState } from 'react';
import {
  X,
  Trophy,
  Shield,
  Flame,
  Star,
  Award,
  Zap,
  Heart,
  MapPin,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export type BadgeType =
  | 'first_report'
  | 'top_reporter'
  | 'critical_hunter'
  | 'community_guardian'
  | 'streak_king'
  | 'speed_demon'
  | 'accuracy_master'
  | 'eco_warrior';

export interface Badge {
  id: BadgeType;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export interface CitizenProfile {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  level: number;
  reportsSubmitted: number;
  reportsResolved: number;
  accuracyRate: number;
  streak: number;
  badges: Badge[];
  rank: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: CitizenProfile;
  leaderboard: Array<{ rank: number; name: string; points: number }>;
}

const BADGE_CONFIG: Record<BadgeType, Omit<Badge, 'unlocked' | 'progress' | 'maxProgress'>> = {
  first_report: {
    id: 'first_report',
    name: 'First Steps',
    description: 'Submitted your first report',
    icon: <Star className="w-5 h-5" />,
    color: 'from-amber-400 to-orange-500',
  },
  top_reporter: {
    id: 'top_reporter',
    name: 'Top Reporter',
    description: 'Submitted 50+ reports',
    icon: <Trophy className="w-5 h-5" />,
    color: 'from-yellow-400 to-amber-500',
  },
  critical_hunter: {
    id: 'critical_hunter',
    name: 'Critical Hunter',
    description: 'Identified 10+ critical issues',
    icon: <Flame className="w-5 h-5" />,
    color: 'from-rose-400 to-red-500',
  },
  community_guardian: {
    id: 'community_guardian',
    name: 'Community Guardian',
    description: 'Resolved 25+ community issues',
    icon: <Shield className="w-5 h-5" />,
    color: 'from-blue-400 to-indigo-500',
  },
  streak_king: {
    id: 'streak_king',
    name: 'Streak King',
    description: '7-day reporting streak',
    icon: <Zap className="w-5 h-5" />,
    color: 'from-purple-400 to-pink-500',
  },
  speed_demon: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Reports resolved within 24h',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'from-emerald-400 to-teal-500',
  },
  accuracy_master: {
    id: 'accuracy_master',
    name: 'Accuracy Master',
    description: '90%+ accuracy on severity',
    icon: <Award className="w-5 h-5" />,
    color: 'from-cyan-400 to-blue-500',
  },
  eco_warrior: {
    id: 'eco_warrior',
    name: 'Eco Warrior',
    description: '20+ environmental reports',
    icon: <Heart className="w-5 h-5" />,
    color: 'from-green-400 to-emerald-500',
  },
};

export const CitizenProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  profile,
  leaderboard,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'badges' | 'leaderboard'>('profile');

  if (!isOpen) return null;

  const unlockedBadges = profile.badges.filter((b) => b.unlocked);
  const lockedBadges = profile.badges.filter((b) => !b.unlocked);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-card shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 border-b border-slate-200/60 bg-white/95 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Citizen Profile</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {[
              { id: 'profile' as const, label: 'Profile' },
              { id: 'badges' as const, label: 'Badges' },
              { id: 'leaderboard' as const, label: 'Leaderboard' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {profile.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900">{profile.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-slate-500">Level {profile.level}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-sm text-emerald-600 font-semibold">
                      #{profile.rank} on Leaderboard
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-500">{profile.points}</div>
                  <div className="text-xs text-slate-500">Total Points</div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl glass-card text-center">
                  <div className="text-2xl font-bold text-slate-900">{profile.reportsSubmitted}</div>
                  <div className="text-xs text-slate-500 mt-1">Reports</div>
                </div>
                <div className="p-4 rounded-2xl glass-card text-center">
                  <div className="text-2xl font-bold text-slate-900">{profile.reportsResolved}</div>
                  <div className="text-xs text-slate-500 mt-1">Resolved</div>
                </div>
                <div className="p-4 rounded-2xl glass-card text-center">
                  <div className="text-2xl font-bold text-slate-900">{profile.accuracyRate}%</div>
                  <div className="text-xs text-slate-500 mt-1">Accuracy</div>
                </div>
                <div className="p-4 rounded-2xl glass-card text-center">
                  <div className="text-2xl font-bold text-slate-900">{profile.streak}</div>
                  <div className="text-xs text-slate-500 mt-1">Day Streak</div>
                </div>
              </div>

              {/* Recent Badges Preview */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Recent Badges
                </h4>
                <div className="flex gap-3">
                  {unlockedBadges.slice(0, 4).map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-3 rounded-xl bg-gradient-to-br ${badge.color} text-white shadow-lg`}
                      title={badge.name}
                    >
                      {badge.icon}
                    </div>
                  ))}
                  {unlockedBadges.length === 0 && (
                    <p className="text-sm text-slate-500">No badges earned yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="space-y-6">
              {/* Unlocked Badges */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Unlocked ({unlockedBadges.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {unlockedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-2xl glass-card border-2 border-emerald-200/50 bg-gradient-to-br ${badge.color} text-white shadow-lg`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        {badge.icon}
                        <Award className="w-4 h-4 opacity-70" />
                      </div>
                      <div className="font-bold text-sm">{badge.name}</div>
                      <div className="text-xs opacity-90 mt-1">{badge.description}</div>
                    </div>
                  ))}
                </div>
                {unlockedBadges.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-8">
                    Keep reporting to earn your first badge!
                  </p>
                )}
              </div>

              {/* Locked Badges */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Locked ({lockedBadges.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {lockedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="p-4 rounded-2xl glass-card border border-slate-200 opacity-60"
                    >
                      <div className="flex items-center justify-between mb-2 text-slate-400">
                        {badge.icon}
                        <Lock className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-sm text-slate-600">{badge.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{badge.description}</div>
                      {badge.progress !== undefined && badge.maxProgress && (
                        <div className="mt-2">
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-slate-400 rounded-full transition-all"
                              style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">
                            {badge.progress}/{badge.maxProgress}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Top Citizens
              </h4>
              <div className="space-y-2">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      entry.rank === 1
                        ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200'
                        : entry.rank === 2
                        ? 'bg-gradient-to-r from-slate-50 to-gray-100 border border-slate-200'
                        : entry.rank === 3
                        ? 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200'
                        : 'glass-card'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        entry.rank <= 3
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {entry.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{entry.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-500">{entry.points}</div>
                      <div className="text-xs text-slate-500">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Lock = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

export { BADGE_CONFIG };
