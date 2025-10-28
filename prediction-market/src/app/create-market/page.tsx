'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/layout/Layout'
import WalletInfo from '@/components/wallet/WalletInfo'
import BinaryMarketForm from '@/components/markets/BinaryMarketForm'
import OracleMarketForm from '@/components/markets/OracleMarketForm'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { createMarketDirect } from '@/lib/program/direct'
import * as anchor from '@coral-xyz/anchor'
import toast from 'react-hot-toast'

interface FormData {
  question: string
  description: string
  category: string
  endDate: string
  endTime: string
}

interface FormErrors {
  question?: string
  description?: string
  category?: string
  endDate?: string
}

export default function CreateMarketPage() {
  const { connected } = useWallet()
  const wallet = useAnchorWallet()
  const router = useRouter()

  const [marketType, setMarketType] = useState<'standard' | 'oracle'>('standard')
  const [formData, setFormData] = useState<FormData>({
    question: '',
    description: '',
    category: '',
    endDate: '',
    endTime: '23:59',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required'
    } else if (formData.question.length < 10) {
      newErrors.question = 'Question must be at least 10 characters'
    } else if (formData.question.length > 150) {
      newErrors.question = 'Question too long. Maximum 150 characters to fit in transaction.'
    } else if (!formData.question.includes('?')) {
      newErrors.question = 'Question should end with a question mark'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Resolution criteria is required'
    } else if (formData.description.length < 50) {
      newErrors.description =
        'Please provide detailed resolution criteria (min 50 characters)'
    } else if (formData.description.length > 400) {
      newErrors.description = 
        'Description too long. Maximum 400 characters to fit in transaction.'
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    } else {
      const selectedDate = new Date(`${formData.endDate}T${formData.endTime}`)
      if (selectedDate <= new Date()) {
        newErrors.endDate = 'End date must be in the future'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!connected || !wallet) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsSubmitting(true)

    try {
      // Convert end date to Unix timestamp
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`)
      const endTimeUnix = Math.floor(endDateTime.getTime() / 1000)

      // Validate timestamp
      if (!endTimeUnix || isNaN(endTimeUnix) || endTimeUnix <= 0) {
        throw new Error('Invalid end date/time. Please check your input.')
      }

      console.log('📅 End date:', formData.endDate)
      console.log('🕐 End time:', formData.endTime)
      console.log('⏰ End timestamp:', endTimeUnix)
      console.log('📆 End date object:', endDateTime.toString())

      // Create market on-chain (direct method - bypasses IDL issues)
      const { signature, marketPubkey } = await createMarketDirect(
        wallet,
        formData.question,
        formData.description,
        endTimeUnix
      )

      console.log('✅ Market created!')
      console.log('Transaction:', signature)
      console.log('Market address:', marketPubkey.toString())

      // Show success message with transaction link
      const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`
      
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-bold">Market created successfully!</span>
          <span className="text-sm">
            Market ID: {marketPubkey.toString().slice(0, 8)}...
          </span>
          <a 
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-xs underline"
          >
            View transaction →
          </a>
        </div>,
        { duration: 5000 }
      )

      // Redirect to market detail page after a short delay
      setTimeout(() => {
        router.push(`/markets/${marketPubkey.toString()}`)
      }, 1500)

    } catch (error: any) {
      console.error('Error creating market:', error)
      
      let errorMessage = 'Failed to create market. Please try again.'
      
      // Check for common error types
      if (error.message?.includes('User rejected') || 
          error.message?.includes('User canceled') ||
          error.message?.includes('cancelled') ||
          error.code === 4001) {
        toast.error('Transaction cancelled. You rejected the signature request.', {
          duration: 3000,
        })
        return // Don't show additional error
      } else if (error.message?.includes('Insufficient funds')) {
        errorMessage = 'Insufficient SOL balance. Please fund your wallet from the faucet.'
      } else if (error.message?.includes('QuestionTooLong')) {
        errorMessage = 'Question is too long. Maximum 200 characters.'
      } else if (error.message?.includes('InvalidEndTime')) {
        errorMessage = 'End date must be in the future.'
      } else if (error.message) {
        // Show a more user-friendly message
        errorMessage = error.message.includes('custom program error') 
          ? 'Smart contract error. Please check your inputs and try again.'
          : error.message
      }
      
      toast.error(errorMessage, { duration: 4000 })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getEndDateTime = () => {
    if (!formData.endDate) return null
    return new Date(`${formData.endDate}T${formData.endTime}`)
  }

  const estimatedOdds = { yes: 50, no: 50 }

  return (
    <Layout>
      <div className="min-h-screen bg-black py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Wallet Info or Demo Banner */}
          {connected ? (
            <div className="mb-6">
              <WalletInfo />
            </div>
          ) : (
            <div className="mb-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-yellow-300 font-semibold">
                    DEMO MODE - Simulated Market Creation
                  </p>
                  <p className="text-yellow-200/70 text-sm">
                    Connect your wallet to create real markets on Devnet
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Create Prediction Market
            </h1>
            <p className="text-gray-400">
              Create a YES/NO market with manual or automatic oracle resolution
            </p>
          </div>

          {/* Market Type Tabs */}
          <div className="mb-8">
            <div className="flex gap-2 bg-gray-900 border border-gray-800 rounded-xl p-2">
              <button
                type="button"
                onClick={() => setMarketType('standard')}
                className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${
                  marketType === 'standard'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-transparent text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">📝</span>
                  <span>Standard Market</span>
                  <span className="text-xs opacity-75">Manual Resolution</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMarketType('oracle')}
                className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${
                  marketType === 'oracle'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : 'bg-transparent text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">🔮</span>
                  <span>Oracle Market</span>
                  <span className="text-xs opacity-75">Auto-Resolved by Pyth</span>
                </div>
              </button>
            </div>
          </div>

          {/* Conditional Form Rendering */}
          {marketType === 'standard' ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Market Form */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <BinaryMarketForm
                  formData={formData}
                  errors={errors}
                  onChange={handleChange}
                />
              </div>

            {/* Creation Fee Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="text-blue-300 font-semibold">
                    Market Creation Fee
                  </p>
                  <p className="text-blue-200/70 text-sm">
                    0.1 SOL (includes rent + platform fee)
                  </p>
                </div>
              </div>
                </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all"
                  >
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                    Creating Market...
                      </span>
                    ) : (
                      'Create Market'
                    )}
                  </button>
                </div>
              </form>

          {/* Preview Section */}
          {showPreview && (
            <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                🎯 Market Preview
                </h2>

                {formData.question ? (
                  <div className="space-y-4">
                    {/* Question */}
                    <div>
                      <p className="text-gray-400 text-xs mb-1">QUESTION</p>
                      <h3 className="text-white font-bold text-lg">
                        {formData.question}
                      </h3>
                    <span className="inline-block mt-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
                      YES/NO MARKET
                        </span>
                      </div>

                  {/* Odds Preview */}
                    <div>
                    <p className="text-gray-400 text-xs mb-2">INITIAL ODDS</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <p className="text-green-400 text-xs mb-1">YES</p>
                          <p className="text-white font-bold text-2xl">
                            {estimatedOdds.yes}%
                          </p>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <p className="text-red-400 text-xs mb-1">NO</p>
                          <p className="text-white font-bold text-2xl">
                            {estimatedOdds.no}%
                          </p>
                        </div>
                      </div>
                    </div>

                  {/* Description */}
                  {formData.description && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">
                        RESOLUTION CRITERIA
                      </p>
                      <p className="text-gray-300 text-sm">
                        {formData.description}
                      </p>
                    </div>
                  )}

                  {/* Category & End Date */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    {formData.category && (
                      <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded font-medium">
                        {formData.category}
                      </span>
                    )}
                    {formData.endDate && (
                      <div>
                        <p className="text-gray-400 text-xs">ENDS</p>
                        <p className="text-white text-sm font-semibold">
                          {getEndDateTime()?.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                  <div className="text-5xl mb-4">🎯</div>
                    <p className="text-gray-400">
                      Fill out the form to see a preview
                    </p>
                  </div>
                )}
              </div>
          )}

          {/* Guidelines */}
          <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-bold mb-4">
              📋 Market Creation Guidelines
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>
                  Questions must be clear, unambiguous, and answerable with YES
                  or NO
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>
                  Include specific resolution criteria and data sources in the
                  description
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Set a realistic end date for market resolution</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>
                  Best for: political promises, public projects, institutional
                  commitments
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✗</span>
                <span>
                  Avoid subjective questions or questions without clear
                  verification
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">✗</span>
                <span>
                  Don't create duplicate markets or markets on illegal
                  activities
                </span>
              </li>
            </ul>
          </div>
          ) : (
            /* Oracle Market Form */
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-6">
                  <span className="text-4xl">🔮</span>
                  <div>
                    <h3 className="text-white font-bold text-xl mb-2">
                      Oracle-Powered Market
                    </h3>
                    <p className="text-blue-200 text-sm">
                      This market will be automatically resolved using real-time price data from{' '}
                      <span className="font-semibold">Pyth Network</span>. No manual intervention needed!
                    </p>
                  </div>
                </div>
                <OracleMarketForm />
              </div>
              
              {/* Oracle Benefits */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">
                  ✨ Why Use Oracle Markets?
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>
                      <strong>Trustless</strong>: No human can manipulate the outcome
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>
                      <strong>Instant</strong>: Resolves immediately when time expires
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>
                      <strong>Verifiable</strong>: Anyone can verify the Pyth price feed
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>
                      <strong>Scalable</strong>: No manual resolution workload
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
