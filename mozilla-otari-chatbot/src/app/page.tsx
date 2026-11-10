'use client';

import React, { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) throw new Error('Failed to fetch from chat API');

      const data = await res.json();
      // Handle non-streaming or stream response here
      // For simplicity let's append assistant response
      setMessages([...updatedMessages, { role: 'assistant', content: data.choices?.[0]?.message?.content || 'Response received.' }]);
    } catch (err: any) {
      setMessages([...updatedMessages, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-4">
      <header className="mb-4 border-b border-gray-800 pb-2">
        <h1 className="text-xl font-bold">Mozilla Otari Chatbot</h1>
        <p className="text-sm text-gray-400">Powered by Otari AI Gateway</p>
      </header>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2 bg-gray-950 rounded-lg">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">Start a conversation with Otari Gateway...</div>
        )}
        {messages.map((m, idx) => (
          <div key={idx} className={`p-3 rounded-lg max-w-xl ${m.role === 'user' ? 'bg-blue-600 ml-auto' : 'bg-gray-800 mr-auto'}`}>
            <span className="font-semibold block text-xs text-gray-400 mb-1">{m.role === 'user' ? 'You' : 'Otari'}</span>
            <p className="whitespace-pre-wrap">{m.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
