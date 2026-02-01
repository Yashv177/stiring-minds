'use client';

import { motion } from 'framer-motion';
import { Deal } from '@/lib/types';
import { DealCard } from './DealCard';

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

