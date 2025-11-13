import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import { SessionService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import 'react-datepicker/dist/react-datepicker.css';

const SessionScheduler = ({ selectedUser, onScheduled }) => {
  const { user } = useAuth();
  const [requestedSkill, setRequestedSkill] = useState('');
  const [offeredSkill, setOfferedSkill] = useState('');
  const [scheduledFor, setScheduledFor] = useState(new Date());
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedUser?.skillsOffered?.length) {
      setRequestedSkill(selectedUser.skillsOffered[0].name);
    } else {
      setRequestedSkill('');
    }
  }, [selectedUser]);

  useEffect(() => {
    if (user?.skillsOffered?.length) {
      setOfferedSkill(user.skillsOffered[0].name);
    } else {
      setOfferedSkill('');
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedUser) {
      toast.error('Select a match first');
      return;
    }

    try {
      setLoading(true);
      await SessionService.create({
        partnerId: selectedUser._id,
        requestedSkill,
        offeredSkill,
        scheduledFor,
        durationMinutes,
        notes,
      });
      toast.success('Session scheduled successfully');
      setNotes('');
      onScheduled?.();
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to schedule session';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>Schedule Exchange Session</h2>
      <form className="form mt-md" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="partner">Partner</label>
          <input
            id="partner"
            value={selectedUser ? selectedUser.name : 'Select a match'}
            disabled
            placeholder="Choose a match to begin"
          />
        </div>

        <div className="grid grid--two">
          <div className="form-group">
            <label htmlFor="requestedSkill">Skill to Learn</label>
            <select
              id="requestedSkill"
              value={requestedSkill}
              onChange={(event) => setRequestedSkill(event.target.value)}
              disabled={!selectedUser}
            >
              {selectedUser?.skillsOffered?.map((skill) => (
                <option key={skill.name} value={skill.name}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="offeredSkill">Skill to Teach</label>
            <select
              id="offeredSkill"
              value={offeredSkill}
              onChange={(event) => setOfferedSkill(event.target.value)}
              disabled={!user?.skillsOffered?.length}
            >
              {user?.skillsOffered?.map((skill) => (
                <option key={skill.name} value={skill.name}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid--two">
          <div className="form-group">
            <label>Date & Time</label>
            <DatePicker
              selected={scheduledFor}
              onChange={(date) => date && setScheduledFor(date)}
              showTimeSelect
              timeIntervals={30}
              minDate={new Date()}
              dateFormat="Pp"
            />
          </div>
          <div className="form-group">
            <label htmlFor="duration">Duration (minutes)</label>
            <input
              id="duration"
              type="number"
              min="30"
              max="180"
              step="15"
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(event.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            rows="3"
            placeholder="Goals for this session…"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>

        <button className="btn" type="submit" disabled={loading || !selectedUser}>
          {loading ? 'Scheduling…' : 'Schedule Session'}
        </button>
      </form>
    </section>
  );
};

export default SessionScheduler;
