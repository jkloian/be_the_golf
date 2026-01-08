// Get app version from window.APP_VERSION set by Rails, or data attribute, or fallback to 'dev'
function getAppVersion(): string {
  // Try window.APP_VERSION first (set by script tag in layout)
  if (typeof window !== 'undefined' && (window as { APP_VERSION?: string }).APP_VERSION) {
    return (window as { APP_VERSION: string }).APP_VERSION
  }
  
  // Fallback to data attribute on #app element
  if (typeof document !== 'undefined') {
    const appElement = document.getElementById('app')
    const version = appElement?.dataset.appVersion
    if (version) {
      return version
    }
  }
  
  // Final fallback to 'dev'
  return 'dev'
}

export default function Footer() {
  const appVersion = getAppVersion()
  const currentYear = new Date().getFullYear()
  const copyrightSymbol = '\u00A9'

  return (
    <footer className="w-full py-4 px-4 sm:px-6 text-center border-t border-neutral-border bg-neutral-surface">
      <p className="text-sm text-neutral-textSecondary">
        Be The Golf {copyrightSymbol} {currentYear} ({appVersion})
      </p>
    </footer>
  )
}

