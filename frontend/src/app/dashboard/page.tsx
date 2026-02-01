'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { claimsApi } from '@/lib/api';
import { Claim, ClaimStatus } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { formatRelativeTime, cn, getStatusColor } from '@/lib/utils';
import { Gift, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';

const statusConfig: Record<
  ClaimStatus,
  { icon: typeof Clock; label: string; color: string }
> = {
  pending: { icon: Clock, label: 'Pending', color: 'text-yellow-600 bg-yellow-100' },
  approved: { icon: CheckCircle, label: 'Approved', color: 'text-green-600 bg-green-100' },
  rejected: { icon: XCircle, label: 'Rejected', color: 'text-red-600 bg-red-100' },
  redeemed: { icon: Gift, label: 'Redeemed', color: 'text-blue-600 bg-blue-100' },
};

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<ClaimStatus | 'all'>('all');

  const fetchClaims = async () => {
    try {
      const response = await claimsApi.list();
      setClaims(response.data.claims);
    } catch (error) {
      console.error('Failed to fetch claims:', error);
      toast.error('Failed to load claims');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchClaims();
    }
  }, [user]);

  // Refetch claims when page gains focus (e.g., after returning from claiming a deal)
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        fetchClaims();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const filteredClaims =
    filter === 'all' ? claims : claims.filter((c) => c.status === filter);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <Card className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sign in Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please sign in to view your dashboard.
            </p>
            <Link href="/login" className="text-primary-600 hover:text-primary-700">
              Sign in →
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">
            Manage your claimed deals and track their status
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {(['pending', 'approved', 'rejected', 'redeemed'] as ClaimStatus[]).map(
            (status) => {
              const count = claims.filter((c) => c.status === status).length;
              const config = statusConfig[status];
              return (
                <Card key={status} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg', config.color.split(' ')[1])}>
                      <config.icon className={cn('h-5 w-5', config.color.split(' ')[0])} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-sm text-gray-500">{config.label}</p>
                    </div>
                  </div>
                </Card>
              );
            }
          )}
        </motion.div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'pending', 'approved', 'rejected', 'redeemed'] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                )}
              >
                {status === 'all' ? 'All Claims' : statusConfig[status as ClaimStatus]?.label}
              </button>
            )
          )}
        </div>

        {/* Claims List */}
        {isLoading ? (
          <DashboardSkeleton />
        ) : filteredClaims.length === 0 ? (
          <Card className="p-12 text-center">
            <Gift className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all'
                ? "You haven't claimed any deals yet"
                : `No ${filter} claims`}
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all'
                ? 'Browse our deals and start saving on SaaS tools.'
                : 'Check your other claims or browse for more deals.'}
            </p>
            <Link
              href="/deals"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Deals
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredClaims.map((claim, index) => {
              const config = statusConfig[claim.status];
              return (
                <motion.div
                  key={claim._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Deal Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {claim.deal?.title || 'Unknown Deal'}
                          </h3>
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1',
                              config.color
                            )}
                          >
                            <config.icon className="h-3 w-3" />
                            {config.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          from {claim.deal?.provider || 'Unknown Provider'}
                        </p>
                      </div>

                      {/* Date */}
                      <div className="text-sm text-gray-500">
                        {formatRelativeTime(claim.createdAt)}
                      </div>
                    </div>

                    {/* Claim ID */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-mono">
                        Claim ID: {claim._id.slice(-8)}
                      </span>
                      <Link
                        href={`/deals/${claim.deal?._id}`}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        View Deal →
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

