import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MessageService } from '../services/api.js';

const MessageCenter = ({ initialParticipant }) => {
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [compose, setCompose] = useState('');
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);

  const loadThreads = async () => {
    try {
      setLoadingThreads(true);
      const { data } = await MessageService.threads();
      setThreads(data);
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to load conversations';
      toast.error(message);
    } finally {
      setLoadingThreads(false);
    }
  };

  const fetchConversation = async (participantId) => {
    try {
      setLoadingConversation(true);
      const { data } = await MessageService.conversation(participantId);
      setMessages(data);
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to load conversation';
      toast.error(message);
    } finally {
      setLoadingConversation(false);
    }
  };

  const openConversation = (participant) => {
    setActiveThread(participant);
    fetchConversation(participant._id);
  };

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    if (initialParticipant) {
      openConversation(initialParticipant);
    }
  }, [initialParticipant]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!activeThread || !compose.trim()) return;

    try {
      await MessageService.send(activeThread._id, {
        content: compose.trim(),
      });
      setCompose('');
      fetchConversation(activeThread._id);
      loadThreads();
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to send message';
      toast.error(message);
    }
  };

  return (
    <section className="panel">
      <h2>Message Center</h2>
      <div className="message-center">
        <aside className="message-center__threads">
          <p className="text-muted mb-sm">Conversations</p>
          {loadingThreads && <p>Loading…</p>}
          {!threads.length && !loadingThreads && <p>No conversations yet.</p>}
          <div className="stack">
            {threads.map((thread) => (
              <button
                key={thread.participant._id}
                className={
                  activeThread?._id === thread.participant._id
                    ? 'thread thread--active'
                    : 'thread'
                }
                onClick={() => openConversation(thread.participant)}
              >
                <p className="thread__name">{thread.participant.name}</p>
                <p className="thread__preview">
                  {thread.lastMessage?.content || 'No messages yet'}
                </p>
              </button>
            ))}
          </div>
        </aside>

        <div className="message-center__conversation">
          {activeThread ? (
            <>
              <div className="conversation__header">
                <h3>{activeThread.name}</h3>
                <p className="text-muted">Coordinate details before confirming sessions.</p>
              </div>
              <div className="conversation__body">
                {loadingConversation ? (
                  <p>Loading conversation…</p>
                ) : (
                  messages.map((message) => {
                    const senderId = message.sender?._id || message.sender;
                    const isIncoming = senderId === activeThread._id;
                    return (
                      <div
                        key={message._id}
                        className={isIncoming ? 'message message--incoming' : 'message message--outgoing'}
                      >
                        <p>{message.content}</p>
                        <span className="text-muted">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
              <form className="conversation__composer" onSubmit={handleSend}>
                <input
                  type="text"
                  placeholder="Type your message"
                  value={compose}
                  onChange={(event) => setCompose(event.target.value)}
                />
                <button className="btn" type="submit" disabled={!compose.trim() || !activeThread}>
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="conversation__placeholder">
              <p>Select a conversation to get started.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MessageCenter;
