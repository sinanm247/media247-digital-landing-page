import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { sendContactFormEmail, sendChatbotToGoogleSheets } from "../../../Utils/emailService";
import "./Chatbot.scss";
import chatbotAvatar from "../../../assets/Common/hina-dp.jpg";
import chatbotIcon from "../../../assets/Common/chatbot-icon.png";
import { TbMessageChatbot } from "react-icons/tb";

const OPTION_LABELS = {
    "primary-sale": "Primary Sale",
    "off-plan": "Off-Plan Properties",
    "under-construction": "Under Construction Properties",
    "resale": "Resale",
    "refinance-equity": "Refinance / Equity",
    "buyout": "Buyout",
};

const SERVICES = [
    { id: "primary-sale", label: "Primary Sale", description: "Properties sold by the developer directly for the first time" },
    { id: "off-plan", label: "Off-Plan Properties", description: "Mortgages for unfinished properties and off-plan investments" },
    { id: "under-construction", label: "Under Construction Properties", description: "Financial assistance for properties still under development" },
    { id: "resale", label: "Resale", description: "Low-documentation mortgage offerings for resale properties" },
    { id: "refinance-equity", label: "Refinance / Equity", description: "Refinance your mortgage or release equity from your home" },
    { id: "buyout", label: "Buyout", description: "Transfer your home loan to another bank for better rates" },
];

// Auto-open intervals in milliseconds: 10sec, 30sec, 1min, 2min, 5min, 10min, 15min, 30min
const AUTO_OPEN_INTERVALS = [10000, 30000, 60000, 120000, 300000, 600000, 900000, 1800000];

const CHATBOT_CLOSE_COUNT_KEY = 'chatbotCloseCount';
const CHATBOT_LAST_CLOSE_TIME_KEY = 'chatbotLastCloseTime';

