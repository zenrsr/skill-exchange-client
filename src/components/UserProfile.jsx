import SkillCard from './SkillCard.jsx';

const UserProfile = ({ user, reviews = [] }) => {
  if (!user) return null;

  const ratingValue = user.rating?.average || 0;

  return (
    <section className="panel">
      <div className="user-profile">
        <div className="user-profile__summary">
          <div className="avatar">{user.name?.slice(0, 1).toUpperCase()}</div>
          <div>
            <h2>{user.name}</h2>
            <p className="text-muted">{user.email}</p>
            <p>{user.bio || 'No bio provided yet.'}</p>
            <p className="text-muted">
              {user.location ? `📍 ${user.location}` : 'Location not set'} · TZ {user.timezone}
            </p>
          </div>
        </div>
        <div className="user-profile__rating">
          <p className="rating-number">{ratingValue.toFixed(1)}</p>
          <p className="text-muted">{user.rating?.count || 0} reviews</p>
        </div>
      </div>

      <div className="grid grid--two mt-lg">
        <div>
          <h3>Skills Offered</h3>
          <div className="stack">
            {user.skillsOffered?.length ? (
              user.skillsOffered.map((skill) => (
                <SkillCard key={skill.name} skill={skill} variant="offered" />
              ))
            ) : (
              <p className="text-muted">Add skills you can teach.</p>
            )}
          </div>
        </div>
        <div>
          <h3>Skills Wanted</h3>
          <div className="stack">
            {user.skillsWanted?.length ? (
              user.skillsWanted.map((skill) => (
                <SkillCard key={skill.name} skill={skill} variant="wanted" />
              ))
            ) : (
              <p className="text-muted">Add skills you would like to learn.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-lg">
        <h3>Availability</h3>
        <div className="availability">
          {user.availability?.length ? (
            user.availability.map((slot) => (
              <div key={`${slot.dayOfWeek}-${slot.timezone}`} className="availability__item">
                <p className="availability__day">{slot.dayOfWeek?.toUpperCase()}</p>
                <p>{slot.slots?.join(', ')}</p>
                <p className="text-muted">{slot.timezone}</p>
              </div>
            ))
          ) : (
            <p className="text-muted">Set when you are available to exchange sessions.</p>
          )}
        </div>
      </div>

      {!!reviews.length && (
        <div className="mt-lg">
          <h3>Recent Feedback</h3>
          <div className="stack">
            {reviews.map((review) => (
              <div key={review._id} className="review">
                <p className="review__rating">{'★'.repeat(review.rating)}</p>
                <p>{review.comment}</p>
                <p className="text-muted">By {review.reviewer?.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default UserProfile;
