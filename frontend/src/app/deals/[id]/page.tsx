'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { dealsApi } from '@/lib/api';
import { Deal } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate, cn, getStatusColor } from '@/lib/utils';
import { ArrowLeft, Lock, Unlock, Calendar, Tag, ExternalLink, CheckCircle } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);

  const dealId = params.id as string;

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const response = await dealsApi.get(dealId);
        setDeal(response.data.deal);
      } catch (error) {
        console.error('Failed to fetch deal:', error);
        toast.error('Deal not found');
        router.push('/deals');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeal();
  }, [dealId, router]);

  const handleClaim = async () => {
    if (!user) {
      toast.info('Please sign in to claim this deal');
      router.push('/login');
      return;
    }

    setIsClaiming(true);
    try {
      await dealsApi.create({ dealId });
      toast.success('Deal claimed successfully! Check your dashboard.');
      // Refresh deal data to show updated status
      const response = await dealsApi.get(dealId);
      setDeal(response.data.deal);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to claim deal';
      toast.error(message);
    } finally {
      setIsClaiming(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Skeleton className="h-8 w-48 mb-8" />
          <Card className="p-8">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-32 mb-6" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-2/3" />
          </Card>
        </div>
      </div>
    );
  }

  if (!deal) {
    return null;
  }

  const isLocked = deal.isLocked && !user?.isVerified;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          href="/deals"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Deals
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {deal.title}
                    </h1>
                    {deal.isLocked && (
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1',
                          isLocked
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-green-100 text-green-700'
                        )}
                      >
                        {isLocked ? (
                          <>
                            <Lock className="h-3 w-3" />
                            Verification Required
                          </>
                        ) : (
                          <>
                            <Unlock className="h-3 w-3" />
                            Available
                          </>
                        )}
                      </span>
                    )}
                  </div>
                  <p className="text-lg text-gray-500">{deal.provider}</p>
                </div>
              </div>

              {/* Tags */}
              {deal.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {deal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  About This Deal
                </h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {deal.description}
                </p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {deal.expiresAt && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Expires</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(deal.expiresAt)}
                      </p>
                    </div>
                  </div>
                )}

                {deal.termsUrl && (
                  <a
                    href={deal.termsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Terms & Conditions</p>
                      <p className="font-medium text-primary-600 flex items-center gap-1">
                        View Details
                        <ExternalLink className="h-3 w-3" />
                      </p>
                    </div>
                  </a>
                )}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                {isLocked ? (
                  <Link
                    href="/register"
                    className="flex-1"
                  >
                    <Button size="lg" className="w-full">
                      <Lock className="h-5 w-5 mr-2" />
                      Verify to Unlock Deal
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleClaim}
                    isLoading={isClaiming}
                    className="flex-1"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Claim This Deal
                  </Button>
                )}
              </div>

              {/* Locked info */}
              {isLocked && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">
                        This deal requires verification
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        Create a free account and verify your identity to unlock
                        this and other premium deals.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

