// lib/content-promotion-service.ts
import { createClient } from '@/lib/supabase/client';

export interface PlatformConnection {
  id: string;
  platform: string;
  displayName: string;
  externalId: string;
  accessToken: string;
  refreshToken: string;
  connectedAt: string;
  lastSync: string | null;
}

export interface AutoPromotionConfig {
  userId: string;
  enabled: boolean;
  platforms: string[]; // List of connected platform IDs
  autoPinNewContent: boolean;
  contentCategories: string[];
  timezone: string;
}

export interface ContentItem {
  id: string;
  platform: string;
  title: string;
  url: string;
  thumbnail: string;
  publishedAt: string;
  description: string;
  tags: string[];
}

/**
 * Gets the current auto-promotion configuration for a user
 */
export async function getAutoPromotionConfig(userId: string): Promise<AutoPromotionConfig> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('auto_promotion_configs')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching auto-promotion config:', error);
    // Return default config if none exists
    return {
      userId,
      enabled: false,
      platforms: [],
      autoPinNewContent: false,
      contentCategories: [],
      timezone: 'UTC'
    };
  }

  return data as AutoPromotionConfig;
}

/**
 * Updates the auto-promotion configuration for a user
 */
export async function updateAutoPromotionConfig(config: AutoPromotionConfig): Promise<AutoPromotionConfig> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('auto_promotion_configs')
    .upsert([{
      user_id: config.userId,
      enabled: config.enabled,
      platforms: config.platforms,
      auto_pin_new_content: config.autoPinNewContent,
      content_categories: config.contentCategories,
      timezone: config.timezone,
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error updating auto-promotion config:', error);
    throw error;
  }

  return data as AutoPromotionConfig;
}

/**
 * Gets all connected platforms for a user
 */
export async function getConnectedPlatforms(userId: string): Promise<PlatformConnection[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('platform_connections')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching connected platforms:', error);
    return [];
  }

  return data as PlatformConnection[];
}

/**
 * Connects a new platform for the user
 */
export async function connectPlatform(userId: string, platform: string, externalId: string, tokens: { accessToken: string, refreshToken: string }): Promise<PlatformConnection> {
  const supabase = createClient();
  
  const newConnection = {
    user_id: userId,
    platform,
    external_id: externalId,
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    connected_at: new Date().toISOString(),
    last_sync: null
  };

  const { data, error } = await supabase
    .from('platform_connections')
    .insert([newConnection])
    .select()
    .single();

  if (error) {
    console.error('Error connecting platform:', error);
    throw error;
  }

  return data as PlatformConnection;
}

/**
 * Gets recent content from connected platforms
 */
