'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dealsApi, claimsApi } from '@/lib/api';
import { Deal, DealsResponse } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { DealList } from '@/components/deals/DealList';
import { DealFilter } from '@/components/deals/DealFilter';
import { DealCardSkeleton } from '@/components/ui/Skeleton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DealsPage() {
  const { user } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [claimingDealId, setClaimingDealId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchDeals = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (searchQuery) params.q = searchQuery;
      if (selectedTags.length > 0) params.tags = selectedTags.join(',');

      const response = await dealsApi.list(params);
      setDeals(response.data.deals);
      setPagination((prev) => ({
        ...prev,
        ...response.data.pagination,
      }));
    } catch (error) {
      console.error('Failed to fetch deals:', error);
      toast.error('Failed to load deals');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedTags, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleFilterByTags = useCallback((tags: string[]) => {
    setSelectedTags(tags);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleClaim = async (dealId: string) => {
    if (!user) {
      toast.info('Please sign in to claim deals');
      return;
    }

    setClaimingDealId(dealId);
    try {
      await claimsApi.create({ dealId });
      toast.success('Deal claimed successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to claim deal';
      toast.error(message);
    } finally {
      setClaimingDealId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Deals</h1>
          <p className="text-gray-600">
            Discover exclusive SaaS discounts for your startup
          </p>
        </motion.div>

        {/* Filters */}
        <DealFilter
          onSearch={handleSearch}
          onFilterByTags={handleFilterByTags}
          selectedTags={selectedTags}
        />

        {/* Results count */}
        <div className="mb-4 text-sm text-gray-500">
          {isLoading ? 'Loading...' : `${deals.length} deals found`}
        </div>

        {/* Deals Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <DealCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <DealList
            deals={deals}
            isVerified={user?.isVerified}
            onClaim={handleClaim}
            isClaiming={claimingDealId}
          />
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPagination((prev) => ({ ...prev, page: i + 1 }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pagination.page === i + 1
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

