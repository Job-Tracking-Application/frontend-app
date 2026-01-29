import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import "./Chatbot.css";

const Chatbot = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: t('chatbot_intro') }
    ]);
    const [currentQuestionKeys, setCurrentQuestionKeys] = useState(['intro_what', 'intro_start', 'intro_support']);
    const scrollRef = useRef(null);

    const chatbotData = {
        'intro_what': {
            q: t('chatbot_q_what'),
            a: t('chatbot_a_what'),
            next: ['who_is_it_for', 'industry_info', 'is_it_free', 'back_main']
        },
        'intro_start': {
            q: t('chatbot_q_start'),
            a: t('chatbot_a_start'),
            next: ['start_seeker', 'start_recruiter', 'back_main']
        },
        'intro_support': {
            q: t('chatbot_q_support'),
            a: t('chatbot_a_support'),
            next: ['back_main']
        },
        'industry_info': {
            q: t('chatbot_q_industries'),
            a: t('chatbot_a_industries'),
            next: ['who_is_it_for', 'back_main']
        },
        'who_is_it_for': {
            q: t('chatbot_q_whofor'),
            a: t('chatbot_a_whofor'),
            next: ['is_it_free', 'back_main']
        },
        'is_it_free': {
            q: t('chatbot_q_free'),
            a: t('chatbot_a_free'),
            next: ['back_main']
        },
        'start_seeker': {
            q: t('chatbot_q_iamseeker'),
            a: t('chatbot_a_iamseeker'),
            next: ['seeker_resume', 'seeker_track', 'back_main']
        },
        'seeker_resume': {
            q: t('chatbot_q_resume'),
            a: t('chatbot_a_resume'),
            next: ['seeker_track', 'back_main']
        },
        'seeker_track': {
            q: t('chatbot_q_track'),
            a: t('chatbot_a_track'),
            next: ['back_main']
        },
        'start_recruiter': {
            q: t('chatbot_q_iamrecruiter'),
            a: t('chatbot_a_iamrecruiter'),
            next: ['recruiter_edit', 'back_main']
        },
        'recruiter_edit': {
            q: t('chatbot_q_editjob'),
            a: t('chatbot_a_editjob'),
            next: ['back_main']
        },
        'back_main': {
            q: t('chatbot_q_backmain'),
            a: t('chatbot_a_backmain'),
            next: ['intro_what', 'intro_start', 'intro_support']
        }
    };

    const handleQuestionClick = (key) => {
        const item = chatbotData[key];
        const userMessage = { id: Date.now(), type: 'user', text: item.q };
        const botResponse = { id: Date.now() + 1, type: 'bot', text: item.a };

        setMessages(prev => [...prev, userMessage, botResponse]);
        setCurrentQuestionKeys(item.next);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chatbot-container">
            {/* Launcher Button */}
            <button
                className={`chatbot-launcher ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Chat"
            >
                <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'}`}></i>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window glass-card animate-slide-up">
                    <div className="chatbot-header">
                        <div className="d-flex align-items-center gap-2 text-white">
                            <div className="chatbot-avatar">
                                <i className="bi bi-robot"></i>
                            </div>
                            <div>
                                <h6 className="mb-0 fw-bold">{t('chatbot_assistant', 'JobSync Assistant')}</h6>
                                <small className="opacity-75">{t('online', 'Online')}</small>
                            </div>
                        </div>
                    </div>

                    <div className="chatbot-body" ref={scrollRef}>
                        {messages.map(msg => (
                            <div key={msg.id} className={`chat-message ${msg.type}`}>
                                <div className="message-bubble">{msg.text}</div>
                            </div>
                        ))}
                    </div>

                    <div className="chatbot-footer">
                        <p className="text-muted small mb-2 px-1">{t('chatbot_choose_followup')}</p>
                        <div className="quick-actions">
                            {currentQuestionKeys.map((key) => (
                                <button
                                    key={key}
                                    className="btn btn-sm btn-outline-primary mb-1 me-1 rounded-pill"
                                    onClick={() => handleQuestionClick(key)}
                                >
                                    {chatbotData[key].q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
