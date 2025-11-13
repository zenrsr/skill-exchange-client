import { useState } from 'react';
import { toast } from 'react-toastify';
import { ReviewService } from '../services/api.js';

const ReviewForm = ({ session, onSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!session) return null;

  const initiatorId = session.initiator?._id || session.initiator;
  const partnerName =
    initiatorId?.toString() === session.currentUserId
      ? session.partner?.name
      : session.initiator?.name;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await ReviewService.create({
        sessionId: session._id,
        rating,
        comment,
      });
      toast.success('Review submitted');
      setComment('');
      onSubmitted?.();
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to submit review';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form review-form" onSubmit={handleSubmit}>
      <p className="text-muted">Review your session with {partnerName}</p>
      <div className="form-group">
        <label>Rating</label>
        <div className="rating-input">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className={value <= rating ? 'star star--active' : 'star'}
              onClick={() => setRating(value)}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor={`comment-${session._id}`}>Feedback</label>
        <textarea
          id={`comment-${session._id}`}
          rows="3"
          maxLength="500"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Share what went well or what to improve"
        />
      </div>
      <button className="btn" type="submit" disabled={loading}>
        {loading ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
