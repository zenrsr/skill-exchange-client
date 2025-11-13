import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MatchResults from '../components/MatchResults.jsx';
import SessionScheduler from '../components/SessionScheduler.jsx';
import useApi from '../hooks/useApi.js';
import { UserService } from '../services/api.js';

const Matches = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const {
    data: matches = [],
    loading,
    request: fetchMatches,
  } = useApi([]);

  const loadMatches = useCallback(async () => {
    try {
      const data = await fetchMatches(() => UserService.getMatches({ limit: 10 }));
      if (data?.length) {
        setSelectedUser(data[0].user);
      } else {
        setSelectedUser(null);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to load matches';
      toast.error(message);
    }
  }, [fetchMatches]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  return (
    <div className="page grid grid--two">
      <div>
        {loading && <p>Loading matches…</p>}
        <MatchResults
          matches={matches}
          onSchedule={(user) => setSelectedUser(user)}
          onMessage={(user) => navigate('/messages', { state: { participant: user } })}
        />
      </div>
      <SessionScheduler
        selectedUser={selectedUser}
        onScheduled={() => {
          loadMatches();
        }}
      />
    </div>
  );
};

export default Matches;
