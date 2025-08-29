import { io } from "socket.io-client";
import { useCallback, useState, useEffect, useRef } from 'react';
import './App.css';
import sendIcon from './assets/Send.svg';
import logoIcon from './assets/Logo.svg';
import sendIcon_green from './assets/Send_green.svg';
import exitIcon from './assets/exit.svg';
import minIcon from  './assets/minus.svg';
import maximizeIcon from './assets/maximize.svg';
import optionsIcon from './assets/Options.svg';
import conversationLogo from './assets/Conversation Logo.png';
import copyIcon from './assets/Copy.svg';
import copyCheckIcon from './assets/Copy Check.svg';
import likeIcon from './assets/Like.svg';
import likeIconFill from './assets/Like with Fill.svg';
import dislikeIcon from './assets/Dislike.svg';
import dislikeIconFill from './assets/Dislike with Fill.svg';
import speakerIcon from './assets/speaker.svg';
import stopIcon from './assets/stop.svg';
import leftAICurls from './assets/Left AI Curls V2.png';
import grayLeftAICurls from './assets/Gray Left AI Curls V3.png';
import rightAICurls from './assets/Right AI Curls V2.png';
import grayRightAICurls from './assets/Gray Right AI Curls V3.png';
import sidebarAICurls from './assets/Sidebar AI Curls V2.png';
import downloadIcon from './assets/download.svg';
import volumeIcon from './assets/volume.svg';
import volumeIconMute from './assets/volumeMute.svg';
import globeIcon from './assets/globe.svg';
import notificationSound from './assets/Notification.wav';
import micIcon from './assets/mic.svg';
import micActiveIcon from './assets/mic-active.svg';
import attachment from './assets/Attachment.svg'
import questionIcon from './assets/Question.svg'
import questionActiveIcon from './assets/QuestionActive.svg'
import contactIcon from './assets/Contact.svg'
import contactActiveIcon from './assets/ContactActive.svg'
import searchIcon from './assets/Search.svg'
import articleIcon from './assets/Articles.svg'
import criticalIcon from './assets/Critical.svg'

