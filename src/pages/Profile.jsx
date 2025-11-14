import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import UserProfile from '../components/UserProfile.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { UserService } from '../services/api.js';

const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const Profile = () => {
  const { user, setUser } = useAuth();
  const userId = user?._id || user?.id;
  const [reviews, setReviews] = useState([]);
  const [profile, setProfile] = useState({
    bio: '',
    location: '',
    timezone: 'UTC',
    skillsOffered: [],
    skillsWanted: [],
    availability: [],
    rating: { average: 0, count: 0 },
  });

  const [newOfferedSkill, setNewOfferedSkill] = useState({
    name: '',
    level: 'beginner',
    experienceYears: 1,
  });

  const [newWantedSkill, setNewWantedSkill] = useState({
    name: '',
    level: 'beginner',
    experienceYears: 0,
  });

  const [availabilityEntry, setAvailabilityEntry] = useState({
    dayOfWeek: 'mon',
    slots: '09:00-10:00',
    timezone: 'UTC',
  });

  useEffect(() => {
    if (user) {
      setProfile({
        bio: user.bio || '',
        location: user.location || '',
        timezone: user.timezone || 'UTC',
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || [],
        availability: user.availability || [],
        rating: user.rating || { average: 0, count: 0 },
      });
      setAvailabilityEntry((prev) => ({ ...prev, timezone: user.timezone || 'UTC' }));
    }
  }, [user]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!userId) return;
      try {
        const { data } = await UserService.getReviews(userId);
        setReviews(data);
      } catch (error) {
        // ignore for now
      }
    };
    fetchReviews();
  }, [userId]);

  const updateProfileField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = (type, skill) => {
    if (!skill.name.trim()) {
      toast.error('Please provide a skill name');
      return;
    }
    setProfile((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        {
          name: skill.name.trim(),
          level: skill.level,
          experienceYears: Number(skill.experienceYears) || 0,
        },
      ],
    }));
  };

  const removeSkill = (type, index) => {
    setProfile((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, idx) => idx !== index),
    }));
  };

  const addAvailability = () => {
    if (!availabilityEntry.slots.trim()) {
      toast.error('Add at least one slot');
      return;
    }
    setProfile((prev) => ({
      ...prev,
      availability: [
        ...prev.availability,
        {
          dayOfWeek: availabilityEntry.dayOfWeek,
          timezone: availabilityEntry.timezone,
          slots: availabilityEntry.slots
            .split(',')
            .map((slot) => slot.trim())
            .filter(Boolean),
        },
      ],
    }));
  };

  const removeAvailability = (index) => {
    setProfile((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { rating, ...payload } = profile;
      const { data } = await UserService.updateProfile(payload);
      setUser(data);
      setProfile({
        bio: data.bio || '',
        location: data.location || '',
        timezone: data.timezone || 'UTC',
        skillsOffered: data.skillsOffered || [],
        skillsWanted: data.skillsWanted || [],
        availability: data.availability || [],
        rating: data.rating || { average: 0, count: 0 },
      });
      toast.success('Profile updated');
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to update profile';
      toast.error(message);
    }
  };

  return (
    <div className="page grid grid--two">
      <div>
        <UserProfile user={profile} reviews={reviews} />
      </div>
      <section className="panel">
        <div className="panel__header">
          <h2>Edit Profile</h2>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              rows="3"
              maxLength="300"
              value={profile.bio}
              onChange={(event) => updateProfileField('bio', event.target.value)}
            />
          </div>
          <div className="grid grid--two">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                value={profile.location}
                onChange={(event) => updateProfileField('location', event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="timezone">Timezone</label>
              <input
                id="timezone"
                value={profile.timezone}
                onChange={(event) => updateProfileField('timezone', event.target.value)}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Skills Offered</h3>
            <div className="stack">
              {profile.skillsOffered.map((skill, index) => (
                <div key={`${skill.name}-${index}`} className="chip">
                  {skill.name} ({skill.level})
                  <button type="button" onClick={() => removeSkill('skillsOffered', index)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid--three mt-md">
              <input
                placeholder="Skill name"
                value={newOfferedSkill.name}
                onChange={(event) =>
                  setNewOfferedSkill((prev) => ({ ...prev, name: event.target.value }))
                }
              />
              <select
                value={newOfferedSkill.level}
                onChange={(event) =>
                  setNewOfferedSkill((prev) => ({ ...prev, level: event.target.value }))
                }
              >
                {skillLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                max="50"
                placeholder="Years"
                value={newOfferedSkill.experienceYears}
                onChange={(event) =>
                  setNewOfferedSkill((prev) => ({ ...prev, experienceYears: event.target.value }))
                }
              />
            </div>
            <button
              className="btn btn--ghost mt-sm"
              type="button"
              onClick={() => {
                addSkill('skillsOffered', newOfferedSkill);
                setNewOfferedSkill({ name: '', level: 'beginner', experienceYears: 1 });
              }}
            >
              Add Skill
            </button>
          </div>
          <div className="form-section">
            <h3>Skills Wanted</h3>
            <div className="stack">
              {profile.skillsWanted.map((skill, index) => (
                <div key={`${skill.name}-${index}`} className="chip chip--muted">
                  {skill.name} ({skill.level})
                  <button type="button" onClick={() => removeSkill('skillsWanted', index)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid--three mt-md">
              <input
                placeholder="Skill name"
                value={newWantedSkill.name}
                onChange={(event) =>
                  setNewWantedSkill((prev) => ({ ...prev, name: event.target.value }))
                }
              />
              <select
                value={newWantedSkill.level}
                onChange={(event) =>
                  setNewWantedSkill((prev) => ({ ...prev, level: event.target.value }))
                }
              >
                {skillLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                max="50"
                placeholder="Years"
                value={newWantedSkill.experienceYears}
                onChange={(event) =>
                  setNewWantedSkill((prev) => ({ ...prev, experienceYears: event.target.value }))
                }
              />
            </div>
            <button
              className="btn btn--ghost mt-sm"
              type="button"
              onClick={() => {
                addSkill('skillsWanted', newWantedSkill);
                setNewWantedSkill({ name: '', level: 'beginner', experienceYears: 0 });
              }}
            >
              Add Interest
            </button>
          </div>

          <div className="form-section">
            <h3>Availability</h3>
            <div className="stack">
              {profile.availability.map((slot, index) => (
                <div key={`${slot.dayOfWeek || 'day'}-${index}`} className="availability__item">
                  <div>
                    <p className="availability__day">{slot.dayOfWeek?.toUpperCase() || 'N/A'}</p>
                    <p>{slot.slots?.join(', ') || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-muted">{slot.timezone}</p>
                    <button type="button" className="btn btn--ghost" onClick={() => removeAvailability(index)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid--three mt-md">
              <select
                value={availabilityEntry.dayOfWeek}
                onChange={(event) =>
                  setAvailabilityEntry((prev) => ({ ...prev, dayOfWeek: event.target.value }))
                }
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day.toUpperCase()}
                  </option>
                ))}
              </select>
              <input
                value={availabilityEntry.slots}
                onChange={(event) =>
                  setAvailabilityEntry((prev) => ({ ...prev, slots: event.target.value }))
                }
                placeholder="09:00-10:00, 14:00-15:00"
              />
              <input
                value={availabilityEntry.timezone}
                onChange={(event) =>
                  setAvailabilityEntry((prev) => ({ ...prev, timezone: event.target.value }))
                }
                placeholder="UTC"
              />
            </div>
            <button
              className="btn btn--ghost mt-sm"
              type="button"
              onClick={() => {
                addAvailability();
                setAvailabilityEntry((prev) => ({ ...prev, slots: '' }));
              }}
            >
              Add Availability
            </button>
          </div>

          <button className="btn mt-lg" type="submit">
            Save Changes
          </button>
        </form>
      </section>
    </div>
  );
};

export default Profile;
