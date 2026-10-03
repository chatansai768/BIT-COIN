import { AlertTriangle, RefreshCw } from 'lucide-react';
import './ErrorState.css';

const ErrorState = ({ message, onRetry, compact = false }) => {
  return (
    <div className={`error-state-box ${compact ? 'compact' : ''}`}>
      <div className="error-icon-wrap">
        <AlertTriangle size={compact ? 24 : 36} className="error-icon" />
      </div>
      <div className="error-text">
        <h3>Something went wrong</h3>
        <p>{message || 'Unable to fetch cryptocurrency data. Please check your network or try again in a moment.'}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="retry-btn">
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;

