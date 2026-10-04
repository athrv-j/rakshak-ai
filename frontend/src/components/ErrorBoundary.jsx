import { Component } from 'react'
import { Shield, RefreshCw, Home } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Rakshak ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-5 shadow-xs">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Something went wrong</h2>
            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              Rakshak encountered an unexpected error. Your data is safe — please try refreshing the page.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-brand-500/20 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <a
                href="/"
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-cardBorder text-stone-700 rounded-xl font-semibold text-sm hover:bg-stone-50 transition-all shadow-xs"
              >
                <Home className="w-4 h-4" />
                Go Home
              </a>
            </div>
            {this.state.error && (
              <details className="mt-6 text-left bg-stone-50 rounded-xl border border-cardBorder p-4">
                <summary className="text-xs text-stone-500 cursor-pointer font-medium">Technical Details</summary>
                <pre className="text-[11px] text-stone-600 mt-2 whitespace-pre-wrap font-mono break-all">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
