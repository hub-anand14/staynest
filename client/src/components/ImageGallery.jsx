import { useEffect, useState } from 'react';

export default function ImageGallery({ images = [], title = 'Stay' }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const validImages = Array.isArray(images) && images.length > 0
    ? images.filter(Boolean)
    : [];

  const displayImages = validImages.length > 0
    ? validImages
    : ['https://placehold.co/800x500?text=StayNest'];

  const prev = () => {
    setActiveIndex((curr) => (curr === 0 ? displayImages.length - 1 : curr - 1));
  };

  const next = () => {
    setActiveIndex((curr) => (curr === displayImages.length - 1 ? 0 : curr + 1));
  };

  useEffect(() => {
    if (displayImages.length <= 1) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayImages.length]);

  return (
    <div className="gallery" role="region" aria-label="Image gallery">
      <div className="gallery-main">
        <img
          className="hero-img"
          src={displayImages[activeIndex]}
          alt={`${title} - photo ${activeIndex + 1}`}
        />
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              className="gallery-btn gallery-prev"
              onClick={prev}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              className="gallery-btn gallery-next"
              onClick={next}
              aria-label="Next image"
            >
              ›
            </button>
            <span className="gallery-counter">
              {activeIndex + 1} / {displayImages.length}
            </span>
          </>
        )}
      </div>

      {displayImages.length > 1 && (
        <div className="gallery-thumbs" role="tablist" aria-label="Image thumbnails">
          {displayImages.map((img, i) => (
            <button
              key={i}
              type="button"
              className={`gallery-thumb ${i === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`View photo ${i + 1}`}
              aria-selected={i === activeIndex}
            >
              <img src={img} alt={`Thumbnail ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
