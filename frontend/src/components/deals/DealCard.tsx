'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TiltCard } from '@/components/ui/TiltCard';
import { Button } from '@/components/ui/Button';
import { Deal } from '@/lib/types';
import { cn, formatDate, truncate } from '@/lib/utils';
import { Lock, Unlock, ExternalLink, Tag, Calendar } from 'lucide-react';

interface DealCardProps {
  deal: Deal;
  isVerified?: boolean;
  onClaim?: (dealId: string) => void;
  isClaiming?: boolean;
}

export function DealCard({ deal, isVerified = false, onClaim, isClaiming }: DealCardProps) {
  const isLocked = deal.isLocked && !isVerified;

  return (
    <TiltCard
      intensity={8}
      className={cn(
        'overflow-hidden',
        isLocked && 'opacity-75'
      )}
    >
      {/* Locked overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-gray-900/5 z-10 rounded-xl" />
      )}

      <div className="p-6">
        {/* Header with provider and lock status */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {deal.title}
            </h3>
            <p className="text-sm text-gray-500">{deal.provider}</p>
          </div>
          {deal.isLocked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
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
                  Locked
                </>
              ) : (
                <>
                  <Unlock className="h-3 w-3" />
                  Unlocked
                </>
              )}
            </motion.div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {truncate(deal.description, 150)}
        </p>

        {/* Tags */}
        {deal.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {deal.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
            {deal.tags.length > 3 && (
              <span className="px-2 py-1 text-gray-400 text-xs">
                +{deal.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Expiry date */}
        {deal.expiresAt && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
            <Calendar className="h-3 w-3" />
            Expires {formatDate(deal.expiresAt)}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            href={`/deals/${deal._id}`}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            View Details
            <ExternalLink className="h-3 w-3" />
          </Link>

          {isLocked ? (
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100 rounded-lg flex items-center gap-1"
            >
              <Lock className="h-4 w-4" />
              Verify to Claim
            </Link>
          ) : (
            <Button
              size="sm"
              onClick={() => onClaim?.(deal._id)}
              isLoading={isClaiming}
            >
              Claim Deal
            </Button>
          )}
        </div>
      </div>
    </TiltCard>
  );
}

interface DealListProps {
  deals: Deal[];
  isVerified?: boolean;
  onClaim?: (dealId: string) => void;
  isClaiming?: string | null;
}

export function DealList({ deals, isVerified, onClaim, isClaiming }: DealListProps) {
  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No deals found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {deals.map((deal, index) => (
        <motion.div
          key={deal._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <DealCard
            deal={deal}
            isVerified={isVerified}
            onClaim={onClaim}
            isClaiming={isClaiming === deal._id}
          />
        </motion.div>
      ))}
    </div>
  );
}

