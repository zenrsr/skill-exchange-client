const MatchResults = ({ matches = [], onSchedule, onMessage }) => {
  if (!matches.length) {
    return (
      <section className="panel">
        <p>No matches yet. Update your skills to improve recommendations.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>Potential Skill Matches</h2>
      <div className="stack mt-md">
        {matches.map((match) => (
          <div key={match.user._id} className="match-card">
            <div className="match-card__header">
              <div>
                <h3>{match.user.name}</h3>
                <p className="text-muted">{match.user.bio || 'No bio yet'}</p>
              </div>
              <span className="badge">Score {match.score}</span>
            </div>
            <div className="match-card__skills">
              <p>
                They teach:{' '}
                <strong>{match.offeredMatches.length ? match.offeredMatches.join(', ') : 'N/A'}</strong>
              </p>
              <p>
                They want:{' '}
                <strong>
                  {match.reciprocalMatches.length ? match.reciprocalMatches.join(', ') : 'N/A'}
                </strong>
              </p>
            </div>
            <div className="match-card__actions">
              <button className="btn" onClick={() => onSchedule(match.user)}>
                Schedule Session
              </button>
              <button className="btn btn--ghost" onClick={() => onMessage(match.user)}>
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MatchResults;
