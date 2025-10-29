'use client'

import React, { Component, ReactNode } from 'react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('❌ ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
          <div className="max-w-2xl w-full bg-red-900/20 border border-red-500/30 rounded-xl p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🚨</div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Oops! Algo salió mal
              </h1>
              <p className="text-red-300 mb-6">
                Hubo un error al cargar esta página. Por favor, intenta de nuevo.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-black/50 rounded-lg p-4 mb-6 text-left">
                  <p className="text-red-400 font-mono text-sm mb-2">
                    Error: {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-gray-400 text-xs">
                      <summary className="cursor-pointer hover:text-white">
                        Stack trace
                      </summary>
                      <pre className="mt-2 overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
                    window.location.reload()
                  }}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
                >
                  Reintentar
                </button>
                <Link
                  href="/markets"
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
                >
                  Volver a Mercados
                </Link>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

