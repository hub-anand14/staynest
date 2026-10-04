export default function SkeletonCard() {
  return (
    <div className="card listing-card skeleton-card" aria-hidden="true">
      <div className="skeleton-box skeleton-img" />
      <div className="card-body">
        <div className="row-between">
          <div className="skeleton-box skeleton-tag" />
          <div className="skeleton-box skeleton-rating" />
        </div>
        <div className="skeleton-box skeleton-title" />
        <div className="skeleton-box skeleton-subtitle" />
        <div className="skeleton-box skeleton-price" />
      </div>
    </div>
  );
}
