import React, { useState, useEffect } from 'react';

interface ChatboxProps {
  isOpen: boolean;
  onClose: () => void;
  openChatbox: () => void;
}

const Chatbox: React.FC<ChatboxProps> = ({ isOpen, onClose, openChatbox }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [message, setMessage] = useState("");
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      setMessages([...messages, { sender: 'user', text: message }]);
      setMessage("");
    }
  };

  const handleChatboxOpen = () => {
    openChatbox();
    setIsButtonVisible(false);
  };

  const handleChatboxClose = () => {
    onClose();
    setIsButtonVisible(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = { sender: 'max', text: "Hi there! How can I assist you today?" };
      setMessages([welcomeMessage]);
    } else if (messages.length === 1 && messages[0].sender === 'user') {
      setTimeout(() => {
        const maxMessage = { sender: 'max', text: "Apologies for the brief delay, I'll be with you shortly." };
        setMessages([...messages, maxMessage]);
      }, 2000); 
    }
  }, [isOpen, messages]);

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg p-8 border border-purple-600 max-w-md w-full shadow-lg" style={{ zIndex: 9999 }}>
          <h2 className="text-2xl font-bold mb-4 text-purple-600 border-b-2 border-purple-600 pb-2">Live Support 🌟</h2>
          <div className="overflow-y-auto max-h-72 mb-4">
            {messages.map((msg, index) => (
              <div key={index} className="text-gray-600 mb-2">
                <span className="text-purple-600 font-semibold mr-2">{msg.sender === 'user' ? 'You:' : 'Max:'}</span>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
              className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none"
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-r-lg">Send</button>
          </div>
          <button onClick={handleChatboxClose} className="absolute top-2 right-2 bg-purple-600 hover:bg-purple-700 text-white py-1 px-2 rounded-full text-xs">X</button>
        </div>
      )}

      {isButtonVisible && (
        <div className="fixed bottom-6 right-6 p-6 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full text-white hover:scale-110 transition-transform duration-300 transform cursor-pointer flex items-center justify-center shadow-lg" onClick={handleChatboxOpen} style={{ zIndex: "9999" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 1.1-.9 2-2 2h-6l-4 5v-5H5c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v6z" />
          </svg>
        </div>
      )}
    </>
  );
};

export default Chatbox;