//  App variables to keep track of state changes
const App = () => {
    const chatBodyRef = useRef(null);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isChatStarted, setIsChatStarted] = useState(false);
    const [chatMessages, setchatMessages] = useState([]);
    const [intent, setIntent] = useState('');
    const [showOptionsMenu, setOptionsMenu] = useState(false);
    const [isAwaitingAI,setIsAwaitingAI] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    const [convoId, setConvoId] = useState(null);
    const [endUserId, setEndUserId] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [copiedStates, setCopiedStates] = useState({});
    const [isSoundEnabled, setIsSoundEnabled] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    const [isReading, setIsReading] = useState({});
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const audioRef = useState(new Audio(notificationSound))[0];
    const [ShowEndChatMenu,setShowEndChatMenu] = useState(false);
    const [ShowMinimizedEndChatMenu,setShowMinimizedEndChatMenu] = useState(false);
    const [endedSuccessful, showEndedSuccessful] = useState(false);
    const [minimizedEndedSuccessful, showMinimizedEndedSuccessful] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('solve'); // 'solve' or 'contact'
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions] = useState([
        "What is Qlik Cloud Analytics?",
        "How is Qlik Cloud Analytics different from Qlik Sense Enterprise on Windows?",
        "What types of organizations typically use Qlik Cloud Analytics?",
        "What are the main benefits of using Qlik Cloud over traditional BI tools?",
        "How can I get started with Qlik Cloud Analytics?",
        "What data sources can Qlik Cloud Analytics connect to?",
        "How does Qlik’s Associative Engine work in the cloud?",
        "Can I create dashboards and visualizations directly in Qlik Cloud?",
        "Does Qlik Cloud support real-time data analytics?",
        "What AI or machine learning features are available in Qlik Cloud Analytics?",
        "How do I load and transform data in Qlik Cloud?",
        "Does Qlik Cloud integrate with cloud storage platforms like AWS S3, Azure, or Google Cloud?",
        "Can Qlik Cloud connect to on-premise databases?",
        "What is Qlik Data Gateway, and how does it work with Qlik Cloud?",
        "How does Qlik Cloud handle large-scale or big data analytics?",
        "How secure is Qlik Cloud Analytics?",
        "Does Qlik Cloud comply with data privacy regulations like GDPR or HIPAA?",
        "What user authentication methods are available in Qlik Cloud?",
        "How can administrators manage user roles and access permissions?",
        "Is data encrypted in Qlik Cloud during transfer and storage?",
        "How can I share dashboards and reports with others in Qlik Cloud?",
        "Does Qlik Cloud support collaboration and commenting within dashboards?",
        "Can Qlik Cloud visualizations be embedded into other applications or websites?",
        "Is it possible to schedule and distribute reports in Qlik Cloud Analytics?",
        "What options are available for exporting or downloading Qlik Cloud dashboards and data?",
        "What is Qlik Talend Cloud?",
        "How does Qlik Talend Cloud differ from on-premise Talend solutions?",
        "What are the key benefits of using Qlik Talend Cloud for data integration?",
        "What types of organizations typically use Qlik Talend Cloud?",
        "How can I get started with Qlik Talend Cloud?",
        "What data integration capabilities does Qlik Talend Cloud provide?",
        "Does Qlik Talend Cloud support real-time data streaming?",
        "How does Qlik Talend Cloud handle ETL vs. ELT processes?",
        "Can I use Talend Cloud for both structured and unstructured data?",
        "What pre-built connectors are available in Qlik Talend Cloud?",
        "How does Qlik Talend Cloud integrate with cloud platforms like AWS, Azure, and Google Cloud?",
        "Can Qlik Talend Cloud connect to on-premise databases and applications?",
        "What is the difference between Talend Studio and Qlik Talend Cloud?",
        "How does Qlik Talend Cloud support API-based integrations?",
        "How does Qlik Talend Cloud manage large-scale or big data pipelines?",
        "What data quality tools are available in Qlik Talend Cloud?",
        "How does Qlik Talend Cloud ensure data governance and compliance?",
        "Can Qlik Talend Cloud help with GDPR, HIPAA, or other regulatory requirements?",
        "How does metadata management work in Qlik Talend Cloud?",
        "What options exist for monitoring and auditing data flows in Qlik Talend Cloud?",
        "How secure is Qlik Talend Cloud?",
        "What authentication and identity management options are supported?",
        "Does Qlik Talend Cloud encrypt data in transit and at rest?",
        "How can administrators manage user access and roles?",
        "How does Qlik Talend Cloud ensure high availability and reliability?",
        "How do I create a Qlik account?",
        "What should I do if I forget my Qlik account password?",
        "How do I update my email address or contact details on my Qlik account?",
        "Can I use single sign-on (SSO) to log in to my Qlik account?",
        "How do I activate my Qlik Cloud subscription after purchase?",
        "How can I view my current Qlik subscription or license details?",
        "How do I upgrade or downgrade my Qlik subscription plan?",
        "What is the difference between a professional user and an analyzer user license?",
        "How do I assign or reassign licenses to users in my organization?",
        "What happens if my subscription expires?",
        "How can I view and download my invoices?",
        "What payment methods does Qlik accept?",
        "Can I switch from monthly to annual billing (or vice versa)?",
        "How do I update my billing information or payment method?",
        "Are refunds available if I cancel my subscription early?",
        "How do I enable multi-factor authentication (MFA) for my account?",
        "What security measures does Qlik use to protect my account data?",
        "How do I remove former employees or users from my Qlik account?",
        "How do I manage user roles and permissions in my tenant?",
        "Where can I find Qlik’s data privacy and compliance policies?",
        "How do I contact Qlik customer support?",
        "How can I check the status of my support tickets?",
        "Where do I find documentation and training resources for Qlik?",
        "How do I join or access the Qlik Community forums?",
        "How do I report suspicious activity or a security concern with my account?",
        "How do I contact Qlik Support?",
        "How do I post effectively to the Qlik Community?",
        "How can I instantly get answers to common questions?",
        "What is Qlik Answers and how does it help with unstructured data or decision support?",
        "What is the Qlik Multi-Cloud and how does its FAQ address common deployment questions?",
        "How do I identify common customers between two years?",
        "What are typical Qlik Sense interview questions?",
        "How do I handle scenario-based transformations in Qlik Sense?",
        "What types of questions are asked during QlikSense interviews?",
        "How can I explain or get explanations for specific interview-style questions in the community?",
        "Why is the Qlik Community perceived as inactive or less conversational compared to other communities?",
        "What factors influence community responsiveness—like posting in the right forum or familiarity with terminology?",
        "Where can I find archived Q&A or knowledge bases for troubleshooting latency or performance issues? (",
        "What are common pitfalls customers face when posting questions?",
        "How can I ask “great questions” that are more likely to receive helpful responses?",
        "What makes a strong question—should I include screenshots, code, and what I've already tried?",
        "How do I use the Support Chatbot effectively to solve problems faster?",
        "Are there best practices for engaging in developer forums like “App Development” or “Visualization and Usability”?",
        "How do interview prep posts help other users in the community?",
        "What strategies can increase visibility for community posts?",
        "What is the purpose of the Qlik Community and who participates?",
        "What resources exist within Qlik Community for Multi-Cloud deployment guidance?",
        "What is the scope and role of Qlik Answers within product innovation discussions?",
        "How is “Support Chatbot” being used to drive faster support responses?",
        "How can I effectively troubleshoot unusual script behavior or syntax errors encountered in the forums?"
    ]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    // Handle input change and filter suggestions
    const handleIntentChange = useCallback((e) => {
        const value = e.target.value;
        setIntent(value);

        if (value.trim().length > 2) {
            const filtered = suggestions.filter(suggestion =>
                suggestion.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSuggestions(filtered.slice(0, 5)); // Show max 5 suggestions
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
            setFilteredSuggestions([]);
        }
    }, [suggestions]);

    // Handle suggestion click
    const handleSuggestionClick = useCallback((suggestion) => {
        setIntent(suggestion);
        setShowSuggestions(false);
        setFilteredSuggestions([]);
        // Focus back on textarea
        const textarea = document.getElementById('intent');
        if (textarea) {
            textarea.focus();
        }
    }, []);

    // Hide suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.landingIntentBox') && !event.target.closest('.autocompleteDropdown')) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Getting API Call from backend via fecthing from public ngrok link
    const sendIntentToAPI = useCallback(async (intent) => {
        try {
            const response = await fetch('https://5644927d72f8.ngrok-free.app/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({  
                    intent,
                    convo_id: convoId,
                    end_user: endUserId
                }),
            });

            const data = await response.json();

            // storing convoid and enduserid if created
            if(data.convo_id && !convoId) setConvoId(data.convo_id);
            if(data.end_user && !endUserId) setEndUserId(data.end_user);

            return data.response;
        } catch (error){
            console.error('Error communicating with API:', error);
            return 'An error occurred processing your request.';
        }
    }, [intent, convoId, endUserId]);
    

    // Add timer functions for time-based effects
    const startTimer = () => {
        setIsRunning(true);
    };

    const stopTimer = () => {
        setIsRunning(false);
    };

    const resetTimer = () => {
        setTime(0);
        setIsRunning(false);
    };

    // Timer effect
    useEffect(() => {
        let intervalId;
        if (isRunning) {
            intervalId = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [isRunning]);
    console.log({time});


    //Add delay for displaying AI response (older function, may not need anymore)
    useEffect(() => {
        let delayTimer;
        if (isAwaitingAI) {
            delayTimer = setTimeout(() => setShowProgress(true), 300);
        } else{
            setShowProgress(false);
        }
        return () => clearTimeout(delayTimer);
    }, [isAwaitingAI]);


    // When send button is clicked (conditional on if the text is in the intent box)
    const onLandingIntentBoxClick = useCallback(async() => {
        if (intent.trim() === '') {
            alert('Please input a request');
        } else {
            const userMsg = {text: intent, from: 'user', id: Date.now()};
            // Simulating AI response after a delay (used for early prototyping....)
            setchatMessages(prev => [...prev, userMsg]);
            setIsChatStarted(true);
            setIntent('');
            resetTimer();
            startTimer();
            setIsAwaitingAI(true);

            // Currently used now, to retrieve ADA responses and display
            const adaReply = await sendIntentToAPI(intent);
            const adaResponse = {text: adaReply, from: 'ai', id: Date.now() + 1};
            setchatMessages(prev => [...prev, adaResponse]);
            stopTimer();
            setIsAwaitingAI(false);

            //Catching error for audio capabilitites
            if (isSoundEnabled) {
                    audioRef.play().catch(e => console.log('Audio play failed:', e));
                }
        }
    }, [intent, resetTimer, startTimer, stopTimer, audioRef, isSoundEnabled, sendIntentToAPI]);
    
    // Socket connection to listen for ADA responses
    useEffect(() =>{
        // Can change to any local host port (but ngrok link must be fired on the same port number)
        const socket = io("http://localhost:4041");
        
        // Duplictae of functionality in onLandingIntentBoxClick but for emitting sockets
        socket.on("ada_response", (data) => {
            console.log("Received response from ADA:", data);
            const { adaReply } = data;
            const adaResponse = {text: adaReply, from: 'ai', id: Date.now()};
            setchatMessages(prev => [...prev, adaResponse]);
            stopTimer();
            setIsAwaitingAI(false); 
        
        });

        return () => socket.disconnect();
    },[stopTimer]);

    // Function for when the exit button is clicked
    const handleExit = useCallback(async() => {
        //Closing confirmation to end chat menu and showing succes overlay
        setShowEndChatMenu(false);
        showEndedSuccessful(true);

        // Ending convo via API
        if (!convoId) return;

        // Accessing backend ending conversation API function via ngrok link
        try{
            const response = await fetch('https://5644927d72f8.ngrok-free.app/api/end_convo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ convo_id: convoId })
            });

            if (!response.ok){
                const errData = await response.json()
                console.error('Error handling exit request:', errData.error || response.statusText );
                showEndedSuccessful(false);
                return;
            }
            
            const result = await response.json();
            console.log('Conversation ended: ', result.message);
        
        //Clearing componenents in the front end, closing toast display

        setTimeout(() => {
            setIsChatStarted(false);
            setchatMessages([]); //Clears chat log
            setIntent(''); //Empty intent box
            setConvoId(null); //Reset convoId
            setEndUserId(null); //Reset endUserId
            resetTimer();
            showEndedSuccessful(false);
        }, 2); // Increase number to keep toast on screen longer, for CSS style changes

        } catch (error){
            console.error('Error ending conversation:', error);
        }
    }, [convoId, resetTimer]);

    const handleMinimizedExit = useCallback(async() => {
        //Closing confirmation to end chat menu and showing succes overlay
        setShowMinimizedEndChatMenu(false);
        showMinimizedEndedSuccessful(true);

        // Ending convo via API
        if (!convoId) return;

        // Accessing backend ending conversation API function via ngrok link
        try{
            const response = await fetch('https://5644927d72f8.ngrok-free.app/api/end_convo', {
               method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ convo_id: convoId })
            });

            if (!response.ok){
                const errData = await response.json()
                console.error('Error handling exit request:', errData.error || response.statusText );
                showMinimizedEndedSuccessful(false);
                return;
            }
            
            const result = await response.json();
            console.log('Conversation ended: ', result.message);
        
        //Clearing componenents in the front end, closing toast display

        setTimeout(() => {
            setIsChatStarted(false);
            setchatMessages([]); //Clears chat log
            setIntent(''); //Empty intent box
            setConvoId(null); //Reset convoId
            setEndUserId(null); //Reset endUserId
            resetTimer();
            showMinimizedEndedSuccessful(false);
        }, 2); // Increase number to keep toast on screen longer, for CSS style changes

        } catch (error){
            console.error('Error ending conversation:', error);
        }
    }, [convoId, resetTimer]);

    //Handling cancel btn to return to chat interface
    const handleCancel = useCallback(() =>{
        setShowEndChatMenu(false);
    }, []);

    const handleMinimizedCancel = useCallback(() => {
        setShowMinimizedEndChatMenu(false);
    }, []);

    // Keep line breaks/extract links from  ADA response to make them clickable on frontend
    function formatResponseText(text){
        const urlRegex = /(https?:\/\/[^\s]+?)(?=[.!?]?\s|[.!?]?$)/g;
        const lines = text.split('\n');
        
        // Filter out lines ending with question marks
        const filteredLines = lines.filter(line => !line.trim().endsWith('?'));
        
        return filteredLines.map((line, index) => {
            // More flexible pattern: starts with number, has colon somewhere in line
            const numberedColonMatch = line.match(/^(\d+[\.\)\:]?\s*.*?:)/);
            // New pattern: single line that starts with number and ends with period
            const numberedPeriodMatch = line.match(/^\d+[\.\)\:]?\s+.*?\./);
            
            return (
                <div key={index}>
                    <span>
                        {numberedColonMatch ? (
                            // Find the first capital letter after the first colon
                            (() => {
                                const colonIndex = line.indexOf(':');
                                if (colonIndex !== -1) {
                                    const afterColon = line.substring(colonIndex + 1);
                                    const capitalMatch = afterColon.match(/[A-Z]/);
                                    
                                    if (capitalMatch) {
                                        const capitalIndex = colonIndex + 1 + capitalMatch.index;
                                        const boldPart = line.substring(0, capitalIndex);
                                        const normalPart = line.substring(capitalIndex);
                                        
                                        // Bolding lines of text and returning https lines as clickabel URL links
                                        return (
                                            <>
                                                <strong>
                                                    {boldPart.split(urlRegex).map((part, j) => {
                                                        if (urlRegex.test(part)) {
                                                            return (
                                                                <a key={j} href={part} target="_blank" rel="noopener noreferrer">
                                                                    {part}
                                                                </a>
                                                            );
                                                        }
                                                        return part;
                                                    })}
                                                </strong>
                                                {normalPart.split(urlRegex).map((part, j) => {
                                                    if (urlRegex.test(part)) {
                                                        return (
                                                            <a key={j} href={part} target="_blank" rel="noopener noreferrer">
                                                                {part}
                                                            </a>
                                                        );
                                                    }
                                                    return part;
                                                })}
                                            </>
                                        );
                                    } else if (numberedPeriodMatch){
                                        // No capital letter after colon, bold up to and including the colon
                                        const boldPart = line.substring(0, colonIndex + 1);
                                        const normalPart = line.substring(colonIndex + 1);
                                        
                                        return (
                                            <>
                                                <strong>
                                                    {boldPart.split(urlRegex).map((part, j) => {
                                                        if (urlRegex.test(part)) {
                                                            return (
                                                                <a key={j} href={part} target="_blank" rel="noopener noreferrer">
                                                                    {part}
                                                                </a>
                                                            );
                                                        }
                                                        return part;
                                                    })}
                                                </strong>
                                                {normalPart.split(urlRegex).map((part, j) => {
                                                    if (urlRegex.test(part)) {
                                                        return (
                                                            <a key={j} href={part} target="_blank" rel="noopener noreferrer">
                                                                {part}
                                                            </a>
                                                        );
                                                    }
                                                    return part;
                                                })}
                                            </>
                                        );
                                    }
                                }
                                
                                // Fallback: bold the entire line if no colon found
                                return line.split(urlRegex).map((part, j) => {
                                    if (urlRegex.test(part)) {
                                        return (
                                            <a key={j} href={part} target="_blank" rel="noopener noreferrer">
                                                {part}
                                            </a>
                                        );
                                    }
                                    return <strong key={j}>{part}</strong>;
                                });
                            })()
                        ) : numberedPeriodMatch ? (
                            // Bold entire line if it's a single line starting with number and ending with period
                            line.split(urlRegex).map((part, j) => {
                                if (urlRegex.test(part)) {
                                    return (
                                        <a key={j} href={part} target="_blank" rel="noopener noreferrer">
                                            {part}
                                        </a>
                                    );
                                }
                                return <strong key={j}>{part}</strong>;
                            })
                        ) : (
                            // Line doesn't match pattern - process URLs only
                            line.split(urlRegex).map((part, j) => {
                                if (urlRegex.test(part)) {
                                    return (
                                        <a key={j} href={part} target="_blank" rel="noopener noreferrer">
                                            {part}
                                        </a>
                                    );
                                }
                                return part;
                            })
                        )}
                    </span>
                    {/* Only add <br> if it's not the last line */}
                    {index < filteredLines.length - 1 && <br />}
                </div>
            );
        });
    }

    // Function for source accordion population
    function getUrl(text){
        const urlRegex = /(https?:\/\/[^\s]+?)([.!?]?)(\s|$)/g;
        const urls = []
        let match;
        while ((match = urlRegex.exec(text)) !== null){
            urls.push(match[1]);
        }
        return urls;
    }

    // Function to extract lines ending with question marks, to seperate from IFD repsonse and place under source accordion
    function getQuestionLines(text) {
        const lines = text.split('\n');
        return lines.filter(line => line.trim().endsWith('?'));
    }


    const extractTextFromResponse = (msg) => {
        // Simply return the raw text since msg.text is already a string
        return msg.text || '';
    };

    // Copy chatbot's response
    const copyClick = (msg) => {
        navigator.clipboard.writeText(extractTextFromResponse(msg));
        setCopiedStates(prev => ({
            ...prev,
            [msg.id]: true
        }));
        
        // Reset copy state after 2 seconds
        setTimeout(() => {
            setCopiedStates(prev => ({
                ...prev,
                [msg.id]: false
            }));
        }, 2000);
    };

    // Function for Text-to-Speech
    const readAloud = useCallback((msg) => {
        const text = extractTextFromResponse(msg);
        
        if (isReading[msg.id]) {
            // Stop reading if already reading
            speechSynthesis.cancel();
            setIsReading(prev => ({
                ...prev,
                [msg.id]: false
            }));
            return;
        }

        // Start reading
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => {
            setIsReading(prev => ({
                ...prev,
                [msg.id]: true
            }));
        };
        
        utterance.onend = () => {
            setIsReading(prev => ({
                ...prev,
                [msg.id]: false
            }));
        };
        
        utterance.onerror = () => {
            setIsReading(prev => ({
                ...prev,
                [msg.id]: false
            }));
        };

        speechSynthesis.speak(utterance);
    }, [isReading, extractTextFromResponse]);

    //Minimizing/maximizing screen functions
    const handleMinimize = useCallback(() => {
        setIsMinimized(true);
    }, []);

    //
    const handleRestore = useCallback(() => {
        setIsMinimized(false);
    }, []);

    //Switching langugae based on user selected menu item (would need to be paired with ADA langauge API logic)
    const handleLanguageSelect = useCallback((language) => {
        setSelectedLanguage(language);
        // setShowLanguageMenu(false);
        // Here you would implement actual language switching logic
        console.log(`Language changed to: ${language}`);
    }, []);

    // Formatting transcript
    const formatChatForDownload = () => {
        return chatMessages.map(msg => {
            if (msg.from === 'user') {
                return `USER: ${msg.text}\n`;
            } else {
                return `QLIK: ${extractTextFromResponse(msg)}\n`;
            }
        }).join('\n');
    };

    // Download transcript function
    const downloadTranscript = () => {
        const text = formatChatForDownload();
        const blob = new Blob([text], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chat-transcript.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    // Auto scroll effect after new messages are posted to chat interface
    useEffect(() => {
        if (chatBodyRef.current) {
            const scrollOptions = {
                top: isMinimized 
                    ? chatBodyRef.current.scrollHeight - 100  // Scroll closer to bottom when minimized
                    : chatBodyRef.current.scrollHeight - 530, // Leave 530px from bottom when full view
                behavior: 'smooth'
            };
            setTimeout(() => {
                chatBodyRef.current.scrollTo(scrollOptions);
            }, 100); // Small delay to ensure content is rendered
        }
    }, [chatMessages, isMinimized]);

    // Press Enter key to send message
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (intent.trim().length > 0) {
                onLandingIntentBoxClick();
            }
        }
    }, [intent, onLandingIntentBoxClick]);

    // Handle attachment button click
    const handleAttachmentClick = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, []);

    // Handle file selection
    const handleFileUpload = useCallback((event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            setUploadedFiles(prev => [...prev, ...files]);
            console.log('Files uploaded:', files);
            // Reset the input to allow selecting the same file again
            event.target.value = '';
        }
    }, []);

    // Remove uploaded file
    const removeFile = useCallback((index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    }, []);

    const enableSend = intent.trim().length>0;

    // Transition from functions to visible elements

    return (
        //Home Landing page
        <div className="homeStatic">
            
            {!isChatStarted ? (
                <>
                    {/* Decorative AI curls that fade in and out of landing interface */}
                    <div className="mainContent">
                        <div className="AICurls">
                            <img className="leftAICurls" alt="Left AI Curls" src={leftAICurls}/>
                            <img className="grayLeftAICurls" alt="Gray Left AI Curls" src={grayLeftAICurls}/>
                            <img className="grayRightAICurls" alt="GrayRight AI Curls" src={grayRightAICurls}/>
                            <img className="rightAICurls" alt="Right AI Curls" src={rightAICurls}/>
                        </div>
                        {/* Landing page Icon and text to invite user to converse */}
                        <b className="invitationToConverse">How can we help you?</b>
                        <p className="landingSubheading">Please provide detailed information in the form below:</p>

                        {/* Landing page intention box */}
                        <div className={`landingIntentBox ${enableSend ? 'active' : ''} ${showSuggestions ? 'expanded' : ''}`}>
                            <textarea 
                                id='intent' 
                                value={intent} 
                                placeholder='Please explain your situation...' 
                                onChange={handleIntentChange}
                                onKeyDown={handleKeyPress}
                                className='intentTextarea' 
                                rows={3}
                            ></textarea>
                            
                            {/* Hidden file input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                                multiple
                                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                            />
                            
                            <button
                                className="attachBtn" 
                                onClick={handleAttachmentClick}
                            >
                                <img alt="Attachment" src={attachment}/>
                            </button>
                            <button className={ `sendBtn ${enableSend ? 'active' : 'inactive'}`} onClick={onLandingIntentBoxClick} disabled={!enableSend}>
                                <img alt="Send" src={enableSend ? sendIcon_green : sendIcon}></img>
                            </button>
                        </div>
                        {/* Display uploaded files outside the intent box */}
                        {uploadedFiles.length > 0 && (
                            <div className="uploadedFilesDisplay">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="fileDisplayItem">
                                        <span className="fileName">{file.name}</span>
                                        <span className="fileType">({file.type || 'Unknown type'})</span>
                                        <button 
                                            onClick={() => removeFile(index)}
                                            className="removeFileBtn"
                                            title="Remove file"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                {/* Plus button to add more files */}
                                <button 
                                    className="addMoreFilesBtn"
                                    onClick={handleAttachmentClick}
                                >
                                    +
                                </button>
                            </div>
                        )}
                        

                        {/* Autocomplete suggestions */}
                        {showSuggestions && filteredSuggestions.length > 0 && (
                            <div className="autocompleteDropdown">
                                {filteredSuggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="suggestionItem"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        <img alt="Suggestion" src={searchIcon} />
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Explore article and critical issues buttons */}
                            <div className="existingButtons">
                                <button className="articles">
                                    <img alt="Articles" src={articleIcon}></img>
                                    <p>EXPLORE ARTICLES</p>
                                </button>
                                <button className="criticalIssues">
                                    <img alt="Critical Issues" src={criticalIcon}></img>
                                    <p>CRITICAL ISSUES</p>
                                </button>
                            </div>
                        </div>
                </>
            ) : (
                <div className="mainContent">
                        <div className="AICurls">
                            <img className="leftAICurls" alt="Left AI Curls" src={leftAICurls}/>
                            <img className="grayLeftAICurls" alt="Gray Left AI Curls" src={grayLeftAICurls}/>
                            <img className="grayRightAICurls" alt="GrayRight AI Curls" src={grayRightAICurls}/>
                            <img className="rightAICurls" alt="Right AI Curls" src={rightAICurls}/>
                        </div>
                        <b className={`invitationToConverse ${chatMessages.length > 1 ? 'chatStarted' : ''}`}>How can we help you?</b>
                        <p className="landingSubheading">Please provide detailed information in the form below:</p>
                        <div className='chatBody' ref={chatBodyRef}>
                            {/* Tab navigation - only show after AI response */}
                            {chatMessages.some(msg => msg.from === 'ai') && (
                                <div className="tabNavigationContainer">
                                    <div className="tabNavigation">
                                        <button 
                                            className={`tab ${activeTab === 'solve' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('solve')}
                                        >
                                            <img src={activeTab === 'solve' ? questionActiveIcon : questionIcon} alt="Solve Now" />
                                            Solve Now
                                        </button>
                                        <button 
                                            className={`tab ${activeTab === 'contact' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('contact')}
                                        >
                                            <img src={activeTab === 'contact' ? contactActiveIcon : contactIcon} alt="Contact Us" />
                                            Contact Us
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Tab content */}
                            {activeTab === 'solve' ? (
                                <div className="chatMessages">
                                    {/* Adding user's repsone to chat interface as a message box */}
                                    {chatMessages.map((msg, index) => 
                                        msg.from ==='user' ? (
                                            <div key={index} className={`chatMessage ${msg.from}`}>
                                                {/* {msg.text} */}
                                            </div>
                                        ) : (
                                            // Adding ADA's repsone to chat interface, including populating source's URL in accordion 
                                            <div key={index} className="chatResponse">
                                                <div className='responseContent'>
                                                    <div className="responseHeader">
                                                        <p>Your curated solution:</p>
                                                    </div>
                                                    <div className="responseText">
                                                        {formatResponseText(msg.text)}
                                                    </div>
                                                    {getUrl(msg.text).length > 0 && (
                                                        <details className="sourcesAccordion">
                                                            <summary>Sources</summary>
                                                            <div className="sourcesList">
                                                                <ul>
                                                                    {getUrl(msg.text).map((link,i) => (
                                                                        <li key={i}>
                                                                        <a
                                                                        href={link}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        >
                                                                            {link}
                                                                        </a>
                                                                    </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </details>
                                                    )}
                                                    {/* Formatting ADA's response on front end by bolding text based on starting with a number or ending with a colon for  instructions */}
                                                    {getQuestionLines(msg.text).length > 0 && (
                                                        <div className="questionLines">
                                                            {getQuestionLines(msg.text).map((questionLine, i) => (
                                                                <div key={i} className="questionLine">
                                                                    {/* Use a special formatter that doesn't filter question lines */}
                                                                    {(() => {
                                                                        const urlRegex = /(https?:\/\/[^\s]+?)([.!?]?)(\s|$)/g;
                                                                        const numberedColonMatch = questionLine.match(/^(\d+[\.\)\:]?\s*.*?:)/);
                                                                        
                                                                        return (
                                                                            <span>
                                                                                {numberedColonMatch ? (
                                                                                    // Find the first capital letter after the first colon
                                                                                    (() => {
                                                                                        const colonIndex = questionLine.indexOf(':');
                                                                                        if (colonIndex !== -1) {
                                                                                            const afterColon = questionLine.substring(colonIndex + 1);
                                                                                            const capitalMatch = afterColon.match(/[A-Z]/);
                                                                                            
                                                                                            if (capitalMatch) {
                                                                                                const capitalIndex = colonIndex + 1 + capitalMatch.index;
                                                                                                const boldPart = questionLine.substring(0, capitalIndex);
                                                                                                const normalPart = questionLine.substring(capitalIndex);
                                                                                                
                                                                                                return (
                                                                                                    <>
                                                                                                        <strong>
                                                                                                            {boldPart.split(urlRegex).map((part, j) => {
                                                                                                                const urlMatch = part.match(/^https?:\/\/[^\s]+/);
                                                                                                                if (urlMatch) {
                                                                                                                    return (
                                                                                                                        <a key={j} href={part} target="_blank" rel="noopener noreferrer">
                                                                                                                            {part}
                                                                                                                        </a>
                                                                                                                    );
                                                                                                                }
                                                                                                                return part;
                                                                                                            })}
                                                                                                        </strong>
                                                                                                        {normalPart.split(urlRegex).map((part, j) => {
                                                                                                            const urlMatch = part.match(/^https?:\/\/[^\s]+/);
                                                                                                            if (urlMatch) {
                                                                                                                return (
                                                                                                                    <a key={j} href={part} target="_blank" rel="noopener noreferrer">
                                                                                                                        {part}
                                                                                                                    </a>
                                                                                                                );
                                                                                                            }
                                                                                                            return part;
                                                                                                        })}
                                                                                                    </>
                                                                                                );
                                                                                            } else {
                                                                                                // No capital letter after colon, bold up to and including the colon
                                                                                                const boldPart = questionLine.substring(0, colonIndex + 1);
                                                                                                const normalPart = questionLine.substring(colonIndex + 1);
                                                                                                
                                                                                                return (
                                                                                                    <>
                                                                                                        <strong>
                                                                                                            {boldPart.split(urlRegex).map((part, j) => {
                                                                                                                const urlMatch = part.match(/^https?:\/\/[^\s]+/);
                                                                                                                if (urlMatch) {
                                                                                                                    return (
                                                                                                                        <a key={j} href={part} target="_blank" rel="noopener noreferrer">
                                                                                                                            {part}
                                                                                                                        </a>
                                                                                                                    );
                                                                                                                }
                                                                                                                return part;
                                                                                                            })}
                                                                                                        </strong>
                                                                                                        {normalPart.split(urlRegex).map((part, j) => {
                                                                                                            const urlMatch = part.match(/^https?:\/\/[^\s]+/);
                                                                                                            if (urlMatch) {
                                                                                                                return (
                                                                                                                    <a key={j} href={part} target="_blank" rel="noopener noreferrer">
                                                                                                                        {part}
                                                                                                                    </a>
                                                                                                                );
                                                                                                            }
                                                                                                            return part;
                                                                                                        })}
                                                                                                    </>
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                        
                                                                                        // Fallback: bold the entire line if no colon found
                                                                                        return questionLine.split(urlRegex).map((part, j) => {
                                                                                            const urlMatch = part.match(/^https?:\/\/[^\s]+/);
                                                                                            if (urlMatch) {
                                                                                                return (
                                                                                                    <a key={j} href={part} target="_blank" rel="noopener noreferrer">
                                                                                                        {part}
                                                                                                    </a>
                                                                                                );
                                                                                            }
                                                                                            return <strong key={j}>{part}</strong>;
                                                                                        });
                                                                                    })()
                                                                                ) : (
                                                                                    // Line doesn't match pattern - process URLs only
                                                                                    questionLine.split(urlRegex).map((part, j) => {
                                                                                        const urlMatch = part.match(/^https?:\/\/[^\s]+/);
                                                                                        if (urlMatch) {
                                                                                            return (
                                                                                                <a key={j} href={part} target="_blank" rel="noopener noreferrer">
                                                                                                    {part}
                                                                                                </a>
                                                                                            );
                                                                                        }
                                                                                        return part;
                                                                                    })
                                                                                )}
                                                                            </span>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                {/* Hard-coded ending statement */}
                                                <div className="endStatement">
                                                    <p>If you need further assistance or have any questions, feel free to ask!</p>
                                                </div>
                                                {/* Icons under ADA's response to copy , like, dislike, and make ADA reponse txt-to-speech */}
                                                <div className="postResponseIcons">
                                                    <button className='copyBtn' onClick={() => copyClick(msg)}>
                                                        <img className="Copy" alt="Copy" src={copiedStates[msg.id] ? copyCheckIcon : copyIcon} />
                                                    </button>
                                                    {!isDisliked && (
                                                        <button className='likeBtn' onClick={() => setIsLiked(!isLiked)}>
                                                            <img className="Like" alt="Like" src={isLiked ? likeIconFill : likeIcon} />
                                                        </button>
                                                    )}
                                                    {!isLiked && (
                                                        <button className='dislikeBtn' onClick={() => setIsDisliked(!isDisliked)}>
                                                            <img className="Dislike" alt="Dislike" src={isDisliked ? dislikeIconFill : dislikeIcon} />
                                                        </button>
                                                    )}
                                                    <button className='readBtn' onClick={() => readAloud(msg)}>
                                                        <img className="Read" alt="Read" src={isReading[msg.id] ? stopIcon : speakerIcon} />
                                                    </button>
                                                </div>
                                                </div>
                                        </div>
                                    )
                                    )}
                                </div>
                            ) : (
                                <div className="contactUsContent">
                                    <div className="contactForm">
                                        <h3>Contact Our Support Team</h3>
                                        <p>If you need additional assistance, our support team is here to help.</p>
                                        
                                        <form className="supportForm">
                                            <div className="formGroup">
                                                <label htmlFor="contactName">Name</label>
                                                <input type="text" id="contactName" placeholder="Your full name" />
                                            </div>
                                            
                                            <div className="formGroup">
                                                <label htmlFor="contactEmail">Email</label>
                                                <input type="email" id="contactEmail" placeholder="your.email@company.com" />
                                            </div>
                                            
                                            <div className="formGroup">
                                                <label htmlFor="contactSubject">Subject</label>
                                                <input type="text" id="contactSubject" placeholder="Brief description of your issue" />
                                            </div>
                                            
                                            <div className="formGroup">
                                                <label htmlFor="contactMessage">Message</label>
                                                <textarea 
                                                    id="contactMessage" 
                                                    rows="4" 
                                                    placeholder="Please provide detailed information about your issue..."
                                                ></textarea>
                                            </div>
                                            
                                            <div className="formGroup">
                                                <label htmlFor="contactPriority">Priority Level</label>
                                                <select id="contactPriority">
                                                    <option value="low">Low</option>
                                                    <option value="medium" selected>Medium</option>
                                                    <option value="high">High</option>
                                                    <option value="urgent">Urgent</option>
                                                </select>
                                            </div>
                                            
                                            <button type="submit" className="submitContactBtn">
                                                Submit Support Request
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {showProgress && (
                                <div className="responseProgress">
                                    {/* Loading animation when retrieving ADA response */}
                                    <div className="loadingCircles">
                                        <div className="circle"></div>
                                        <div className="circle"></div>
                                        <div className="circle"></div>
                                    </div>
                                    <p className="progressText">
                                        Searching the Qlik Knowledge Fabric...
                                    </p>
                                </div>
                            )}

                            

                        </div>

                        {/* Explore article and critical issues buttons */}
                        <div className="existingButtons">
                            <button className="articles">
                                <img alt="Articles" src={articleIcon}></img>
                                <p>EXPLORE ARTICLES</p>
                            </button>
                            <button className="criticalIssues">
                                <img alt="Critical Issues" src={criticalIcon}></img>
                                <p>CRITICAL ISSUES</p>
                            </button>
                        </div>
                   
                </div>
            )}
        </div>
    );
}

export default App;