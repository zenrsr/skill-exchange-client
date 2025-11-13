const Loader = ({ label = 'Loading' }) => (
  <div className="loader">
    <span className="loader__dot" />
    <span className="loader__dot" />
    <span className="loader__dot" />
    <p>{label}…</p>
  </div>
);

export default Loader;
