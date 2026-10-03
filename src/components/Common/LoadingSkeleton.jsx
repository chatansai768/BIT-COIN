import './LoadingSkeleton.css';

export const TableSkeleton = ({ rows = 10 }) => {
  return (
    <div className="skeleton-table">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="skeleton-row">
          <div className="skeleton-cell skeleton-rank"></div>
          <div className="skeleton-cell skeleton-coin">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-text skeleton-name"></div>
          </div>
          <div className="skeleton-cell skeleton-price"></div>
          <div className="skeleton-cell skeleton-change"></div>
          <div className="skeleton-cell skeleton-marketcap"></div>
        </div>
      ))}
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="skeleton-chart-container">
      <div className="skeleton-chart-header">
        <div className="skeleton-pill"></div>
        <div className="skeleton-btn-group"></div>
      </div>
      <div className="skeleton-chart-body">
        <div className="skeleton-wave"></div>
      </div>
    </div>
  );
};

export default TableSkeleton;

