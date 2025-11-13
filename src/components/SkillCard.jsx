const SkillCard = ({ skill, variant = 'offered' }) => {
  if (!skill) return null;

  return (
    <div className={`skill-card skill-card--${variant}`}>
      <div>
        <p className="skill-card__title">{skill.name}</p>
        <p className="skill-card__level">{skill.level}</p>
      </div>
      {typeof skill.experienceYears === 'number' && (
        <p className="skill-card__meta">{skill.experienceYears} yrs exp</p>
      )}
    </div>
  );
};

export default SkillCard;
