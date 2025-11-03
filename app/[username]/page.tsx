'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { notFound } from 'next/navigation';
import LinkItem from './components/LinkItem';
import BundleContainer from '@/app/components/BundleContainer';

// Helper functions
function formatNumber(num) {
  if (num == null) return '0';
  
  let value;
  if (typeof num === 'string') {
    const matches = num.match(/[\d.]+/);
    if (matches) {
      value = parseFloat(matches[0]);
    } else {
      return '0';
    }
  } else {
    value = num;
  }
  
  if (isNaN(value) || !isFinite(value)) return '0';
  
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
  if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K';
  return Math.floor(value).toString();
}

// Helper to get bundle card color based on template or custom setting
function getBundleCardColor(pageTheme) {
  const bundleTemplate = pageTheme.bundleTemplate;
  if (bundleTemplate === 'vibrant') return '#fef7ee';
  if (bundleTemplate === 'elegant') return '#f5f3ff';
  if (bundleTemplate === 'minimal') return '#ffffff';
  if (bundleTemplate === 'bold') return '#fff1f2';
  if (bundleTemplate === 'soft') return '#f0f9ff';
  if (bundleTemplate === 'dark') return '#1e293b';
  // If custom settings exist, use them, otherwise fallback
  return pageTheme.bundleCardColor || pageTheme.cardColor || pageTheme.backgroundColor || '#f8fafc';
}

// Helper to get bundle text color based on template or custom setting
function getBundleTextColor(pageTheme) {
  const bundleTemplate = pageTheme.bundleTemplate;
  if (bundleTemplate === 'vibrant') return '#7c2d12';
  if (bundleTemplate === 'elegant') return '#312e81';
  if (bundleTemplate === 'minimal') return '#1f2937';
  if (bundleTemplate === 'bold') return '#7f1d1d';
  if (bundleTemplate === 'soft') return '#083344';
  if (bundleTemplate === 'dark') return '#f1f5f9';
  // If custom settings exist, use them, otherwise fallback
  return pageTheme.bundleTextColor || pageTheme.textColor || '#1e293b';
}

// Helper to get bundle accent color based on template or custom setting
function getBundleAccentColor(pageTheme) {
  const bundleTemplate = pageTheme.bundleTemplate;
  if (bundleTemplate === 'vibrant') return '#ea580c';
  if (bundleTemplate === 'elegant') return '#7c3aed';
  if (bundleTemplate === 'minimal') return '#4b5563';
  if (bundleTemplate === 'bold') return '#dc2626';
  if (bundleTemplate === 'soft') return '#0284c7';
  if (bundleTemplate === 'dark') return '#60a5fa';
  // If custom settings exist, use them, otherwise fallback
  return pageTheme.bundleAccentColor || pageTheme.accentColor || '#3b82f6';
}

