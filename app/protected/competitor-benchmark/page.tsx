'use client';

import { CompetitorBenchmark } from '@/app/components/competitor-benchmark';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function CompetitorBenchmarkPage() {
  const [pageId, setPageId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // Redirect to login handled by component
          return;
        }

        setUserId(user.id);

        const { data: pageData, error } = await supabase
          .from('pages')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching page data:', error);
          return;
        }

        setPageId(pageData?.id || null);
      } catch (err) {
        console.error('Error in effect:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-100">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Competitor Benchmark</h1>
          </div>
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-2 rounded-lg bg-purple-100">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Competitor Benchmark</h1>
        </motion.div>

        <motion.div
          {...fadeIn}
          className="space-y-6"
        >
          {pageId && userId ? (
            <CompetitorBenchmark userId={userId} pageId={pageId} isPremium={false} />
          ) : (
            <div className="bg-card rounded-xl border border-border shadow-sm p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Page Found</h3>
              <p className="text-muted-foreground">Create a page first to access competitor benchmarking.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}