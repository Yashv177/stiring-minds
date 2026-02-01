'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { verificationApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { CheckCircle, Lock, Shield, ArrowRight, AlertCircle } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';

export default function VerifyPage() {
  const { user, updateUser, isLoading: authLoading } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Check current verification status
    const checkStatus = async () => {
      if (user) {
        try {
          const response = await verificationApi.status();
          setIsVerified(response.data.isVerified);
          // Update user context if verification status changed
          if (response.data.isVerified !== user.isVerified) {
            updateUser({ ...user, isVerified: response.data.isVerified });
          }
        } catch (error) {
          console.error('Failed to check verification status:', error);
        }
      }
    };

    checkStatus();
  }, [user, updateUser]);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      await verificationApi.request();
      setIsVerified(true);
      if (user) {
        updateUser({ ...user, isVerified: true });
      }
      toast.success('Verification approved! You can now access locked deals.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Verification failed';
      toast.error(message);
    } finally {
      setIsVerifying(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Skeleton className="h-10 w-64 mb-8" />
          <Card className="p-8">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-12 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <Card className="p-8">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sign in Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please sign in to verify your account.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Account Verification
          </h1>
          <p className="text-gray-600">
            Verify your identity to unlock premium deals
          </p>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`p-3 rounded-xl ${
                  isVerified ? 'bg-green-100' : 'bg-amber-100'
                }`}
              >
                {isVerified ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <Shield className="h-8 w-8 text-amber-600" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isVerified ? 'Verified Account' : 'Unverified Account'}
                </h2>
                <p className="text-gray-500">
                  {isVerified
                    ? 'You have full access to all deals'
                    : 'Some deals require verification'}
                </p>
              </div>
            </div>

            {isVerified && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Verification complete</span>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Locked Deals Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Lock className="h-6 w-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Why Verify?
                </h3>
                <p className="text-gray-600 mb-4">
                  Some exclusive deals are restricted to verified startup founders.
                  Verification helps us ensure that premium offers go to legitimate
                  teams building real products.
                </p>

                <h4 className="font-medium text-gray-900 mb-2">
                  Benefits of verification:
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Access to premium locked deals
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Higher credit amounts from cloud providers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Priority support from partners
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Exclusive enterprise features
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Verify Button */}
        {!isVerified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to Verify?
              </h3>
              <p className="text-gray-600 mb-4">
                For this demo, verification is instant. Click below to unlock all
                deals immediately.
              </p>
              <Button
                size="lg"
                onClick={handleVerify}
                isLoading={isVerifying}
                className="w-full sm:w-auto"
              >
                <Shield className="h-5 w-5 mr-2" />
                Verify My Account
              </Button>
              <p className="mt-3 text-sm text-gray-500">
                In production, this would require document verification and manual
                approval.
              </p>
            </Card>
          </motion.div>
        )}

        {/* Verified CTA */}
        {isVerified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Explore Premium Deals
              </h3>
              <p className="text-gray-600 mb-4">
                You now have access to all locked deals. Browse our exclusive
                offers from top SaaS providers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/deals?locked=true">
                  <Button size="lg">
                    Browse Locked Deals
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