export default function Chatbot() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [messages, setMessages] = useState([]);
    const [nameInput, setNameInput] = useState("");
    const [hasAutoOpened, setHasAutoOpened] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [phoneQuestionAsked, setPhoneQuestionAsked] = useState(false);
    const [nameQuestionAsked, setNameQuestionAsked] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [closeCount, setCloseCount] = useState(() => {
        if (typeof window !== "undefined") {
            return parseInt(localStorage.getItem(CHATBOT_CLOSE_COUNT_KEY) || '0');
        }
        return 0;
    });
    
    // Chatbot data state
    const [chatData, setChatData] = useState({
        name: "",
        phone: "",
        selectedService: null,
        interestedBefore: null,
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
    });

    const chatContentRef = useRef(null);
    const nameInputRef = useRef(null);
    const phoneInputRef = useRef(null);
    const hasInitialized = useRef(false);

    // Determine current step function
    const getCurrentStep = () => {
        if (!chatData.name) return "name-input";
        if (!chatData.selectedService) return "welcome";
        if (chatData.interestedBefore === null) return "interested-before";
        // If form has been submitted, stay in complete state
        if (isFormSubmitted) return "complete";
        // Keep phone-input step active until form is submitted (isSubmitting handles that)
        if (!isSubmitting && (!chatData.phone || chatData.phone.length < 10)) return "phone-input";
        // Only show complete if we're actually submitting
        if (isSubmitting) return "complete";
        // Default to phone-input if we have phone but not submitting yet
        return "phone-input";
    };

    const currentStep = getCurrentStep();

    // Initialize messages on mount - staggered for more natural feel
    useEffect(() => {
        if (messages.length === 0 && !hasInitialized.current) {
            hasInitialized.current = true;
            // First message appears immediately
            setMessages([
                {
                    type: "bot",
                    content: "Hello! I'm Hina Ali 👋 Welcome to Indeed Mortgage Broker. I'm here to help you find the perfect mortgage solution for your needs!",
                    timestamp: new Date(),
                },
            ]);
            // Second message appears after a natural pause (like a real person typing)
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        type: "bot",
                        content: "May I know your name?",
                        timestamp: new Date(),
                    },
                ]);
                // Set nameQuestionAsked to true after the message appears so input shows
                setNameQuestionAsked(true);
            }, 2000 + Math.random() * 800);
        }
    }, [messages.length]);

    // Auto-open chatbot after 5 seconds (first visit only)
    useEffect(() => {
        const hasOpenedBefore = localStorage.getItem("chatbot-auto-opened");
        if (!hasOpenedBefore && !hasAutoOpened) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                setHasAutoOpened(true);
                localStorage.setItem("chatbot-auto-opened", "true");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [hasAutoOpened]);

    // Auto-open chatbot at intervals if not submitted
    useEffect(() => {
        // Don't auto-open if form is submitted
        if (isFormSubmitted) {
            return;
        }

        // Don't auto-open if chat is already open
        if (isOpen) {
            return;
        }

        // Load close count and last close time from localStorage
        const storedCloseCount = parseInt(localStorage.getItem(CHATBOT_CLOSE_COUNT_KEY) || '0');
        const lastCloseTime = localStorage.getItem(CHATBOT_LAST_CLOSE_TIME_KEY);
        
        setCloseCount(storedCloseCount);

        let timer;

        if (lastCloseTime) {
            // Calculate time since last close
            const timeSinceLastClose = Date.now() - parseInt(lastCloseTime);
            // Use closeCount - 1 as index (first close uses interval 0, second uses interval 1, etc.)
            const intervalIndex = Math.min(storedCloseCount - 1, AUTO_OPEN_INTERVALS.length - 1);
            const currentInterval = AUTO_OPEN_INTERVALS[intervalIndex];
            
            if (timeSinceLastClose >= currentInterval) {
                // Enough time has passed, show popup immediately
                if (!isFormSubmitted && !isOpen) {
                    setIsOpen(true);
                }
            } else {
                // Schedule popup for remaining time
                const remainingTime = currentInterval - timeSinceLastClose;
                timer = setTimeout(() => {
                    if (!isFormSubmitted && !isOpen) {
                        setIsOpen(true);
                    }
                }, remainingTime);
            }
        } else if (storedCloseCount > 0) {
            // Fallback: show after current interval (shouldn't happen if lastCloseTime is set)
            const intervalIndex = Math.min(storedCloseCount - 1, AUTO_OPEN_INTERVALS.length - 1);
            const interval = AUTO_OPEN_INTERVALS[intervalIndex];
            timer = setTimeout(() => {
                if (!isFormSubmitted && !isOpen) {
                    setIsOpen(true);
                }
            }, interval);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [isOpen, isFormSubmitted]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (chatContentRef.current) {
            setTimeout(() => {
                if (chatContentRef.current) {
                    chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
                }
            }, 100);
        }
    }, [messages, showOptions, currentStep]);

    // Ensure phone input is visible when step changes to phone-input
    useEffect(() => {
        if (currentStep === "phone-input") {
            // Wait for typing indicator to finish (800ms) + buffer to ensure DOM is updated
            const timer = setTimeout(() => {
                if (phoneInputRef.current && chatContentRef.current) {
                    // Scroll to phone input
                    phoneInputRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    // Also ensure chat container is scrolled to bottom
                    chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    // Calculate natural typing delay based on message length - more human-like delays
    const calculateTypingDelay = (content) => {
        if (typeof content === "string") {
            // More realistic typing speed: 80-120ms per character (slower, more human-like)
            // Minimum 1500ms (1.5 seconds) to maximum 4000ms (4 seconds) for longer messages
            const baseDelay = Math.min(Math.max(content.length * 100, 1500), 4000);
            // Add more randomness to make it feel more human (variation of ±500ms)
            const randomVariation = Math.random() * 1000 - 500;
            // Add occasional "thinking" pause (10% chance of extra 800-1500ms delay)
            const thinkingPause = Math.random() < 0.1 ? Math.random() * 700 + 800 : 0;
            return Math.round(baseDelay + randomVariation + thinkingPause);
        }
        // For JSX content, use a longer delay (2-3 seconds)
        return 2000 + Math.random() * 1000;
    };

    // Add bot message with typing indicator - more natural delays
    const addBotMessageWithTyping = (content, customDelay = null, shouldShowOptions = false, onComplete = null) => {
        const delay = customDelay !== null ? customDelay : calculateTypingDelay(content);
        setMessages((prev) => [...prev, { type: "typing", content: "", timestamp: new Date() }]);
        setTimeout(() => {
            setMessages((prev) => {
                const withoutTyping = prev.filter((msg) => msg.type !== "typing");
                return [...withoutTyping, { type: "bot", content, timestamp: new Date() }];
            });
            // Only show options if explicitly requested (for question messages, not acknowledgments)
            // Add a small delay to ensure message is rendered before showing options
            if (shouldShowOptions) {
                setTimeout(() => {
                    setShowOptions(true);
                }, 100);
            }
            // Call onComplete callback after message is displayed
            if (onComplete) {
                setTimeout(() => {
                    onComplete();
                }, 100);
            }
        }, delay);
    };

    // Add acknowledgment message (short, quick response) - never shows options
    // Longer delays for more human-like feel
    const addAcknowledgment = (message, callback, delay = null) => {
        // If no custom delay, calculate based on message length but with shorter minimum
        const ackDelay = delay !== null ? delay : Math.max(calculateTypingDelay(message) * 0.6, 800);
        addBotMessageWithTyping(message, ackDelay, false);
        setTimeout(() => {
            if (callback) callback();
        }, ackDelay + 500);
    };

    // Add user message
    const addUserMessage = (content) => {
        setMessages((prev) => [...prev, { type: "user", content, timestamp: new Date() }]);
    };

    // Stable phone change handler to prevent re-renders
    const handlePhoneChange = useCallback((phone) => {
        setChatData((prev) => ({ ...prev, phone }));
    }, []);

    // Handle name submission
    const handleNameSubmit = (e) => {
        e.preventDefault();
        if (!nameInput.trim() || nameInput.trim().length < 2) {
            return;
        }
        const userName = nameInput.trim();
        setChatData((prev) => ({ ...prev, name: userName }));
        addUserMessage(userName);
        setNameInput("");
        setShowOptions(false);
        // Add acknowledgment first, then main question - with human-like pauses
        setTimeout(() => {
            addAcknowledgment(`Nice to meet you, ${userName}! 😊`, () => {
                // Longer pause before asking the next question (like thinking)
                setTimeout(() => {
                    addBotMessageWithTyping("Which mortgage service are you interested in?", null, true);
                }, 1000 + Math.random() * 500);
            });
        }, 600 + Math.random() * 400);
    };

    // Handle service selection
    const handleServiceSelect = (serviceId) => {
        const service = SERVICES.find(s => s.id === serviceId);
        addUserMessage(service ? service.label : OPTION_LABELS[serviceId]);
        setChatData((prev) => ({ ...prev, selectedService: serviceId }));
        setShowOptions(false);
        // Add acknowledgment with slight variation
        const acknowledgments = [
            "Perfect choice! 👍",
            "Great! Let me help you with that.",
            "Excellent! I'll get that sorted for you.",
        ];
        const randomAck = acknowledgments[Math.floor(Math.random() * acknowledgments.length)];
        setTimeout(() => {
            addAcknowledgment(randomAck, () => {
                // Longer pause before asking the next question
                setTimeout(() => {
                    addBotMessageWithTyping("Have you worked with a mortgage broker before?", null, true);
                }, 1200 + Math.random() * 600);
            });
        }, 600 + Math.random() * 400);
    };

    // Handle interested before selection
    const handleInterestedBefore = (interested) => {
        addUserMessage(interested ? "Yes" : "No");
        setChatData((prev) => ({ ...prev, interestedBefore: interested }));
        setShowOptions(false);
        // Natural response based on answer
        setTimeout(() => {
            if (interested) {
                addAcknowledgment("That's wonderful! 😊", () => {
                    setTimeout(() => {
                        const phoneMessage = "📞 Please provide your phone number so our mortgage experts can contact you and discuss your mortgage needs.";
                        // Set phoneQuestionAsked to true after the message finishes typing
                        addBotMessageWithTyping(phoneMessage, null, false, () => {
                            setPhoneQuestionAsked(true);
                        });
                    }, 1200 + Math.random() * 600);
                });
            } else {
                addAcknowledgment("No worries! 😊", () => {
                    setTimeout(() => {
                        const phoneMessage = "📞 Please provide your phone number so our mortgage experts can contact you and discuss your mortgage needs.";
                        // Set phoneQuestionAsked to true after the message finishes typing
                        addBotMessageWithTyping(phoneMessage, null, false, () => {
                            setPhoneQuestionAsked(true);
                        });
                    }, 1200 + Math.random() * 600);
                });
            }
        }, 400);
    };

    // Handle phone submission and final submission
    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        if (!chatData.phone || chatData.phone.length < 10) {
            return;
        }

        addUserMessage(chatData.phone);
        setIsSubmitting(true);
        setShowOptions(false);

        // Add acknowledgment before processing - with longer delay
        setTimeout(() => {
            addBotMessageWithTyping("Perfect! Let me process this for you...", 1500 + Math.random() * 500);
        }, 600 + Math.random() * 400);

        // For chatbot, message is just "-" since data is in other columns
        const emailData = {
            name: chatData.name,
            phone: chatData.phone,
            email: "", // Chatbot doesn't collect email
            message: "-", // Empty message for chatbot (data is in Service Type and Worked with Broker Before columns)
        };

        try {
            const result = await sendContactFormEmail(emailData);
            if (result.success) {
                // Also send chatbot data to Google Sheets (non-blocking)
                sendChatbotToGoogleSheets({
                    name: chatData.name,
                    phone: chatData.phone,
                    selectedService: OPTION_LABELS[chatData.selectedService] || chatData.selectedService,
                    interestedBefore: chatData.interestedBefore,
                    pageUrl: chatData.pageUrl,
                }).catch((error) => {
                    console.error("Failed to save chatbot data to Google Sheets (non-critical):", error);
                });

                setIsFormSubmitted(true);
                // Clear close tracking since form is submitted
                setCloseCount(0);
                localStorage.removeItem(CHATBOT_CLOSE_COUNT_KEY);
                localStorage.removeItem(CHATBOT_LAST_CLOSE_TIME_KEY);
                // Add success message with natural delay - longer for processing feel
                setTimeout(() => {
                    addBotMessageWithTyping(
                        <div className="chatbot-success-message">
                            <div className="success-icon">✅</div>
                            <h3>Thank you for your inquiry!</h3>
                            <p>Our mortgage experts will contact you within 24 hours to discuss your mortgage needs and find the best solution for you.</p>
                            <div className="contact-info">
                                <p>📞 For immediate assistance, please call:</p>
                                <a href="tel:+971-XX-XXX-XXXX" className="phone-link">
                                    +971-XX-XXX-XXXX
                                </a>
                            </div>
                        </div>,
                        2000,
                        false,
                        () => {
                            // Navigate to thank-you page after success message is fully displayed
                            // Give users a moment to read the message (3 seconds)
                            setTimeout(() => {
                                navigate("/thank-you");
                            }, 3000);
                        }
                    );
                }, 1000);
            }
        } catch (error) {
            console.error("Submission error:", error);
            setTimeout(() => {
                addBotMessageWithTyping("Hmm, I'm having a bit of trouble processing that. Could you please try again, or feel free to contact us directly?");
            }, 1200 + Math.random() * 600);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle chat close - track for auto-open intervals
    const handleChatClose = () => {
        // Only track closes if form hasn't been submitted
        if (!isFormSubmitted) {
            const newCloseCount = closeCount + 1;
            setCloseCount(newCloseCount);
            localStorage.setItem(CHATBOT_CLOSE_COUNT_KEY, newCloseCount.toString());
            localStorage.setItem(CHATBOT_LAST_CLOSE_TIME_KEY, Date.now().toString());
        }
        setIsOpen(false);
    };

    // Reset chat
    const resetChat = () => {
        setChatData({
            name: "",
            phone: "",
            selectedService: null,
            interestedBefore: null,
            pageUrl: typeof window !== "undefined" ? window.location.href : "",
        });
        setNameInput("");
        setShowOptions(false);
        setPhoneQuestionAsked(false);
        setNameQuestionAsked(false);
        setIsFormSubmitted(false);
        setCloseCount(0);
        localStorage.removeItem(CHATBOT_CLOSE_COUNT_KEY);
        localStorage.removeItem(CHATBOT_LAST_CLOSE_TIME_KEY);
        hasInitialized.current = false;
        // Reset with staggered initial messages - same delays as initial load
        setMessages([
            {
                type: "bot",
                content: "Hello! I'm Hina Ali 👋 Welcome to Indeed Mortgage Broker. I'm here to help you find the perfect mortgage solution for your needs!",
                timestamp: new Date(),
            },
        ]);
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    type: "bot",
                    content: "May I know your name?",
                    timestamp: new Date(),
                },
            ]);
            setNameQuestionAsked(true);
        }, 2000 + Math.random() * 800);
    };

    // Debug: Log current step (remove in production if needed)
    useEffect(() => {
        if (currentStep === "phone-input") {
            console.log("Phone input step active, chatData:", chatData);
        }
    }, [currentStep]);

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="chatbot-toggle-btn"
                    aria-label="Open chat"
                >
                    <img src={chatbotIcon} alt="Chat" className="chatbot-icon" />
                    {/* <TbMessageChatbot className="chatbot-icon" /> */}
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-container">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-avatar">
                                <img src={chatbotAvatar} alt="Chatbot" />
                            </div>
                            <div className="chatbot-header-text">
                                <h3>Hina Ali</h3>
                                <p>Online</p>
                            </div>
                        </div>
                        <button
                            onClick={handleChatClose}
                            className="chatbot-close-btn"
                            aria-label="Close chat"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div ref={chatContentRef} className="chatbot-messages">
                        {messages.map((message, index) => {
                            if (message.type === "typing") {
                                return (
                                    <div key={index} className="chatbot-message chatbot-message-bot">
                                        <div className="typing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={index}
                                    className={`chatbot-message ${
                                        message.type === "user" ? "chatbot-message-user" : "chatbot-message-bot"
                                    }`}
                                >
                                    <div className="message-bubble">
                                        {typeof message.content === "string" ? (
                                            <p>{message.content}</p>
                                        ) : (
                                            message.content
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Name Input */}
                        {currentStep === "name-input" && nameQuestionAsked && (
                            <div className="chatbot-message chatbot-message-bot">
                                <div className="message-bubble message-input-bubble">
                                    <form onSubmit={handleNameSubmit}>
                                        <input
                                            ref={nameInputRef}
                                            type="text"
                                            value={nameInput}
                                            onChange={(e) => setNameInput(e.target.value)}
                                            placeholder="Enter your name"
                                            className="chatbot-input"
                                            autoFocus
                                        />
                                        <button
                                            type="submit"
                                            disabled={!nameInput.trim() || nameInput.trim().length < 2}
                                            className="chatbot-submit-btn"
                                        >
                                            Send
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Options - Welcome (Services) */}
                        {currentStep === "welcome" && showOptions && !messages.some((m) => m.type === "typing") && (
                            <div className="chatbot-message chatbot-message-bot">
                                <div className="message-bubble message-options-bubble">
                                    <div className="options-grid">
                                        {SERVICES.map((service) => (
                                            <button
                                                key={service.id}
                                                onClick={() => handleServiceSelect(service.id)}
                                                className="option-btn"
                                            >
                                                🏦 {service.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Interested Before Options */}
                        {currentStep === "interested-before" && showOptions && !messages.some((m) => m.type === "typing") && (
                            <div className="chatbot-message chatbot-message-bot">
                                <div className="message-bubble message-options-bubble">
                                    <div className="options-row">
                                        <button
                                            onClick={() => handleInterestedBefore(true)}
                                            className="option-btn option-btn-primary"
                                        >
                                            ✅ Yes
                                        </button>
                                        <button
                                            onClick={() => handleInterestedBefore(false)}
                                            className="option-btn"
                                        >
                                            ❌ No
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Phone Input */}
                        {currentStep === "phone-input" && phoneQuestionAsked && !isSubmitting && (
                            <div className="chatbot-message chatbot-message-bot">
                                <div className="message-bubble message-input-bubble">
                                    <form onSubmit={handlePhoneSubmit}>
                                        <div ref={phoneInputRef} className="chatbot-phone-input-wrapper">
                                            <PhoneInput
                                                key="phone-input-field"
                                                country={"ae"}
                                                value={chatData.phone}
                                                onChange={handlePhoneChange}
                                                inputProps={{
                                                    name: "phone",
                                                    required: true,
                                                    autoFocus: true,
                                                }}
                                                inputStyle={{
                                                    width: "100%",
                                                    height: "40px",
                                                    borderRadius: "8px",
                                                    border: "1px solid rgba(0, 0, 0, 0.2)",
                                                    backgroundColor: "white",
                                                    color: "#111b21",
                                                    paddingLeft: "50px",
                                                    fontSize: "14px",
                                                }}
                                                buttonStyle={{
                                                    border: "none",
                                                    backgroundColor: "transparent",
                                                    borderRight: "1px solid rgba(0, 0, 0, 0.2)",
                                                }}
                                                containerStyle={{
                                                    width: "100%",
                                                }}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={!chatData.phone || chatData.phone.length < 10 || isSubmitting}
                                            className="chatbot-submit-btn"
                                        >
                                            {isSubmitting ? "Sending..." : "Submit"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

