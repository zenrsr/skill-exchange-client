import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import SessionScheduler from '../components/SessionScheduler.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { SessionService, UserService } from '../services/api.js';

const Dashboard = () => {
  const { user } = useAuth();
  const currentUserId = (user?._id || user?.id || '').toString();
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [highlightedPartner, setHighlightedPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsResponse, sessionsResponse, matchesResponse] = await Promise.all([
        UserService.getStats(),
        SessionService.list(),
        UserService.getMatches({ limit: 1 }),
      ]);
      setStats(statsResponse.data);
      setSessions(sessionsResponse.data);
      setHighlightedPartner(matchesResponse.data[0]?.user || null);
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to load dashboard data';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const upcomingSessions = sessions.filter(
    (session) => new Date(session.scheduledFor) > new Date()
  );

  return (
    <div className="page">
      <h1>Hello {user?.name?.split(' ')[0] || 'there'} 👋</h1>
      <p className="text-muted mb-lg">Here is a snapshot of your learning exchanges.</p>

      <div className="grid grid--three">
        <div className="stat-card">
          <p>Upcoming</p>
          <h2>{stats?.upcomingSessions ?? '—'}</h2>
        </div>
        <div className="stat-card">
          <p>Pending Approvals</p>
          <h2>{stats?.pendingSessions ?? '—'}</h2>
        </div>
        <div className="stat-card">
          <p>Completed</p>
          <h2>{stats?.completedSessions ?? '—'}</h2>
        </div>
      </div>

      <div className="grid grid--two mt-lg">
        <section className="panel">
          <div className="panel__header">
            <div>
              <h2>Next Sessions</h2>
              <p className="text-muted">Keep track of what’s coming up.</p>
            </div>
          </div>
          {loading && <p>Loading sessions…</p>}
          {!loading && !upcomingSessions.length && <p>No upcoming sessions yet.</p>}
          <div className="stack">
            {upcomingSessions.slice(0, 3).map((session) => (
              <div key={session._id} className="session-card">
                <div>
                  <p className="session-card__date">
                    {new Date(session.scheduledFor).toLocaleString()}
                  </p>
                  <p className="session-card__title">
                    {session.requestedSkill} ↔ {session.offeredSkill}
                  </p>
                  <p className="text-muted">
                    With{' '}
                    {(session.initiator?._id || session.initiator)?.toString() === currentUserId
                      ? session.partner?.name
                      : session.initiator?.name}
                  </p>
                </div>
                <span className={`badge badge--${session.status}`}>{session.status}</span>
              </div>
            ))}
          </div>
        </section>

        <SessionScheduler
          selectedUser={highlightedPartner}
          onScheduled={() => {
            loadData();
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
