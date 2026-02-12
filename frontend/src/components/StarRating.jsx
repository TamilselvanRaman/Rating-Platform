import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { clsx } from 'clsx';

const StarRating = ({ rating, onChange, readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
          className={clsx(
            "focus:outline-none transition-colors",
            readOnly ? "cursor-default" : "cursor-pointer"
          )}
        >
          <Star
            className={clsx(
              "h-5 w-5",
              (hoverRating || rating) >= star
                ? "fill-secondary-500 text-secondary-500" 
                : "text-slate-300"
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
