import React, { useState, useRef, useEffect } from 'react';
import "./Chatbot.css";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: 'Hi! I\'m Sync, your JobSync assistant. How can I help you today?' }
    ]);
    const [currentQuestionKeys, setCurrentQuestionKeys] = useState(['intro_what', 'intro_start', 'intro_support']);
    const scrollRef = useRef(null);

    const chatbotData = {
        'intro_what': {
            q: 'What is JobSync?',
            a: 'JobSync is a premium recruitment platform that connects top talent with innovative companies through smart matching.',
            next: ['who_is_it_for', 'industry_info', 'is_it_free', 'back_main']
        },
        'intro_start': {
            q: 'How do I get started?',
            a: 'First, you need to create an account. Which role best describes you?',
            next: ['start_seeker', 'start_recruiter', 'back_main']
        },
        'intro_support': {
            q: 'How can I contact support?',
            a: 'You can reach us at support@jobsync.com or through your account settings.',
            next: ['back_main']
        },
        'industry_info': {
            q: 'What industries are covered?',
            a: 'We cover a wide range of industries including Tech, Finance, Healthcare, Engineering, and Design.',
            next: ['who_is_it_for', 'back_main']
        },
        'who_is_it_for': {
            q: 'Who is it for?',
            a: 'It\'s for both Job Seekers looking for their dream role and Recruiters searching for top talent.',
            next: ['is_it_free', 'back_main']
        },
        'is_it_free': {
            q: 'Is it free?',
            a: 'Yes! It is 100% free for Job Seekers. Recruiters have various plans to choose from.',
            next: ['back_main']
        },
        'start_seeker': {
            q: 'I am a Job Seeker',
            a: 'Great! Sign up, complete your profile, and start applying to jobs that match your skills.',
            next: ['seeker_resume', 'seeker_track', 'back_main']
        },
        'seeker_resume': {
            q: 'How to upload resume?',
            a: 'Once logged in, go to your Profile page and you will find the "Resume" section where you can upload a PDF or DOCX file.',
            next: ['seeker_track', 'back_main']
        },
        'seeker_track': {
            q: 'How to track applications?',
            a: 'Visit the "My Applications" tab in your dashboard to see the real-time status of all your job applications.',
            next: ['back_main']
        },
        'start_recruiter': {
            q: 'I am a Recruiter',
            a: 'Welcome! Register your company, post your first job, and manage applications from your dashboard.',
            next: ['recruiter_edit', 'back_main']
        },
        'recruiter_edit': {
            q: 'Can I edit a posted job?',
            a: 'Yes! You can edit any of your active job postings at any time from the "Manage Jobs" section of your dashboard.',
            next: ['back_main']
        },
        'back_main': {
            q: 'Back to main menu',
            a: 'Sure, what else can I help you with?',
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
                                <h6 className="mb-0 fw-bold">JobSync Assistant</h6>
                                <small className="opacity-75">Online</small>
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
                        <p className="text-muted small mb-2 px-1">Choose a follow-up:</p>
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