export async function getRecentContent(userId: string, platformIds?: string[]): Promise<ContentItem[]> {
  const supabase = createClient();
  
  // First get user's connected platforms
  let query = supabase
    .from('platform_connections')
    .select('id, platform, external_id')
    .eq('user_id', userId);

  if (platformIds && platformIds.length > 0) {
    query = query.in('id', platformIds);
  }

  const { data: connections, error: connError } = await query;

  if (connError) {
    console.error('Error fetching platform connections:', connError);
    return [];
  }

  // For each connected platform, we would normally call their API
  // Here we simulate getting content from external APIs
  const allContent: ContentItem[] = [];
  
  for (const conn of connections) {
    // Simulate fetching content from external platform
    // In a real app, this would be an API call to YouTube/TikTok/Instagram
    const content = await fetchContentFromPlatform(conn.platform, conn.external_id);
    allContent.push(...content);
  }

  // Sort by publish date, newest first
  return allContent.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Adds content to user's page (in our case, likely adds it to a queue or updates the bio link)
 */
export async function addContentToPage(userId: string, pageId: string, content: ContentItem): Promise<void> {
  const supabase = createClient();
  
  // Add to promotion queue
  const { error } = await supabase
    .from('content_promotion_queue')
    .insert([{
      user_id: userId,
      page_id: pageId,
      content_id: content.id,
      platform: content.platform,
      title: content.title,
      url: content.url,
      status: 'pending',
      requested_at: new Date().toISOString()
    }]);

  if (error) {
    console.error('Error adding content to promotion queue:', error);
    throw error;
  }
}

/**
 * Processes the promotion queue and updates the user's bio links
 */
export async function processPromotionQueue(userId: string, pageId: string): Promise<void> {
  const supabase = createClient();
  
  // Get pending items from queue
  const { data: queueItems, error: queueError } = await supabase
    .from('content_promotion_queue')
    .select('*')
    .eq('user_id', userId)
    .eq('page_id', pageId)
    .eq('status', 'pending')
    .order('requested_at', { ascending: true });

  if (queueError) {
    console.error('Error fetching promotion queue:', queueError);
    return;
  }

  // Process each item
  for (const item of queueItems) {
    // Update the relevant link in the user's bio page
    // This would involve updating the links table or creating/updating a bio link entry
    const { error: updateError } = await supabase
      .from('page_links')
      .upsert([{
        page_id: pageId,
        title: item.title,
        url: item.url,
        is_pinned: true, // Pin the new content
        category: 'auto-promoted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }], { onConflict: ['page_id', 'url'] });

    if (updateError) {
      console.error('Error updating page link:', updateError);
      continue;
    }

    // Mark item as processed
    await supabase
      .from('content_promotion_queue')
      .update({ status: 'processed', processed_at: new Date().toISOString() })
      .eq('id', item.id);
  }
}

// Helper function to simulate fetching content from external platforms
async function fetchContentFromPlatform(platform: string, externalId: string): Promise<ContentItem[]> {
  // This is where you would actually call external APIs
  // For now, we return simulated data
  const simulatedContent: ContentItem[] = [];
  
  // Generate some mock content based on the platform
  const now = new Date();
  const oneDayAgo = new Date(now);
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  if (platform === 'youtube') {
    simulatedContent.push({
      id: `yt_${Date.now()}`,
      platform: 'YouTube',
      title: 'New video: How to build a SaaS startup',
      url: 'https://youtube.com/watch?v=abc123',
      thumbnail: 'https://example.com/thumb1.jpg',
      publishedAt: oneDayAgo.toISOString(),
      description: 'Learn how to start and grow your SaaS business',
      tags: ['startup', 'business', 'saas']
    });
  }
  
  if (platform === 'instagram') {
    simulatedContent.push({
      id: `ig_${Date.now()}`,
      platform: 'Instagram',
      title: 'Behind the scenes of our new app',
      url: 'https://instagram.com/p/def456',
      thumbnail: 'https://example.com/thumb2.jpg',
      publishedAt: now.toISOString(),
      description: 'Check out how we built the new feature',
      tags: ['app', 'development', 'tech']
    });
  }
  
  if (platform === 'tiktok') {
    simulatedContent.push({
      id: `tt_${Date.now()}`,
      platform: 'TikTok',
      title: 'Quick tip: Productivity hack for developers',
      url: 'https://tiktok.com/@user/video/ghi789',
      thumbnail: 'https://example.com/thumb3.jpg',
      publishedAt: now.toISOString(),
      description: 'Watch this quick productivity hack',
      tags: ['productivity', 'developer', 'tips']
    });
  }

  return simulatedContent;
}

/**
 * Synchronizes content from connected platforms and automatically promotes new content
 */
export async function syncAndPromoteContent(userId: string, pageId: string): Promise<void> {
  // Get user's configuration
  const config = await getAutoPromotionConfig(userId);
  
  if (!config.enabled) {
    return;
  }

  // Get connected platforms
  const platforms = await getConnectedPlatforms(userId);
  const connectedPlatformIds = platforms.map(p => p.id);

  if (connectedPlatformIds.length === 0) {
    return;
  }

  // Get recent content from platforms
  const recentContent = await getRecentContent(userId, connectedPlatformIds);
  
  // Filter content that's newer than the last sync
  const newContent = recentContent.filter(content => {
    return !config.lastSync || new Date(content.publishedAt) > new Date(config.lastSync);
  });

  // Add new content to promotion queue
  for (const content of newContent) {
    await addContentToPage(userId, pageId, content);
  }

  // Process the queue to update the bio page
  await processPromotionQueue(userId, pageId);

  // Update the last sync time to now
  await updateAutoPromotionConfig({
    ...config,
    platforms: connectedPlatformIds
  });
}