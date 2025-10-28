'use client';

import { Twitter } from 'lucide-react';
import type { EnrichedBet, MarketAccount } from '@/lib/program/direct-read';
import {
  generateWinningBetShareText,
  getMarketUrl,
  getTwitterShareUrl,
} from '@/lib/utils/shareUtils';

interface ShareBetProps {
  bet: EnrichedBet;
  marketData: MarketAccount;
}

const ShareBet = ({ bet, marketData }: ShareBetProps) => {
  const marketUrl = getMarketUrl(bet.market.toBase58());
  const shareText = generateWinningBetShareText(bet, marketData);

  const handleShare = () => {
    const twitterUrl = getTwitterShareUrl(shareText, marketUrl);
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  return (
    <button
      onClick={handleShare}
      className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
      title="Share winning bet on X"
    >
      <Twitter className="w-3.5 h-3.5" />
      Share Win
    </button>
  );
};

export default ShareBet;





