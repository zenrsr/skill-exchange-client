import { useLocation } from 'react-router-dom';
import MessageCenter from '../components/MessageCenter.jsx';

const Messages = () => {
  const location = useLocation();
  const initialParticipant = location.state?.participant || null;

  return (
    <div className="page">
      <MessageCenter initialParticipant={initialParticipant} />
    </div>
  );
};

export default Messages;