function isLinkActive(link) {
  if (link.is_active === false) return false;
  if (!link || !link.schedule || (typeof link.schedule === 'string' && JSON.parse(link.schedule).type === 'always') || (typeof link.schedule === 'object' && link.schedule.type === 'always')) return true;

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.toTimeString().slice(0, 5);
  const currentDate = now.toISOString().split('T')[0];
  
  let schedule;
  if (typeof link.schedule === 'string') {
    try {
      schedule = JSON.parse(link.schedule);
    } catch (e) {
      console.warn('Could not parse schedule for link:', link.id);
      return true;
    }
  } else {
    schedule = link.schedule;
  }

  switch (schedule?.type) {
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

// Enhanced Apple-inspired Bundle Display Component
function BundleDisplay({ bundles, links, pageTheme }) {
  if (!Array.isArray(bundles) || !Array.isArray(links)) {
    console.warn('Bundles or links are not arrays', { bundles, links });
    return null;
  }

  const activeBundles = bundles.filter(bundle => {
    if (!bundle || !bundle.id || !bundle.links) return false;
    
    // bundle.links contains an array of link IDs
    const bundleLinkIds = Array.isArray(bundle.links) ? bundle.links : [];
    const bundleLinks = links.filter(link => 
      bundleLinkIds.includes(link.id) && isLinkActive(link)
    );
    
    return bundleLinks.length > 0;
  });
  
  return (
    <div className="bundles-container space-y-4">
      {activeBundles.map((bundle) => {
        if (!bundle || !bundle.id || !bundle.name) return null;
        
        // Get the actual link objects for this bundle
        const bundleLinkIds = Array.isArray(bundle.links) ? bundle.links : [];
        const bundleLinks = links
          .filter(link => bundleLinkIds.includes(link.id) && isLinkActive(link))
          .sort((a, b) => (a.position || 0) - (b.position || 0));

        if (bundleLinks.length === 0) return null;

        return (
          <BundleContainer 
            key={bundle.id} 
            title={bundle.name} 
            links={bundleLinks.map(link => ({
              id: link.id,
              title: link.title,
              url: link.url,
              icon: link.icon
            }))}
            theme={{
              cardColor: getBundleCardColor(pageTheme),
              textColor: getBundleTextColor(pageTheme),
              accentColor: getBundleAccentColor(pageTheme),
              buttonStyle: pageTheme.bundleButtonStyle || pageTheme.buttonStyle || 'rounded',
              hoverEffect: pageTheme.bundleHoverEffect || 'lift',
              transitionSpeed: 'fast', // Default to fast as requested
              titleAnimation: pageTheme.bundleTitleAnimation || 'none',
              linkAnimation: pageTheme.bundleLinkAnimation || 'none'
            }}
          />
        );
      })}
    </div>
  );
}
    
// Enhanced Apple-inspired Profile Card Component
function ProfileCard({ page }) {
  return (
    <div className="profile-card">
      <div className="avatar-container">
        <img
          src={page.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(page.title || 'User')}&size=192&background=f5f5f7&color=1d1d1f`}
          alt={page.title}
          className="avatar-image"
        />
      </div>
      <h1 className="profile-name">{page.title}</h1>
      {page.description && (
        <p className="profile-description">{page.description}</p>
      )}
    </div>
  );
}

// Enhanced Apple-inspired Stats Component
function StatsSection({ bioData }) {
  if (!bioData.stats || (!bioData.stats.followers && !bioData.stats.views && !bioData.stats.posts)) {
    return null;
  }

  return (
    <div className="stats-container">
      <div className="stats-grid">
        {bioData.stats.followers !== undefined && (
          <div className="stat-item">
            <div className="stat-value">{formatNumber(bioData.stats.followers)}</div>
            <div className="stat-label">Followers</div>
          </div>
        )}
        {bioData.stats.views !== undefined && (
          <div className="stat-item">
            <div className="stat-value">{formatNumber(bioData.stats.views)}</div>
            <div className="stat-label">Views</div>
          </div>
        )}
        {bioData.stats.posts !== undefined && (
          <div className="stat-item">
            <div className="stat-value">{formatNumber(bioData.stats.posts)}</div>
            <div className="stat-label">Posts</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Apple-inspired Footer Component
function Footer() {
  return (
    <footer className="apple-footer">
      <p className="footer-text">
        &copy; {new Date().getFullYear()} <span className="footer-brand">ClickSprout</span>. All rights reserved.
      </p>
    </footer>
  );
}

// Main Component
export default function PublicPage({ params }) {
  const [page, setPage] = useState(null);
  const [allLinks, setAllLinks] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const resolvedParams = React.use(params);
  const username = resolvedParams.username;
  const isValidUsername = /^[a-zA-Z0-9-]+$/.test(username);

  useEffect(() => {
  const fetchPageData = async () => {
    try {
      if (!isValidUsername) {
        setError('Invalid username format');
        setLoading(false);
        return;
      }

      setLoading(true);
      const supabase = createClient();

      // First, fetch the page data
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', username)
        .eq('is_published', true)
        .single();

      if (pageError || !pageData) {
        setError('Page not found');
        setLoading(false);
        return;
      }

      setPage(pageData);

      // Fetch all links for this page
      const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('page_id', pageData.id)
        .order('position');

      if (linksError) {
        console.error('Error fetching links:', linksError);
        setAllLinks([]);
      } else {
        setAllLinks(linksData || []);
      }

      // Fetch bundles for this user - FIXED: using user_id instead of page_id
      const { data: bundlesData, error: bundlesError } = await supabase
        .from('bundles')
        .select('*')
        .eq('user_id', pageData.user_id)  // CHANGED: page_id -> user_id
        .order('position');

      if (bundlesError) {
        console.error('Error fetching bundles:', bundlesError);
        setBundles([]);
      } else {
        console.log('Bundles loaded:', bundlesData);
        setBundles(bundlesData || []);
      }

    } catch (err) {
      console.error('Error fetching page:', err);
      setError('Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  if (username) {
    fetchPageData();
  }
}, [username, isValidUsername]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="apple-spinner"></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="error-container">
        <div className="error-content">
          <svg className="error-icon" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <h2 className="error-title">{error || 'Page not found'}</h2>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  let bioData = {};
  try {
    bioData = page.bio ? JSON.parse(page.bio) : {};
  } catch (err) {
    console.error('Error parsing bio data:', err);
  }

  const activeLinks = allLinks.filter(link => isLinkActive(link));
  const hasBundleId = (link) => {
    return !!(link.bundle_id || link.bundleId || link.collection_id || link.collectionId || link.is_colleged);
  };

  // Get page theme (defaults will be used if no theme is set)
  const pageTheme = page.theme || {};
  const backgroundColor = pageTheme.backgroundColor || '#f5f5f7';
  const textColor = pageTheme.textColor || '#1e293b';
  const accentColor = pageTheme.accentColor || '#3b82f6';

  return (
    <>
      <style jsx global>{`
        /* Apple SF Pro Text / SF Pro Display inspired typography */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
          background: ${backgroundColor};
          color: ${textColor};
          margin: 0;
          padding: 0;
        }

        .page-container {
          max-width: 692px;
          margin: 0 auto;
          padding: 32px 20px 60px;
          min-height: 100vh;
        }

        @media (max-width: 734px) {
          .page-container {
            padding: 24px 16px 48px;
          }
        }

        /* Loading & Error States */
        .loading-container, .error-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${backgroundColor};
        }

        .error-container {
          color: ${textColor};
        }

        .apple-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(0, 0, 0, 0.1);
          border-top-color: #1d1d1f;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-content {
          text-align: center;
          max-width: 340px;
        }

        .error-icon {
          width: 56px;
          height: 56px;
          color: #86868b;
          margin-bottom: 20px;
        }

        .error-title {
          font-size: 21px;
          line-height: 1.381;
          font-weight: 600;
          letter-spacing: 0.011em;
          color: #1d1d1f;
          margin: 0 0 28px;
        }

        .retry-button {
          display: inline-block;
          padding: 11px 22px;
          font-size: 17px;
          line-height: 1.17648;
          font-weight: 400;
          letter-spacing: -0.022em;
          color: #fff;
          background: #0071e3;
          border: none;
          border-radius: 980px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.3s ease;
        }

        .retry-button:hover {
          background: #0077ed;
        }

        /* Profile Card */
        .profile-card {
          text-align: center;
          margin-bottom: 36px;
          animation: fadeIn 0.6s ease-out;
        }

        .avatar-container {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          margin: 0 auto 20px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-name {
          font-size: 32px;
          line-height: 1.125;
          font-weight: 700;
          color: #1d1d1f;
          margin: 0 0 8px;
        }

        .profile-description {
          font-size: 17px;
          line-height: 1.47059;
          font-weight: 400;
          color: #6e6e73;
          margin: 0;
          max-width: 512px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 12px;
        }

        /* Stats Section */
        .stats-container {
          margin-bottom: 40px;
          animation: fadeIn 0.6s ease-out 0.1s both;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          width: 100%;
        }

        .stat-item {
          text-align: center;
          padding: 20px 8px;
          background: #ffffff;
          border-radius: 14px;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border: 1px solid rgba(0, 0, 0, 0.03);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        }

        .stat-item:hover {
          background: #ffffff;
          transform: translateY(-4px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }

        .stat-value {
          font-size: 24px;
          line-height: 1.16667;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0 0 4px;
        }

        .stat-label {
          font-size: 12px;
          line-height: 1.33337;
          font-weight: 500;
          color: #86868b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Links Section */
        .links-section {
          animation: fadeIn 0.6s ease-out 0.2s both;
        }

        .bundles-container {
          margin-bottom: 24px;
        }

        .section-divider {
          height: 1px;
          background: rgba(0, 0, 0, 0.08);
          margin: 32px 0;
          border: none;
        }



        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #ffffff;
          border-radius: 16px;
          margin: 24px 0;
          border: 1px solid rgba(0, 0, 0, 0.03);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.3;
        }

        .empty-text {
          font-size: 17px;
          line-height: 1.47059;
          font-weight: 400;
          color: #86868b;
        }

        /* Footer */
        .apple-footer {
          text-align: center;
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }

        .footer-text {
          font-size: 12px;
          line-height: 1.33337;
          font-weight: 400;
          color: #86868b;
        }

        .footer-brand {
          color: #1d1d1f;
          font-weight: 500;
        }

        /* Animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Responsive adjustments */
        @media (max-width: 734px) {
          .profile-name {
            font-size: 28px;
          }

          .profile-description {
            font-size: 15px;
          }

          .stat-value {
            font-size: 21px;
          }
          
          .stats-grid {
            gap: 12px;
          }
          
          .stat-item {
            padding: 18px 6px;
          }
        }
      `}</style>

      <main className="page-container">
        <ProfileCard page={page} />
        
        <StatsSection bioData={bioData} />
        
        <div className="links-section">
          {bundles.length > 0 ? (
            <>
              <BundleDisplay 
                bundles={bundles} 
                links={allLinks} 
                pageTheme={pageTheme}
              />
              
              {activeLinks.filter(link => !hasBundleId(link)).length > 0 && (
                <>
                  <div className="section-divider" />
                  {activeLinks
                    .filter(link => !hasBundleId(link))
                    .map((link, idx) => (
                      <div key={link.id} className="mb-3">
                        <LinkItem 
                          title={link.title} 
                          url={link.url} 
                          icon={link.icon} 
                          theme={{
                            cardColor: pageTheme.cardColor || pageTheme.backgroundColor || '#f8fafc',
                            textColor: pageTheme.textColor || '#1e293b',
                            accentColor: pageTheme.accentColor || '#3b82f6',
                            buttonStyle: pageTheme.buttonStyle || 'rounded'
                          }}
                          animation="none" // Default to none for standalone links
                        />
                      </div>
                    ))}
                </>
              )}
            </>
          ) : (
            <>
              {activeLinks.map((link, idx) => (
                <div key={link.id} className="mb-3">
                  <LinkItem 
                    title={link.title} 
                    url={link.url} 
                    icon={link.icon} 
                    theme={{
                      cardColor: pageTheme.cardColor || pageTheme.backgroundColor || '#f8fafc',
                      textColor: pageTheme.textColor || '#1e293b',
                      accentColor: pageTheme.accentColor || '#3b82f6',
                      buttonStyle: pageTheme.buttonStyle || 'rounded'
                    }}
                    animation="none" // Default to none for standalone links
                  />
                </div>
              ))}

              {activeLinks.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">🔗</div>
                  <p className="empty-text">No links available</p>
                </div>
              )}
            </>
          )}
        </div>

        <Footer />
      </main>
    </>
  );
}