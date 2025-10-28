"use client";

import React, { useEffect, useState } from "react";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  AlertCircle,
  Sparkles,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import { analyzeMarket, MarketInsight } from "@/lib/ai/swarms-analyzer";

interface MarketAnalyzerProps {
  marketId: string;
  question: string;
  description: string;
  totalYes: number;
  totalNo: number;
}

export default function MarketAnalyzer({
  marketId,
  question,
  description,
  totalYes,
  totalNo,
}: MarketAnalyzerProps) {
  const [insight, setInsight] = useState<MarketInsight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalysis();
  }, [marketId, totalYes, totalNo]);

  const loadAnalysis = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeMarket(
        marketId,
        question,
        description,
        totalYes,
        totalNo
      );
      setInsight(result);
    } catch (err) {
      setError("Failed to load AI analysis");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border-2 border-black p-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6" />
          <h3 className="text-xl font-bold">AI Market Analyzer</h3>
          <span className="text-xs bg-purple-600 text-white px-2 py-1 font-bold">
            POWERED BY SWARMS
          </span>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 animate-pulse" />
          <div className="h-4 bg-gray-200 animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 animate-pulse w-1/2" />
        </div>
      </div>
    );
  }

  if (error || !insight) {
    return (
      <div className="bg-white border-2 border-black p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <h3 className="text-xl font-bold">AI Analysis Unavailable</h3>
        </div>
        <p className="text-gray-600">
          {error || "Unable to load market analysis"}
        </p>
        <button
          onClick={loadAnalysis}
          className="mt-4 px-4 py-2 bg-black text-white font-bold hover:bg-gray-800"
        >
          Retry Analysis
        </button>
      </div>
    );
  }

  const { sentiment, historicalData, strategy, confidence } = insight;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-black p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold">AI Market Analyzer</h3>
          <span className="text-xs bg-purple-600 text-white px-2 py-1 font-bold">
            POWERED BY SWARMS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-bold">
            Confidence: {(confidence * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sentiment Analysis */}
        <div className="bg-white border-2 border-black p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold">Sentiment</h4>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Social Score</span>
                <span
                  className={`font-bold ${
                    sentiment.score > 0.3
                      ? "text-green-600"
                      : sentiment.score < -0.3
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {sentiment.score > 0 ? "+" : ""}
                  {sentiment.score.toFixed(2)}
                </span>
              </div>
              <div className="h-2 bg-gray-200 border border-black">
                <div
                  className={`h-full ${
                    sentiment.score > 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                  style={{
                    width: `${Math.abs(sentiment.score) * 50}%`,
                  }}
                />
              </div>
            </div>

            <div className="text-sm">
              <span className="font-medium">Volume:</span>{" "}
              {sentiment.volume.toLocaleString()} mentions
            </div>

            {sentiment.trending && (
              <div className="flex items-center gap-2 text-sm bg-yellow-100 border border-yellow-600 px-2 py-1">
                <TrendingUp className="w-4 h-4" />
                <span className="font-bold">TRENDING</span>
              </div>
            )}

            <div className="text-xs text-gray-600">
              {sentiment.topKeywords.slice(0, 3).join(", ")}
            </div>
          </div>
        </div>

        {/* Historical Data */}
        <div className="bg-white border-2 border-black p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <h4 className="font-bold">Historical Data</h4>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium">Similar Markets:</span>
              <div className="text-2xl font-bold">
                {historicalData.similarMarketsCount}
              </div>
            </div>

            <div>
              <span className="text-sm font-medium">Avg Win Rate:</span>
              <div className="text-xl font-bold text-green-600">
                {(historicalData.averageWinRate * 100).toFixed(0)}%
              </div>
            </div>

            <div className="flex items-center gap-2">
              {historicalData.priceMovement === "bullish" ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : historicalData.priceMovement === "bearish" ? (
                <TrendingDown className="w-5 h-5 text-red-600" />
              ) : (
                <Activity className="w-5 h-5 text-gray-600" />
              )}
              <span className="font-bold uppercase text-sm">
                {historicalData.priceMovement}
              </span>
            </div>
          </div>
        </div>

        {/* Strategy Recommendation */}
        <div className="bg-white border-2 border-black p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-purple-600" />
            <h4 className="font-bold">Strategy</h4>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium">Recommendation:</span>
              <div
                className={`text-2xl font-bold ${
                  strategy.recommendedOutcome === "YES"
                    ? "text-green-600"
                    : strategy.recommendedOutcome === "NO"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {strategy.recommendedOutcome}
              </div>
            </div>

            <div>
              <span className="text-sm font-medium">Optimal Bet Size:</span>
              <div className="text-xl font-bold">
                {strategy.optimalBetSize.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-600">of portfolio</div>
            </div>

            <div
              className={`px-2 py-1 text-center font-bold text-sm border-2 ${
                strategy.confidenceLevel === "HIGH"
                  ? "bg-green-100 border-green-600 text-green-800"
                  : strategy.confidenceLevel === "MEDIUM"
                  ? "bg-yellow-100 border-yellow-600 text-yellow-800"
                  : "bg-gray-100 border-gray-600 text-gray-800"
              }`}
            >
              {strategy.confidenceLevel} CONFIDENCE
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Insights */}
      <div className="mt-6 space-y-4">
        {/* Sentiment Summary */}
        <div className="bg-white border-2 border-black p-4">
          <div className="flex items-start gap-2">
            <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h5 className="font-bold mb-1">Sentiment Analysis</h5>
              <p className="text-sm text-gray-700">{sentiment.summary}</p>
            </div>
          </div>
        </div>

        {/* Historical Summary */}
        <div className="bg-white border-2 border-black p-4">
          <div className="flex items-start gap-2">
            <BarChart3 className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h5 className="font-bold mb-1">Historical Patterns</h5>
              <p className="text-sm text-gray-700">
                {historicalData.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Strategy Reasoning */}
        <div className="bg-white border-2 border-black p-4">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <h5 className="font-bold mb-2">AI Reasoning</h5>
              <ul className="space-y-1">
                {strategy.reasoning.map((reason, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-700 flex items-start gap-2"
                  >
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-white border-2 border-black p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h5 className="font-bold mb-1">Risk Assessment</h5>
              <p className="text-sm text-gray-700">
                {strategy.riskAssessment}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t-2 border-black">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span>Powered by Swarms Multi-Agent AI</span>
            <span className="font-bold">|</span>
            <span>3 Specialized Agents</span>
          </div>
          <div>
            Updated: {new Date(insight.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}

