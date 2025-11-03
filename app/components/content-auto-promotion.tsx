'use client';

import { motion } from 'framer-motion';
import { Zap, Clock, Settings, CheckCircle, AlertCircle, Link, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { useState, useEffect } from 'react';
import { 
  getAutoPromotionConfig, 
  updateAutoPromotionConfig, 
  getConnectedPlatforms, 
  connectPlatform as connectPlatformService,
  getRecentContent,
  syncAndPromoteContent
} from '@/lib/content-promotion-service';

interface PlatformConnection {
  id: string;
  platform: string;
  displayName: string;
  connectedAt: string;
  lastSync: string | null;
}

interface AutoPromotionStatus {
  enabled: boolean;
  platforms: PlatformConnection[];
  lastProcessedContent: string | null;
  nextSync: string | null;
}

interface ContentAutoPromotionProps {
  userId: string;
  pageId: string;
  isPremium?: boolean;
}

export function ContentAutoPromotion({ userId, pageId, isPremium = false }: ContentAutoPromotionProps) {
  const [promotionStatus, setPromotionStatus] = useState<AutoPromotionStatus>({
    enabled: false,
    platforms: [],
    lastProcessedContent: null,
    nextSync: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPromotionData();
  }, [userId, pageId, isPremium]);

  const loadPromotionData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!isPremium) {
        // For non-premium users, just set basic state
        setPromotionStatus({
          enabled: false,
          platforms: [],
          lastProcessedContent: null,
          nextSync: null
        });
        return;
      }

      // Fetch user configuration
      const config = await getAutoPromotionConfig(userId);
      
      // Fetch connected platforms
      const platforms = await getConnectedPlatforms(userId);
      
      // Convert to our internal format
      const formattedPlatforms: PlatformConnection[] = platforms.map(platform => ({
        id: platform.id,
        platform: platform.platform,
        displayName: platform.displayName,
        connectedAt: platform.connectedAt,
        lastSync: platform.lastSync
      }));

      setPromotionStatus({
        enabled: config.enabled,
        platforms: formattedPlatforms,
        lastProcessedContent: null, // We could fetch recent activity here
        nextSync: null // We could calculate next sync time here
      });
    } catch (err) {
      console.error('Error loading promotion data:', err);
      setError('Failed to load auto-promotion settings');
    } finally {
      setLoading(false);
    }
  };

  const togglePromotion = async () => {
    if (!isPremium) return;
    
    try {
      const newConfig = await updateAutoPromotionConfig({
        userId,
        enabled: !promotionStatus.enabled,
        platforms: promotionStatus.platforms.map(p => p.id),
        autoPinNewContent: true,
        contentCategories: [],
        timezone: 'UTC'
      });
      
      setPromotionStatus(prev => ({
        ...prev,
        enabled: newConfig.enabled
      }));
    } catch (err) {
      console.error('Error toggling promotion:', err);
      setError('Failed to update promotion settings');
    }
  };

  const connectPlatform = async (platformName: string) => {
    if (!isPremium) return;
    
    try {
      // In a real app, this would redirect to OAuth consent screens
      // For now, we'll simulate a connection
      alert(`Redirecting to ${platformName} OAuth... (simulated)`);
      
      // After OAuth flow, we would receive tokens and connect the platform
      // For simulation, we'll just refresh the data
      await loadPromotionData();
    } catch (err) {
      console.error('Error connecting platform:', err);
      setError('Failed to connect platform');
    }
  };

  const getConnectedPlatformsCount = () => {
    return promotionStatus.platforms.length;
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="h-full"
      >
        <Card className="border border-slate-200 bg-white shadow-sm overflow-hidden h-full flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50 animate-pulse">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-slate-800">Content Auto-Promotion</CardTitle>
                  <CardDescription className="text-slate-600">Initializing...</CardDescription>
                </div>
              </div>
              <Badge className="animate-pulse bg-slate-100 text-slate-600 border-slate-200">Loading</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center items-center py-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse"></div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <Card className="border border-slate-200 bg-white shadow-sm overflow-hidden h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-slate-800">Content Auto-Promotion</CardTitle>
                <CardDescription className="text-slate-600">
                  {isPremium ? 'Automatically promote your content' : 'Connect your platforms'}
                </CardDescription>
              </div>
            </div>
            <Badge className={
              isPremium 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }>
              {isPremium ? 'Premium' : 'Basic'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-5 p-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <div className="text-lg font-bold text-slate-800">{getConnectedPlatformsCount()}/3</div>
              <div className="text-xs text-slate-600">Platforms Connected</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <div className="text-lg font-bold text-slate-800">
                {promotionStatus.enabled ? 'ON' : 'OFF'}
              </div>
              <div className="text-xs text-slate-600">Auto-Promotion</div>
            </div>
          </div>

          {/* Auto-Promotion Toggle */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-purple-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Auto-Promotion</h3>
                <p className="text-xs text-slate-600">
                  {promotionStatus.enabled 
                    ? 'Active: Promoting new content automatically' 
                    : 'Inactive: Content will not auto-promote'}
                </p>
              </div>
              <Switch
                checked={promotionStatus.enabled}
                onCheckedChange={togglePromotion}
                disabled={!isPremium}
                className={`${promotionStatus.enabled ? 'bg-purple-500' : 'bg-slate-300'} ${!isPremium ? 'opacity-50' : ''}`}
              />
            </div>
          </div>

          {/* Platform Connections */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-800">Connected Platforms</h3>
            {['YouTube', 'Instagram', 'TikTok'].map((platformName) => {
              const connectedPlatform = promotionStatus.platforms.find(p => 
                p.platform.toLowerCase() === platformName.toLowerCase()
              );
              
              return (
                <div 
                  key={platformName} 
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    connectedPlatform 
                      ? 'border-emerald-200 bg-emerald-50' 
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      connectedPlatform ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Link className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{platformName}</div>
                      {connectedPlatform?.lastSync ? (
                        <div className="text-xs text-slate-600">
                          Last sync: {new Date(connectedPlatform.lastSync).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400">Not connected</div>
                      )}
                    </div>
                  </div>
                  
                  {connectedPlatform ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : isPremium ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => connectPlatform(platformName)}
                      className="text-xs"
                    >
                      Connect
                    </Button>
                  ) : (
                    <div className="text-xs text-slate-500">Premium</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Recent Activity */}
          {promotionStatus.enabled && promotionStatus.platforms.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-800">How it works</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    When you post new content on connected platforms, it will automatically appear in your bio.
                  </p>
                  <div className="text-xs text-slate-500 mt-1">
                    Set it once, forget about it.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Premium Upsell */}
          {!isPremium && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-semibold text-slate-800">Unlock Auto-Promotion</h3>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Connect multiple platforms and let our system promote your content while you sleep
                </p>
                
                <ul className="text-xs text-slate-600 space-y-1 mb-3">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                    <span>Automatic content discovery</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                    <span>Multi-platform integration</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                    <span>Promotes while you sleep</span>
                  </li>
                </ul>
              </div>
              
              <Button size="sm" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                Upgrade to Premium
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}