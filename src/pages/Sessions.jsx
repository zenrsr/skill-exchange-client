import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ReviewForm from '../components/ReviewForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { SessionService } from '../services/api.js';

const Sessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [reviewingSession, setReviewingSession] = useState(null);

  const userId = (user?._id || user?.id || '').toString();

  const loadSessions = async () => {
    try {
      const { data } = await SessionService.list();
      setSessions(data);
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to load sessions';
      toast.error(message);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleStatusUpdate = async (sessionId, status) => {
    try {
      await SessionService.updateStatus(sessionId, status);
      toast.success(`Session ${status}`);
      loadSessions();
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to update session';
      toast.error(message);
    }
  };

  const startReview = (session) => {
    setReviewingSession({ ...session, currentUserId: userId });
  };

  return (
    <div className="page">
      <h1>My Sessions</h1>
      <div className="stack mt-lg">
        {sessions.map((session) => {
          const initiatorId = session.initiator?._id || session.initiator;
          const partner =
            initiatorId?.toString() === userId ? session.partner?.name : session.initiator?.name;
          return (
            <div key={session._id} className="session-card session-card--detailed">
              <div>
                <p className="session-card__title">
                  {session.requestedSkill} ↔ {session.offeredSkill}
                </p>
                <p className="text-muted">
                  With {partner} · {new Date(session.scheduledFor).toLocaleString()}
                </p>
                <p className="badge badge--muted">{session.status}</p>
              </div>
              <div className="session-card__actions">
                {session.status === 'pending' && (
                  <>
                    <button className="btn btn--ghost" onClick={() => handleStatusUpdate(session._id, 'cancelled')}>
                      Cancel
                    </button>
                    <button className="btn" onClick={() => handleStatusUpdate(session._id, 'confirmed')}>
                      Confirm
                    </button>
                  </>
                )}
                {session.status === 'confirmed' && (
                  <button className="btn" onClick={() => handleStatusUpdate(session._id, 'completed')}>
                    Mark Complete
                  </button>
                )}
                {session.status === 'completed' && (
                  <button className="btn" onClick={() => startReview(session)}>
                    Review
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {reviewingSession && (
        <div className="panel mt-lg">
          <div className="panel__header">
            <h2>Share Feedback</h2>
            <button className="btn btn--ghost" onClick={() => setReviewingSession(null)}>
              Close
            </button>
          </div>
          <ReviewForm
            session={reviewingSession}
            onSubmitted={() => {
              setReviewingSession(null);
              loadSessions();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Sessions;
