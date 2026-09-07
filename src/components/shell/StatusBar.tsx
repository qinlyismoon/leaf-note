import { useEffect, useState } from 'react';

function formatClock(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });
}

export function StatusBar() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="status-bar" aria-hidden="true">
      <span className="status-bar__time">{formatClock(now)}</span>
      <span className="status-bar__island" />
      <span className="status-bar__icons">
        <svg className="status-bar__signal" viewBox="0 0 18 12" aria-hidden="true">
          <rect x="0" y="8" width="3" height="4" rx="0.5" fill="currentColor" />
          <rect x="5" y="5" width="3" height="7" rx="0.5" fill="currentColor" />
          <rect x="10" y="2" width="3" height="10" rx="0.5" fill="currentColor" />
          <rect x="15" y="0" width="3" height="12" rx="0.5" fill="currentColor" opacity="0.35" />
        </svg>
        <svg className="status-bar__wifi" viewBox="0 0 16 12" aria-hidden="true">
          <path
            d="M8 10.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm0-3.2c1.5 0 2.9.6 3.9 1.6l-1.3 1.3A3.7 3.7 0 0 0 8 9c-.9 0-1.7.3-2.4.8L4.3 8.5A5.3 5.3 0 0 1 8 7.3Zm0-3.3c2.4 0 4.6 1 6.2 2.6L12.9 8A6.8 6.8 0 0 0 8 6.2 6.8 6.8 0 0 0 3.1 8L1.8 6.6A9.1 9.1 0 0 1 8 4Z"
            fill="currentColor"
          />
        </svg>
        <span className="status-bar__battery">
          <span className="status-bar__battery-body">
            <span className="status-bar__battery-level" />
          </span>
          <span className="status-bar__battery-cap" />
        </span>
      </span>
    </div>
  );
}
