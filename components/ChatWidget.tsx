"use client";

import React, { useState } from 'react';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import { sendChatQuery } from '@/lib/api';

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [history, setHistory] = useState<{ role: 'user' | 'bot', text: string }[]>([
        { role: 'bot', text: 'Hola, soy tu asistente de Gobernanza. ¿En qué puedo ayudarte hoy?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMessage = message;
        setMessage("");
        setHistory(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const data = await sendChatQuery(userMessage);
            setHistory(prev => [...prev, { role: 'bot', text: data.response }]);
        } catch (error) {
            setHistory(prev => [...prev, { role: 'bot', text: "Lo siento, tuve un problema al conectar con el cerebro del sistema." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-80 md:w-96 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Bot size={20} />
                            <span className="font-semibold">Governance AI</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 h-80 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950">
                        {history.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-none text-slate-800 dark:text-slate-200 shadow-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-2xl rounded-tl-none animate-pulse">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Escribe tu duda..."
                                className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-all duration-300 group"
                >
                    <MessageSquare className="group-hover:rotate-12 transition-transform" />
                </button>
            )}
        </div>
    );
}
