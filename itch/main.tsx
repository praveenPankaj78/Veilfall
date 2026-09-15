import { Component, useEffect, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import GamePage from '../app/page';
import '../app/globals.css';

class ReleaseErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Veilfall could not start.', error, info);
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="static-loading" role="alert">
          <strong>Veilfall could not start.</strong>
          <p>
            Reload the page to try again. Your browser save has not been
            removed.
          </p>
        </main>
      );
    }

    return this.props.children;
  }
}

const root = document.getElementById('root');

if (!root) throw new Error('The Veilfall application root is missing.');

function BootComplete() {
  useEffect(() => {
    document.getElementById('boot-screen')?.remove();
    window.dispatchEvent(new Event('veilfall-ready'));
  }, []);
  return null;
}

createRoot(root).render(
  <ReleaseErrorBoundary>
    <GamePage />
    <BootComplete />
  </ReleaseErrorBoundary>,
);
