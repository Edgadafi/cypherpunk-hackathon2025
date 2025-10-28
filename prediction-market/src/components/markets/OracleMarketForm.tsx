"use client";

import React, { useState } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { AlertCircle, TrendingUp, Clock, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { PRICE_FEEDS, OracleConfig, ComparisonType, getFeedName, validateOracleConfig, formatPrice } from '@/lib/oracle/pyth';
import { createMarketDirect } from '@/lib/program/direct';

export default function OracleMarketForm() {
  const wallet = useAnchorWallet();
  
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  
  // Oracle settings
  const [feedId, setFeedId] = useState('');
  const [threshold, setThreshold] = useState('');
  const [comparison, setComparison] = useState<ComparisonType>(0);
  
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!wallet) {
      toast.error('Please connect your wallet');
      return;
    }

    // Validation
    if (!question || question.length < 10 || question.length > 200) {
      toast.error('Question must be between 10 and 200 characters');
      return;
    }

    if (!description || description.length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }

    if (!endDate || !endTime) {
      toast.error('Please select end date and time');
      return;
    }

    const endDateTime = new Date(`${endDate}T${endTime}`);
    if (endDateTime <= new Date()) {
      toast.error('End time must be in the future');
      return;
    }

    if (!feedId) {
      toast.error('Please select a price feed');
      return;
    }

    if (!threshold || Number(threshold) <= 0) {
      toast.error('Please enter a valid threshold');
      return;
    }

    const oracleConfig: OracleConfig = {
      feedId,
      threshold: Number(threshold),
      comparison,
    };

    const validationError = validateOracleConfig(oracleConfig);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setIsCreating(true);
      
      const result = await createMarketDirect(
        wallet,
        question,
        description,
        Math.floor(endDateTime.getTime() / 1000),
        true, // oracleEnabled
        oracleConfig.feedId,
        oracleConfig.threshold,
        oracleConfig.comparison
      );

      toast.success(`Oracle market created! 🔮\nMarket: ${result.marketPubkey.toBase58().slice(0, 8)}...`);
      
      // Reset form
      setQuestion('');
      setDescription('');
      setEndDate('');
      setEndTime('');
      setFeedId('');
      setThreshold('');
      setComparison(0);
      
    } catch (error: any) {
      console.error('Error creating oracle market:', error);
      toast.error(error?.message || 'Failed to create oracle market');
    } finally {
      setIsCreating(false);
    }
  };

  const feedName = feedId ? getFeedName(feedId) : '';
  const comparisonLabel = comparison === 0 ? 'above' : comparison === 1 ? 'below' : 'equal to';

  return (
    <div className="bg-white border-2 border-black p-6">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Create Oracle Market</h2>
        <span className="text-xs bg-blue-600 text-white px-2 py-1 font-bold">
          AUTO-RESOLVE
        </span>
      </div>

      <div className="bg-blue-50 border-2 border-blue-600 p-4 mb-6">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-bold mb-1">Oracle-enabled markets</p>
            <p>
              These markets resolve automatically based on Pyth Network price feeds.
              No manual resolution needed - trustless and instant!
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Market Question */}
        <div>
          <label className="block text-sm font-bold mb-2">
            Market Question <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Will Bitcoin be above $100,000 on Dec 31, 2025?"
            className="w-full p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            maxLength={200}
          />
          <p className="text-xs text-gray-600 mt-1">
            {question.length}/200 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold mb-2">
            Resolution Criteria <span className="text-red-600">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Market resolves YES if BTC/USD price from Pyth Network is above $100,000 at the specified end time. Uses official Pyth price feed."
            className="w-full p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none text-gray-900 placeholder-gray-400"
            maxLength={500}
          />
          <p className="text-xs text-gray-600 mt-1">
            {description.length}/500 characters
          </p>
        </div>

        {/* End Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              End Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">
              End Time (UTC) <span className="text-red-600">*</span>
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
        </div>

        {/* Oracle Configuration */}
        <div className="border-2 border-blue-600 p-4 bg-blue-50">
          <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Oracle Configuration
          </h3>

          {/* Price Feed Selection */}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
              Price Feed <span className="text-red-600">*</span>
            </label>
            <select
              value={feedId}
              onChange={(e) => setFeedId(e.target.value)}
              className="w-full p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">Select asset...</option>
              {Object.entries(PRICE_FEEDS).map(([name, id]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Threshold Price */}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Target Price (USD) <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="100000"
              step="0.01"
              min="0"
              className="w-full p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            />
            <p className="text-xs text-gray-600 mt-1">
              Example: Enter 100000 for $100,000
            </p>
          </div>

          {/* Comparison Type */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Condition <span className="text-red-600">*</span>
            </label>
            <select
              value={comparison}
              onChange={(e) => setComparison(Number(e.target.value) as ComparisonType)}
              className="w-full p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value={0}>Price is ABOVE threshold (greater than)</option>
              <option value={1}>Price is BELOW threshold (less than)</option>
              <option value={2}>Price is EQUAL to threshold (exact match)</option>
            </select>
          </div>

          {/* Preview */}
          {feedId && threshold && (
            <div className="mt-4 p-3 bg-white border-2 border-blue-600">
              <p className="text-sm font-bold text-blue-900 mb-1">Resolution Preview:</p>
              <p className="text-sm text-gray-700">
                Market resolves <span className="font-bold text-green-600">YES</span> if{' '}
                <span className="font-bold">{feedName}</span> price is{' '}
                <span className="font-bold">{comparisonLabel}</span>{' '}
                <span className="font-bold">{formatPrice(Number(threshold), feedName)}</span>{' '}
                at the specified end time.
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleCreate}
          disabled={isCreating || !wallet}
          className={`w-full py-4 font-bold text-white text-lg ${
            isCreating || !wallet
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
        >
          {isCreating ? 'Creating Oracle Market...' : '🔮 Create Oracle Market'}
        </button>

        {!wallet && (
          <p className="text-center text-sm text-gray-600">
            Connect your wallet to create an oracle market
          </p>
        )}

        <div className="text-xs text-gray-600 space-y-1">
          <p>• Creation fee: ~0.01 SOL (~$2 at $200/SOL)</p>
          <p>• Oracle resolution is automatic and trustless</p>
          <p>• Powered by Pyth Network price feeds</p>
          <p>• Anyone can trigger resolution after end time</p>
        </div>
      </div>
    </div>
  );
}


