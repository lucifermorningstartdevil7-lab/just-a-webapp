// app/[username]/page.tsx
import { createClient } from '@/lib/supabase/client';
import { notFound } from 'next/navigation';
import ProfilePageComponent from '@/app/components/ProfileCardComponent/page';
import ClickableLink from '@/app/components/clickableLink';

// Helper functions
function getCategoryIcon(category: string) {
  const icons: Record<string, string> = {
    music: '🎵', gaming: '🎮', art: '🎨', writing: '✍️',
    fitness: '💪', education: '📚', photography: '📸', other: '🌟'
  };
  return icons[category] || '🌟';
}

function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    music: 'Music Producer', gaming: 'Gaming/Streamer', art: 'Artist/Designer',
    writing: 'Writer/Author', fitness: 'Fitness Coach', education: 'Educator',
    photography: 'Photographer', other: 'Creator'
  };
  return labels[category] || 'Creator';
}

function formatNumber(num: string | number) {
  const value = typeof num === 'string' ? parseInt(num, 10) : num;
  if (isNaN(value)) return '0';
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
  if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K';
  return value.toString();
}

function isLinkActive(link: any) {
  if (!link || !link.schedule || link.schedule.type === 'always') return true;

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.toTimeString().slice(0, 5);
  const currentDate = now.toISOString().split('T')[0];

  const schedule = link.schedule;

  switch (schedule.type) {
    case 'specific_days':
      return schedule.days?.includes(currentDay) ?? true;
    case 'time_range':
      if (!schedule.start_time || !schedule.end_time) return true;
      return currentTime >= schedule.start_time && currentTime <= schedule.end_time;
    case 'one_time':
      if (!schedule.start_date || !schedule.end_date) return true;
      return currentDate >= schedule.start_date && currentDate <= schedule.end_date;
    default:
      return true;
  }
}

interface PublicPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function PublicPage({ params }: PublicPageProps) {
  const { username } = await params;
  const supabase = createClient();

  const { data: page, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', username)
    .eq('is_published', true)
    .single();

  if (error || !page) return notFound();

  let bioData: { category?: string; stats?: Record<string, any> } = {};
  try {
    bioData = page.bio ? JSON.parse(page.bio) : {};
  } catch (err) {
    console.error('Error parsing bio data:', err);
  }

  const { data: allLinks, error: linkError } = await supabase
    .from('links')
    .select('*')
    .eq('page_id', page.id)
    .order('position');

  if (linkError) console.error('Error fetching links:', linkError);

  // Show ALL links without any filtering for now
  const activeLinks = allLinks || [];
  const pinnedLinks = activeLinks.filter(link => link.pinned);
  const regularLinks = activeLinks.filter(link => !link.pinned);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center space-y-8">

          <div className="w-full flex justify-center">
            <ProfilePageComponent
              avatarUrl={page.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(page.title || 'User')}&size=400&background=6366f1&color=fff`}
              name={page.title || 'User'}
              username={page.slug}
              enableTilt
              className="w-full max-w-sm animate-fade-in"
            />
          </div>

          {page.description && (
            <div className="w-full max-w-md text-center animate-fade-in-delay">
              <p className="text-neutral-400 text-base leading-relaxed">{page.description}</p>
            </div>
          )}

          {bioData.stats && (bioData.stats.followers || bioData.stats.views || bioData.stats.posts) && (
            <div className="grid grid-cols-3 gap-3 w-full max-w-md animate-fade-in-delay">
              {bioData.stats.followers && (
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all hover:scale-105 transform">
                  <p className="text-2xl font-bold bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {formatNumber(bioData.stats.followers)}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1.5 font-medium">Followers</p>
                </div>
              )}
              {bioData.stats.views && (
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all hover:scale-105 transform">
                  <p className="text-2xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {formatNumber(bioData.stats.views)}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1.5 font-medium">Views</p>
                </div>
              )}
              {bioData.stats.posts && (
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all hover:scale-105 transform">
                  <p className="text-2xl font-bold bg-gradient-to-br from-pink-400 to-orange-400 bg-clip-text text-transparent">
                    {formatNumber(bioData.stats.posts)}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1.5 font-medium">Posts</p>
                </div>
              )}
            </div>
          )}

          <div className="w-full max-w-md space-y-4 pt-4">
            {pinnedLinks.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Featured</p>
                </div>
                {pinnedLinks.map((link: any, idx: number) => (
                  <ClickableLink
                    key={link.id}
                    link={link}
                    variant="pinned"
                    animationDelay={idx * 100}
                  />
                ))}
              </div>
            )}

            {regularLinks.length > 0 && (
              <div className="space-y-3 pt-2">
                {pinnedLinks.length > 0 && (
                  <div className="flex items-center gap-2 px-2 pt-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">All Links</p>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                )}
                {regularLinks.map((link: any, idx: number) => (
                  <ClickableLink
                    key={link.id}
                    link={link}
                    variant="regular"
                    animationDelay={(pinnedLinks.length + idx) * 100}
                  />
                ))}
              </div>
            )}

            {activeLinks.length === 0 && (
              <div className="text-center py-16 animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                  <span className="text-4xl">🔗</span>
                </div>
                <p className="text-neutral-400 font-medium">No active links at the moment</p>
                <p className="text-sm text-neutral-600 mt-2">Check back later for updates!</p>
              </div>
            )}
          </div>

          <div className="text-center pt-8 pb-4">
            <p className="text-xs text-neutral-600 font-medium">
              Powered by <span className="text-white/60">LinkTrim</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}