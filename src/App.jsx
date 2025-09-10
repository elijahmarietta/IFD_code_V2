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
import accountRelatedIcon from './assets/accountRelated.svg'
import productRelatedIcon from './assets/productRelated.svg'
import analyticsIcon from './assets/Data Analytics.svg'
import integrationIcon from './assets/Data Integration.svg'
import cloudIcon from './assets/Qlik Cloud.svg'
import talendIcon from './assets/Talend.svg'
import checkIcon from './assets/Check.svg'

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
        "What factors influence community responsiveness—like posting in the right forum or familiarity with terminology?",
        "Where can I find archived Q&A or knowledge bases for troubleshooting latency or performance issues?",
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
    const [isContact1, setIsContact1] = useState(false);
    const [isContact2, setIsContact2] = useState(false);
    const [isContact3, setIsContact3] = useState(false);
    const [isContact4, setIsContact4] = useState(false);
    const [isAccountRelated, setIsAccountRelated] = useState(false);
    const [isProductRelated, setIsProductRelated] = useState(false);
    const [isAnalytics, setIsAnalytics] = useState(false);
    const [isIntegration, setIsIntegration] = useState(false);
    const [isCloud, setIsCloud] = useState(false);
    const [isTalend, setIsTalend] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [showProgress2, setShowProgress2] = useState(false);
    const [showProgress3, setShowProgress3] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
    const [isNprinting, setIsNprinting] = useState(false);
    const [isQlikAlerting, setIsQlikAlerting] = useState(false);
    const [isQlikGeoAnalyticsQlikView, setIsQlikGeoAnalyticsQlikView] = useState(false);
    const [isQlikODBCConnector, setIsQlikODBCConnector] = useState(false);
    const [isQlikRestConnector, setIsQlikRestConnector] = useState(false);
    const [isQlikSAPConnector, setIsQlikSAPConnector] = useState(false);
    const [isQlikSenseDesktop, setIsQlikSenseDesktop] = useState(false);
    const [isQlikSenseEnterprise, setIsQlikSenseEnterprise] = useState(false);
    const [isQlikSenseKubernetes, setIsQlikSenseKubernetes] = useState(false);
    const [isQlikSenseGeoAnalyticsQlikSense, setIsQlikSenseGeoAnalyticsQlikSense] = useState(false);
    const [isQlikSenseGeoAnalyticsPlus, setIsQlikSenseGeoAnalyticsPlus] = useState(false);
    const [isQlikSenseGeoAnalyticsServer, setIsQlikSenseGeoAnalyticsServer] = useState(false);
    const [isQlikSenseMobile, setIsQlikSenseMobile] = useState(false);
    const [isQlikView, setIsQlikView] = useState(false);
    const [isQlikWebConnectors, setIsQlikWebConnectors] = useState(false);
    const [showIntentBox1, setShowIntentBox1] = useState(false);
    const [showIntentBox2, setShowIntentBox2] = useState(false);
    const [showIntentBox3, setShowIntentBox3] = useState(false);
    const [showIntentBox4, setShowIntentBox4] = useState(false);
    const [showIntentBox5, setShowIntentBox5] = useState(false);
    const [showIntentBox6, setShowIntentBox6] = useState(false);
    const [showIntentBox7, setShowIntentBox7] = useState(false);
    const [showIntentBox8, setShowIntentBox8] = useState(false);
    const [showIntentBox9, setShowIntentBox9] = useState(false);
    const [showIntentBox10, setShowIntentBox10] = useState(false);
    const [showIntentBox11, setShowIntentBox11] = useState(false);
    const [showIntentBox12, setShowIntentBox12] = useState(false);
    const [showIntentBox13, setShowIntentBox13] = useState(false);
    const [showIntentBox14, setShowIntentBox14] = useState(false);
    const [showIntentBox15, setShowIntentBox15] = useState(false);
    const [showIntentBox16, setShowIntentBox16] = useState(false);
    const [showIntentBox17, setShowIntentBox17] = useState(false);
    const [showIntentBox18, setShowIntentBox18] = useState(false);
    const [showIntentBox19, setShowIntentBox19] = useState(false);
    const [showIntentBox20, setShowIntentBox20] = useState(false);

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
            const response = await fetch('https://b508e65777bb.ngrok-free.app/api/chat', {
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


    //Add delay for displaying AI response (older function, may not need anymore)
    useEffect(() => {
        let delayTimer;
        if (isAwaitingAI) {
            delayTimer = setTimeout(() => setShowProgress(true), 300);
            setShowProgress2(false);
            setShowProgress3(false);
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
            setShowProgress(true);

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
            if (!showIntentBox1 && !showIntentBox2 && !showIntentBox3 && !showIntentBox4 && !showIntentBox5 && !showIntentBox6 && !showIntentBox7 && !showIntentBox8 && !showIntentBox9 && !showIntentBox10 && !showIntentBox11 && !showIntentBox12 && !showIntentBox13 && !showIntentBox14 && !showIntentBox15 && !showIntentBox16 && !showIntentBox17 && !showIntentBox18 && !showIntentBox19 && !showIntentBox20) {
                setShowIntentBox1(true);
                console.log("Intent Box 0 to 1");
            }
            else if (showIntentBox1) {
                setShowIntentBox1(false);
                setShowIntentBox2(true);
                setShowIntentBox3(false);
                setShowIntentBox4(false);
                setShowIntentBox5(false);  
                setShowIntentBox6(false);
                setShowIntentBox7(false);
                setShowIntentBox8(false);
                setShowIntentBox9(false);
                setShowIntentBox10(false);
                setShowIntentBox11(false);
                setShowIntentBox12(false);
                setShowIntentBox13(false);
                setShowIntentBox14(true);
                setShowIntentBox15(false);
                setShowIntentBox16(false);
                setShowIntentBox17(false);  
                setShowIntentBox18(false);
                setShowIntentBox19(false);
                setShowIntentBox20(false);
                console.log("Intent Box 1 to 2");
            }
        }
    }, [intent, resetTimer, startTimer, stopTimer, audioRef, isSoundEnabled, sendIntentToAPI]);

    const onLandingIntentBoxChatClick = useCallback(async() => {
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
            setShowProgress(true);

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
            if (!showIntentBox1 && !showIntentBox2 && !showIntentBox3 && !showIntentBox4 && !showIntentBox5 && !showIntentBox6 && !showIntentBox7 && !showIntentBox8 && !showIntentBox9 && !showIntentBox10 && !showIntentBox11 && !showIntentBox12 && !showIntentBox13 && !showIntentBox14 && !showIntentBox15 && !showIntentBox16 && !showIntentBox17 && !showIntentBox18 && !showIntentBox19 && !showIntentBox20) {
                setShowIntentBox1(true);
                console.log("Intent Box 0 to 1");
            }
            else if (showIntentBox1) {
                setShowIntentBox1(false);
                setShowIntentBox2(true);
                setShowIntentBox3(false);
                setShowIntentBox4(false);
                setShowIntentBox5(false);  
                setShowIntentBox6(false);
                setShowIntentBox7(false);
                setShowIntentBox8(false);
                setShowIntentBox9(false);
                setShowIntentBox10(false);
                setShowIntentBox11(false);
                setShowIntentBox12(false);
                setShowIntentBox13(false);
                setShowIntentBox14(true);
                setShowIntentBox15(false);
                setShowIntentBox16(false);
                setShowIntentBox17(false);  
                setShowIntentBox18(false);
                setShowIntentBox19(false);
                setShowIntentBox20(false);
                console.log("Intent Box 1 to 2");
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

    // Going to Page 1 of the Contact Form
    const contact1 = useCallback(() => {
            console.log("Contact 1");
            setIsContact1(true);
            setIsContact2(false);
            setIsContact3(false);
    }, []);
    
    // Going to Page 2 of the Contact Form
    const contact2 = useCallback(() => {
            setIsContact1(false);
            setIsContact2(true);
            setIsContact3(false);
    }, []);

    // Going to Page 3 of the Contact Form
    const contact3 = useCallback(() => {
            setIsContact1(false);
            setIsContact2(false);
            setIsContact3(true);
    }, []);

    // Going to Page 4 of the Contact Form
    const contact4 = useCallback(() => {
        setIsContact4(true);
    }, []);

    // Setting case as Account Related

    const accountRelated = useCallback(() => {
        setIsAccountRelated(true);
        setIsProductRelated(false);
    }, []);

    // Setting case as Product Related
    const productRelated = useCallback(() => {
        setIsProductRelated(true);
        setIsAccountRelated(false);
    }, []);

    // Setting case as Data Analytics
    const analyticsRelated = useCallback(() => {
        setIsAnalytics(true);
        setIsIntegration(false);
        setIsCloud(false);
        setIsTalend(false);
    }, []);

    // Setting case as Data Integration
    const integrationRelated = useCallback(() => {
        setIsAnalytics(false);
        setIsIntegration(true);
        setIsCloud(false);
        setIsTalend(false);
    }, []);

    // Setting case as Qlik Cloud
    const cloudRelated = useCallback(() => {
        setIsAnalytics(false);
        setIsIntegration(false);
        setIsCloud(true);
        setIsTalend(false);
    }, []);

    // Setting case as Talend
    const talendRelated = useCallback(() => {
        setIsAnalytics(false);
        setIsIntegration(false);
        setIsCloud(false);
        setIsTalend(true);
    }, []);

    // Changing the content of the product area based on the product

    const training = useCallback(() => {
        setIsTraining(true);
        setIsNprinting(false);
        setIsQlikAlerting(false);
        setIsQlikGeoAnalyticsQlikView(false);
        setIsQlikODBCConnector(false);
        setIsQlikRestConnector(false);
        setIsQlikSAPConnector(false);
        setIsQlikSenseDesktop(false);
        setIsQlikSenseEnterprise(false);
        setIsQlikSenseKubernetes(false);
        setIsQlikSenseGeoAnalyticsQlikSense(false);
        setIsQlikSenseGeoAnalyticsPlus(false);
        setIsQlikSenseGeoAnalyticsServer(false);
        setIsQlikSenseMobile(false);
        setIsQlikView(false);
        setIsQlikWebConnectors(false);
    }, []);

    const nprinting = useCallback(() => {
        setIsTraining(false);
        setIsNprinting(true);
        setIsQlikAlerting(false);
        setIsQlikGeoAnalyticsQlikView(false);
        setIsQlikODBCConnector(false);
        setIsQlikRestConnector(false);
        setIsQlikSAPConnector(false);
        setIsQlikSenseDesktop(false);
        setIsQlikSenseEnterprise(false);
        setIsQlikSenseKubernetes(false);
        setIsQlikSenseGeoAnalyticsQlikSense(false);
        setIsQlikSenseGeoAnalyticsPlus(false);
        setIsQlikSenseGeoAnalyticsServer(false);
        setIsQlikSenseMobile(false);
        setIsQlikView(false);
        setIsQlikWebConnectors(false);
    }, []);

    const qlikAlerting = useCallback(() => {
        setIsTraining(false);
        setIsNprinting(false);
        setIsQlikAlerting(true);
        setIsQlikGeoAnalyticsQlikView(false);
        setIsQlikODBCConnector(false);
        setIsQlikRestConnector(false);
        setIsQlikSAPConnector(false);
        setIsQlikSenseDesktop(false);
        setIsQlikSenseEnterprise(false);
        setIsQlikSenseKubernetes(false);
        setIsQlikSenseGeoAnalyticsQlikSense(false);
        setIsQlikSenseGeoAnalyticsPlus(false);
        setIsQlikSenseGeoAnalyticsServer(false);
        setIsQlikSenseMobile(false);
        setIsQlikView(false);
        setIsQlikWebConnectors(false);
    }, []);

    const qlikGeoAnalyticsQlikView = useCallback(() => {
        setIsTraining(false);
        setIsNprinting(false);
        setIsQlikAlerting(false);
        setIsQlikGeoAnalyticsQlikView(true);
        setIsQlikODBCConnector(false);
        setIsQlikRestConnector(false);
        setIsQlikSAPConnector(false);
        setIsQlikSenseDesktop(false);
        setIsQlikSenseEnterprise(false);
        setIsQlikSenseKubernetes(false);
        setIsQlikSenseGeoAnalyticsQlikSense(false);
        setIsQlikSenseGeoAnalyticsPlus(false);
        setIsQlikSenseGeoAnalyticsServer(false);
        setIsQlikSenseMobile(false);
        setIsQlikView(false);
        setIsQlikWebConnectors(false);
    }, []);

    const qlikODBCConnector = useCallback(() => {
        setIsTraining(false);
        setIsNprinting(false);
        setIsQlikAlerting(false);
        setIsQlikGeoAnalyticsQlikView(false);
        setIsQlikODBCConnector(true);
        setIsQlikRestConnector(false);
        setIsQlikSAPConnector(false);
        setIsQlikSenseDesktop(false);
        setIsQlikSenseEnterprise(false);
        setIsQlikSenseKubernetes(false);
        setIsQlikSenseGeoAnalyticsQlikSense(false);
        setIsQlikSenseGeoAnalyticsPlus(false);
        setIsQlikSenseGeoAnalyticsServer(false);
        setIsQlikSenseMobile(false);
        setIsQlikView(false);
        setIsQlikWebConnectors(false);
    }, []);

    const qlikRestConnector = useCallback(() => {
        setIsTraining(false);
        setIsNprinting(false);
        setIsQlikAlerting(false);
        setIsQlikGeoAnalyticsQlikView(false);
        setIsQlikODBCConnector(false);
        setIsQlikRestConnector(true);
        setIsQlikSAPConnector(false);
        setIsQlikSenseDesktop(false);
        setIsQlikSenseEnterprise(false);
        setIsQlikSenseKubernetes(false);
        setIsQlikSenseGeoAnalyticsQlikSense(false);
        setIsQlikSenseGeoAnalyticsPlus(false);
        setIsQlikSenseGeoAnalyticsServer(false);
        setIsQlikSenseMobile(false);
        setIsQlikView(false);
        setIsQlikWebConnectors(false);
    }, []);

    const qlikSAPConnector = useCallback(() => {
        setIsTraining(false);
        setIsNprinting(false);
        setIsQlikAlerting(false);
        setIsQlikGeoAnalyticsQlikView(false);
        setIsQlikODBCConnector(false);
        setIsQlikRestConnector(false);
        setIsQlikSAPConnector(true);
        setIsQlikSenseDesktop(false);
        setIsQlikSenseEnterprise(false);
        setIsQlikSenseKubernetes(false);
        setIsQlikSenseGeoAnalyticsQlikSense(false);
        setIsQlikSenseGeoAnalyticsPlus(false);
        setIsQlikSenseGeoAnalyticsServer(false);
        setIsQlikSenseMobile(false);
        setIsQlikView(false);
        setIsQlikWebConnectors(false);
    }, []);

    const qlikSenseDesktop = useCallback(() => {
        setIsTraining(false);
        setIsNprinting(false);
        setIsQlikAlerting(false);
        setIsQlikGeoAnalyticsQlikView(false);
        setIsQlikODBCConnector(false);
        setIsQlikRestConnector(false);
        setIsQlikSAPConnector(false);
        setIsQlikSenseDesktop(true);
        setIsQlikSenseEnterprise(false);
        setIsQlikSenseKubernetes(false);
        setIsQlikSenseGeoAnalyticsQlikSense(false);
        setIsQlikSenseGeoAnalyticsPlus(false);
        setIsQlikSenseGeoAnalyticsServer(false);
        setIsQlikSenseMobile(false);
        setIsQlikView(false);
        setIsQlikWebConnectors(false);
    }, []);

    const qlikSenseEnterprise = useCallback(() => {
        setIsTraining(false);
        setIsNprinting(false);
        setIsQlikAlerting(false);
        setIsQlikGeoAnalyticsQlikView(false);
        setIsQlikODBCConnector(false);
        setIsQlikRestConnector(false);
        setIsQlikSAPConnector(false);
        setIsQlikSenseDesktop(false);
        setIsQlikSenseEnterprise(true);
        setIsQlikSenseKubernetes(false);
        setIsQlikSenseGeoAnalyticsQlikSense(false);
        setIsQlikSenseGeoAnalyticsPlus(false);
        setIsQlikSenseGeoAnalyticsServer(false);
        setIsQlikSenseMobile(false);
        setIsQlikView(false);
        setIsQlikWebConnectors(false);
    }, []);

    const qlikSenseKubernetes = useCallback(() => {
        setIsTraining(false);
        setIsNprinting(false);
        setIsQlikAlerting(false);
        setIsQlikGeoAnalyticsQlikView(false);
        setIsQlikODBCConnector(false);
        setIsQlikRestConnector(false);
        setIsQlikSAPConnector(false);
        setIsQlikSenseDesktop(false);
        setIsQlikSenseEnterprise(false);
        setIsQlikSenseKubernetes(true);
        setIsQlikSenseGeoAnalyticsQlikSense(false);
        setIsQlikSenseGeoAnalyticsPlus(false);
        setIsQlikSenseGeoAnalyticsServer(false);
        setIsQlikSenseMobile(false);
        setIsQlikView(false);
        setIsQlikWebConnectors(false);
    }, []);

    const qlikSenseGeoAnalyticsQlikSense = useCallback(() => {
        setIsTraining(false);
        setIsNprinting(false);
        setIsQlikAlerting(false);
        setIsQlikGeoAnalyticsQlikView(false);
        setIsQlikODBCConnector(false);
        setIsQlikRestConnector(false);
        setIsQlikSAPConnector(false);
        setIsQlikSenseDesktop(false);
        setIsQlikSenseEnterprise(false);
        setIsQlikSenseKubernetes(false);
        setIsQlikSenseGeoAnalyticsQlikSense(true);
        setIsQlikSenseGeoAnalyticsPlus(false);
        setIsQlikSenseGeoAnalyticsServer(false);
        setIsQlikSenseMobile(false);
        setIsQlikView(false);
        setIsQlikWebConnectors(false);
    }, []);

    const qlikSenseGeoAnalyticsPlus = useCallback(() => {
        setIsTraining(false);
        setIsNprinting(false);
        setIsQlikAlerting(false);
        setIsQlikGeoAnalyticsQlikView(false);
        setIsQlikODBCConnector(false);
        setIsQlikRestConnector(false);
        setIsQlikSAPConnector(false);
        setIsQlikSenseDesktop(false);
        setIsQlikSenseEnterprise(false);
        setIsQlikSenseKubernetes(false);
        setIsQlikSenseGeoAnalyticsQlikSense(false);
        setIsQlikSenseGeoAnalyticsPlus(true);
        setIsQlikSenseGeoAnalyticsServer(false);
        setIsQlikSenseMobile(false);
        setIsQlikView(false);
        setIsQlikWebConnectors(false);
    }, []);

    const qlikSenseGeoAnalyticsServer = useCallback(() => {
        setIsTraining(false);
        setIsNprinting(false);
        setIsQlikAlerting(false);
        setIsQlikGeoAnalyticsQlikView(false);
        setIsQlikODBCConnector(false);
        setIsQlikRestConnector(false);
        setIsQlikSAPConnector(false);
        setIsQlikSenseDesktop(false);
        setIsQlikSenseEnterprise(false);
        setIsQlikSenseKubernetes(false);
        setIsQlikSenseGeoAnalyticsQlikSense(false);
        setIsQlikSenseGeoAnalyticsPlus(false);
        setIsQlikSenseGeoAnalyticsServer(true);
        setIsQlikSenseMobile(false);
        setIsQlikView(false);
        setIsQlikWebConnectors(false);
    }, []);

    const qlikSenseMobile = useCallback(() => {
        setIsTraining(false);
        setIsNprinting(false);
        setIsQlikAlerting(false);
        setIsQlikGeoAnalyticsQlikView(false);
        setIsQlikODBCConnector(false);
        setIsQlikRestConnector(false);
        setIsQlikSAPConnector(false);
        setIsQlikSenseDesktop(false);
        setIsQlikSenseEnterprise(false);
        setIsQlikSenseKubernetes(false);
        setIsQlikSenseGeoAnalyticsQlikSense(false);
        setIsQlikSenseGeoAnalyticsPlus(false);
        setIsQlikSenseGeoAnalyticsServer(false);
        setIsQlikSenseMobile(true);
        setIsQlikView(false);
        setIsQlikWebConnectors(false);
    }, []);

    const qlikView = useCallback(() => {
        setIsTraining(false);
        setIsNprinting(false);
        setIsQlikAlerting(false);
        setIsQlikGeoAnalyticsQlikView(false);
        setIsQlikODBCConnector(false);
        setIsQlikRestConnector(false);
        setIsQlikSAPConnector(false);
        setIsQlikSenseDesktop(false);
        setIsQlikSenseEnterprise(false);
        setIsQlikSenseKubernetes(false);
        setIsQlikSenseGeoAnalyticsQlikSense(false);
        setIsQlikSenseGeoAnalyticsPlus(false);
        setIsQlikSenseGeoAnalyticsServer(false);
        setIsQlikSenseMobile(false);
        setIsQlikView(true);
        setIsQlikWebConnectors(false);
    }, []);

    const qlikWebConnectors = useCallback(() => {
        setIsTraining(false);
        setIsNprinting(false);
        setIsQlikAlerting(false);
        setIsQlikGeoAnalyticsQlikView(false);
        setIsQlikODBCConnector(false);
        setIsQlikRestConnector(false);
        setIsQlikSAPConnector(false);
        setIsQlikSenseDesktop(false);
        setIsQlikSenseEnterprise(false);
        setIsQlikSenseKubernetes(false);
        setIsQlikSenseGeoAnalyticsQlikSense(false);
        setIsQlikSenseGeoAnalyticsPlus(false);
        setIsQlikSenseGeoAnalyticsServer(false);
        setIsQlikSenseMobile(false);
        setIsQlikView(false);
        setIsQlikWebConnectors(true);
    }, []);


    // Handle dropdown change
    const handleChange = useCallback((e) => {
        setSelectedOption(e.target.value);
    }, []);

    // Visual feedback progress

    useEffect(() => {
        const progressTimer1 = setTimeout(() => {
        setShowProgress2(true);
        console.log('Progress 2 started');
        }, 10000);

        return () => clearTimeout(progressTimer1);
    }, []);

    useEffect(() => {
        const progressTimer2 = setTimeout(() => {
        setShowProgress3(true);
        console.log('Progress 3 started');
        }, 18000);

        return () => clearTimeout(progressTimer2);
    }, []);

    // Showing and hiding the intent box

    const showIntent2 = useCallback(() => {
        setShowIntentBox1(false);
        setShowIntentBox2(true);
        setShowIntentBox3(false);
        setShowIntentBox4(false);
        setShowIntentBox5(false);
        setShowIntentBox6(false);
        setShowIntentBox7(false);
        setShowIntentBox8(false);
        setShowIntentBox9(false);
        setShowIntentBox10(false);
        setShowIntentBox11(false);
        setShowIntentBox12(false);
        setShowIntentBox13(false);
        setShowIntentBox14(false);
        setShowIntentBox15(false);
        setShowIntentBox16(false);
        setShowIntentBox17(true);
        setShowIntentBox18(false);
        setShowIntentBox19(false);
        setShowIntentBox20(false);
    }, []);

    const hiddenStyle = {
        display: 'none'
    };

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

                                    {/* Adding user's response to chat interface as a message box */}
                                    {chatMessages.map((msg, index) =>
                                            msg.from ==='user' ? (
                                                chatMessages.length > 2 ? (
                                                    <div key={index} className={`chatMessage ${msg.from}`}>
                                                        {msg.text}
                                                    </div>
                                                ) : (
                                                    <div className="errorMessage">
                                                    </div>
                                            )
                                        ) : (
                                            // Adding ADA's repsone to chat interface, including populating source's URL in accordion 
                                            <div key={index} className="chatResponse">
                                                <div className='responseContent'>
                                                    <details className="stepsAccordion">
                                                            <summary>3 steps completed</summary>
                                                            <div className="responseProgress4">
                                                                <div className="loadGroupCheck">
                                                                    <img src={checkIcon} alt="Check icon" />
                                                                    <p className="progressText">
                                                                        Understanding your explanation
                                                                    </p>
                                                                </div>
                                                                <div className="loadGroupCheck">
                                                                    <img src={checkIcon} alt="Check icon" />
                                                                    <p className="progressText">
                                                                        Searching the Qlik Knowledge Fabric
                                                                    </p>
                                                                </div>
                                                                <div className="loadGroupCheck">
                                                                    <img src={checkIcon} alt="Check icon" />
                                                                    <p className="progressText">
                                                                        Creating customized recommendations
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </details>
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
                                                    {/* {console.log('questionLines:', getQuestionLines(msg.text))} */}
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
                                                {/* <div className="endStatement">
                                                    <p>If you need further assistance or have any questions, feel free to ask!</p>
                                                </div> */}
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

                                    <div className={`landingIntentBoxChat ${enableSend ? 'active' : ''}`} style={showProgress ? {display: 'none'} : {display: 'flex'}}>
                                                        <textarea 
                                                            id='intent' 
                                                            value={intent} 
                                                            placeholder='Ask a question or provide additional details...' 
                                                            onChange={(e) => setIntent(e.target.value)} 
                                                            onKeyDown={handleKeyPress}
                                                            className='intentTextareaChat' 
                                                            rows={3}
                                                        ></textarea>
                                                        <button className={ `sendBtnChat ${enableSend ? 'active' : 'inactive'}`} onClick={onLandingIntentBoxChatClick} disabled={!enableSend}>
                                                            <img className="sendBtnChat" alt="Send" src={enableSend ? sendIcon_green : sendIcon} />
                                                        </button>
                                                </div>

                                </div>
                            ) : (
                                <div className="contactUsContent">
                                    {isContact4 ? (
                                        <div className="contactForm">
                                            <h3>Case Submitted Successfully!</h3>
                                            <p>Thank you for contacting us. We'll get back to you soon.</p>
                                        </div>
                                    ) : isContact3 ? (
                                        <div className="contactForm">

                                            <h3>Create a Case</h3>
                                            <p>Tell us what's going on:</p>

                                            {(isAccountRelated ? (

                                                <div className="accountForm">

                                                    <form className="supportForm" onSubmit={(e) => { e.preventDefault(); contact4(); }}>
                                                            
                                                        <div className="formGroup">
                                                            <label htmlFor="contactEmail">Case Preferred Email</label>
                                                            <input type="email" id="contactEmail" placeholder="you@example.com" required />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactRegion">Case Preferred Support Region</label>
                                                            <input type="text" id="contactRegion" placeholder="Qlik US Eastern" />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactPhone">Case Preferred Phone</label>
                                                            <input type="text" id="contactPhone" placeholder="(123) 456-7890" />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactPortal">Portal Account</label>
                                                            <input type="text" id="contactPortal" placeholder="QlikTech Single Signon Hold Account" />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactIssue">Account Issue</label>
                                                            <select id="contactIssue" value={selectedOption} onChange={handleChange} required>
                                                                <option value="" disabled>
                                                                    --None--
                                                                </option>
                                                                <option value="option1">Training</option>
                                                                <option value="option2">Partner Portal</option>
                                                                <option value="option3">Support Portal</option>
                                                                <option value="option4">Download Site</option>
                                                                <option value="option5">Community</option>
                                                                <option value="option6">Qlik.com</option>
                                                                <option value="option7">Helpsite</option>
                                                                <option value="option8">Sales inquiry or issue</option>
                                                                <option value="option9">Account Administration</option>
                                                                <option value="option10">Payment/Invoice Issue or inquiry</option>
                                                                <option value="option11">MyQlik – Digital ONLINE payment</option>
                                                                <option value="option12">Tenant Access Issue</option>
                                                                <option value="option13">QSD Authentication</option>
                                                                <option value="option14">Need guidance to start using product</option>
                                                                <option value="option15">License related</option>
                                                                <option value="option16">Other</option>
                                                            </select>
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactArea">Area / Component</label>
                                                            <select id="contactArea" value={selectedOption} onChange={handleChange} required>
                                                                <option value="" disabled>
                                                                    --None--
                                                                </option>
                                                                <option value="option1">Access</option>
                                                                <option value="option2">Authentication / Authorization</option>
                                                                <option value="option3">Browser Related</option>
                                                                <option value="option4">Documentation</option>
                                                                <option value="option5">General Question</option>
                                                                <option value="option6">Feature Request</option>
                                                                <option value="option7">File Access/Permissions</option>
                                                                <option value="option8">File Share</option>
                                                                <option value="option9">License Related</option>
                                                                <option value="option10">Product Defect</option>
                                                                <option value="option11">Security Concern</option>
                                                                <option value="option12">Subscriptions</option>
                                                                <option value="option13">User Access</option>
                                                                <option value="option14">User License</option>
                                                                <option value="option15">User Management</option>
                                                                <option value="option16">Web Interface</option>
                                                                <option value="option17">Other/Undetermined</option>
                                                            </select>
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactID">Contact User ID</label>
                                                            <input type="text" id="contactID" placeholder="Mi4w_kMvjs..." />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactLicense">Affected License Number</label>
                                                            <input type="text" id="contactLicense" placeholder="123456789123456789" />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactPriority">Priority</label>
                                                            <select id="contactPriority" value={selectedOption} onChange={handleChange} required>
                                                                <option value="" disabled>
                                                                    --None--
                                                                </option>
                                                                <option value="option1">Low/Medium</option>
                                                                <option value="option2">High</option>
                                                                <option value="option3">Urgent</option>
                                                            </select>
                                                        </div>

                                                            <div className="endContactBtn">
                                                                <button 
                                                                    type="button" 
                                                                    className="backContactBtn"
                                                                    onClick={contact2}
                                                                >
                                                                    BACK
                                                                </button>
                                                                <button 
                                                                    type="submit" 
                                                                    className="nextContactBtn" 
                                                                    onClick={contact4}
                                                                >
                                                                    NEXT
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>

                                                ) : isProductRelated && isAnalytics ? (

                                                    <div className="accountForm">

                                                    <form className="supportForm" onSubmit={(e) => { e.preventDefault(); contact4(); }}>
                                                            
                                                        <div className="formGroup">
                                                            <label htmlFor="contactEmail">Case Preferred Email</label>
                                                            <input type="email" id="contactEmail" placeholder="you@example.com" required />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactRegion">Case Preferred Support Region</label>
                                                            <input type="text" id="contactRegion" placeholder="Qlik US Eastern" />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactPhone">Case Preferred Phone</label>
                                                            <input type="text" id="contactPhone" placeholder="(123) 456-7890" />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactPortal">Portal Account</label>
                                                            <input type="text" id="contactPortal" placeholder="QlikTech Single Signon Hold Account" />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactProduct">Product</label>
                                                            <select id="contactProduct" value={selectedOption} onChange={handleChange} required>
                                                                <option value="" disabled>
                                                                    Select an Option
                                                                </option>
                                                                <option value="option1">Training</option>
                                                                <option value="option2">Nprinting</option>
                                                                <option value="option3">QlikAlerting – Client Managed</option>
                                                                <option value="option4">Qlik GeoAnalytics for QlikView</option>
                                                                <option value="option5">Qlik ODBC Connector Package</option>
                                                                <option value="option6">Qlik Rest Connector - Client Managed</option>
                                                                <option value="option7">Qlik SAP Connector - Client Managed</option>
                                                                <option value="option8">Qlik Sense Desktop</option>
                                                                <option value="option9">Qlik Sense Enterprise</option>
                                                                <option value="option10">Qlik Sense Enterprise on Kubernetes</option>
                                                                <option value="option11">Qlik Sense GeoAnalytics for Qlik Sense</option>
                                                                <option value="option12">Qlik Sense GeoAnalytics Plus</option>
                                                                <option value="option13">Qlik Sense GeoAnalytics Server</option>
                                                                <option value="option14">Qlik Sense Mobile - Client Managed</option>
                                                                <option value="option15">QlikView</option>
                                                                <option value="option16">Qlik Web Connectors - Client Managed</option>
                                                            </select>
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactArea">Product Area</label>
                                                            <select id="contactArea" value={selectedOption} onChange={handleChange} required>
                                                                <option value="" disabled>
                                                                    Select an Option
                                                                </option>
                                                                <option value="option1">Access</option>
                                                                <option value="option2">Authentication / Authorization</option>
                                                                <option value="option3">Browser Related</option>
                                                                <option value="option4">Documentation</option>
                                                                <option value="option5">General Question</option>
                                                                <option value="option6">Feature Request</option>
                                                                <option value="option7">File Access/Permissions</option>
                                                                <option value="option8">File Share</option>
                                                                <option value="option9">License Related</option>
                                                                <option value="option10">Product Defect</option>
                                                                <option value="option11">Security Concern</option>
                                                                <option value="option12">Subscriptions</option>
                                                                <option value="option13">User Access</option>
                                                                <option value="option14">User License</option>
                                                                <option value="option15">User Management</option>
                                                                <option value="option16">Web Interface</option>
                                                                <option value="option17">Other/Undetermined</option>
                                                            </select>
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactSeverity">Severity</label>
                                                            <select id="contactSeverity" value={selectedOption} onChange={handleChange} required>
                                                                <option value="" disabled>
                                                                    --None--
                                                                </option>
                                                                <option value="option1">3</option>
                                                                <option value="option2">2</option>
                                                                <option value="option3">1</option>
                                                            </select>
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactSeverity">Operating System</label>
                                                            <select id="contactSeverity" value={selectedOption} onChange={handleChange} required>
                                                                <option value="" disabled>
                                                                    Select an Option
                                                                </option>
                                                                <option value="option1">Linux</option>
                                                                <option value="option2">Unix</option>
                                                                <option value="option3">Windows</option>
                                                            </select>
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactVersion">Operating System Version</label>
                                                            <input type="text" id="contactVersion" placeholder="Mi4w_kMvjs..." />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactRelease">Product Release</label>
                                                            <input type="text" id="contactRelease" placeholder="Mi4w_kMvjs..." />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactSeverity">Environment Type</label>
                                                            <select id="contactSeverity" value={selectedOption} onChange={handleChange} required>
                                                                <option value="" disabled>
                                                                    Select an Option
                                                                </option>
                                                                <option value="option1">Production</option>
                                                                <option value="option2">Development</option>
                                                                <option value="option3">Test</option>
                                                                <option value="option4">QA</option>
                                                                <option value="option5">Migration</option>
                                                            </select>
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactLicense">Affected User ID</label>
                                                            <input type="text" id="contactLicense" placeholder="123456789123456789" />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactRole">Affected User Role</label>
                                                            <input type="text" id="contactRole" placeholder="123456789123456789" />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactLicense">Connector Type</label>
                                                            <input type="text" id="contactLicense" placeholder="123456789123456789" />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactSeverity">Connector Endpoint</label>
                                                            <select id="contactSeverity" value={selectedOption} onChange={handleChange} required>
                                                                <option value="" disabled>
                                                                    --None--
                                                                </option>
                                                                <option value="option1">Amazon Athena</option>
                                                                <option value="option2">Amazon DynamoDB</option>
                                                                <option value="option3">Amazon Redshift</option>
                                                                <option value="option4">Amazon S3</option>
                                                                <option value="option5">Amazon S3 V2</option>
                                                                <option value="option6">Amazon S3 (QWC)</option>
                                                                <option value="option7">Amazon S3 V2 (QWC)</option>
                                                                <option value="option8">Amazon S3 Metadata</option>
                                                                <option value="option9">Amazon S3 Metadata S3</option>
                                                                <option value="option10">Apache Drill</option>
                                                                <option value="option11">Apache Hive</option>
                                                                <option value="option12">Apache Phoenix</option>
                                                                <option value="option13">Apache Spark</option>
                                                                <option value="option14">AYLEIN New v2</option>
                                                                <option value="option15">AYLEIN New v2 (QWC)</option>
                                                                <option value="option16">Azure Storage</option>
                                                                <option value="option17">Azure Storage (QWC)</option>
                                                                <option value="option18">Azure Storage Metadata</option>
                                                                <option value="option19">Azure SQL Database</option>
                                                                <option value="option20">Azure Synapse Analytics</option>
                                                                <option value="option21">Box (QWC)</option>
                                                                <option value="option22">Cassandra</option>
                                                                <option value="option23">Cloudera Impala</option>
                                                                <option value="option24">Couchbase</option>
                                                                <option value="option25">Databricks</option>
                                                                <option value="option26">Dropbox</option>
                                                                <option value="option27">Dropbox (QWC)</option>
                                                                <option value="option28">Dropbox Metadata</option>
                                                                <option value="option29">Essbase</option>
                                                                <option value="option30">Facebook Insights</option>
                                                                <option value="option31">Facebook Insights (QWC)</option>
                                                                <option value="option32">FTP/SFTP (QWC)</option>
                                                                <option value="option33">General Web Connector (QWC)</option>
                                                                <option value="option34">Github</option>
                                                                <option value="option35">Github (QWC)</option>
                                                                <option value="option36">Google Ads</option>
                                                                <option value="option37">Google Ads (QWC)</option>
                                                                <option value="option38">Google Ads Manager</option>
                                                                <option value="option39">Google Analytics</option>
                                                                <option value="option40">Google Analytics (QWC)</option>
                                                                <option value="option41">Google Analytics 4</option>
                                                                <option value="option42">Google BigQuery</option>
                                                                <option value="option43">Google Calendar</option>
                                                                <option value="option44">Google Calendar (QWC)</option>
                                                                <option value="option45">Google Cloud Storage</option>
                                                                <option value="option46">Google Cloud Storage Metadata</option>
                                                                <option value="option47">Google Drive</option>
                                                                <option value="option48">Google Drive and Spreadsheets Metadata</option>
                                                                <option value="option49">Google Drive and Spreadsheets Metadata (QWC)</option>
                                                                <option value="option50">Google Search Console</option>
                                                                <option value="option51">Google Search Console (QWC)</option>
                                                                <option value="option52">Helper Connector (QWC)</option>
                                                                <option value="option53">IBM DB2</option>
                                                                <option value="option54">JIRA</option>
                                                                <option value="option55">JIRA (QWC)</option>
                                                                <option value="option56">Mailbox IMAP</option>
                                                                <option value="option57">Mailbox IMAP (QWC)</option>
                                                                <option value="option58">MailChimp</option>
                                                                <option value="option59">MailChimp (QWC)</option>
                                                                <option value="option60">Marketo</option>
                                                                <option value="option61">MeaningCloud</option>
                                                                <option value="option62">MeaningCloud (QWC)</option>
                                                                <option value="option63">Microsoft Dynamics CRM V2</option>
                                                                <option value="option64">Microsoft Dynamics CRM V2 (QWC)</option>
                                                                <option value="option65">Microsoft SQL Server</option>
                                                                <option value="option66">MongoDB</option>
                                                                <option value="option67">MySQL Enterprise Edition</option>
                                                                <option value="option68">Odata</option>
                                                                <option value="option69">Odata (QWC)</option>
                                                                <option value="option70">ODBC Connector Package</option>
                                                                <option value="option71">Office 365 Sharepoint</option>
                                                                <option value="option72">Office 365 Sharepoint Metadata</option>
                                                                <option value="option73">Office 365 Sharepoint Metadata (QWC)</option>
                                                                <option value="option74">Outlook 365</option>
                                                                <option value="option75">Outlook 365 (QWC)</option>
                                                                <option value="option76">OneDrive</option>
                                                                <option value="option77">OneDrive V2 (QWC)</option>
                                                                <option value="option78">OneDrive Metadata</option>
                                                                <option value="option79">Oracle</option>
                                                                <option value="option80">PostgreSQL</option>
                                                                <option value="option81">Presto</option>
                                                                <option value="option82">Qualtrics</option>
                                                                <option value="option83">Qualtrics Connector (QWC)</option>
                                                                <option value="option84">RegEx Connector (QWC)</option>
                                                                <option value="option85">REST</option>
                                                                <option value="option86">Salesforce</option>
                                                                <option value="option87">SAP</option>
                                                                <option value="option88">SAP Hana</option>
                                                                <option value="option89">Sentiment140</option>
                                                                <option value="option90">ServiceNow</option>
                                                                <option value="option91">Slack V2</option>
                                                                <option value="option92">Slack V2 (QWC)</option>
                                                                <option value="option93">SMTP</option>
                                                                <option value="option94">SMTP (QWC)</option>
                                                                <option value="option95">Snowflake</option>
                                                                <option value="option96">Strava</option>
                                                                <option value="option97">Strava (QWC)</option>
                                                                <option value="option98">SugarCRM</option>
                                                                <option value="option99">SugarCRM (QWC)</option>
                                                                <option value="option100">SurveyMonkey</option>
                                                                <option value="option101">SurveyMonkey (QWC)</option>
                                                                <option value="option102">Sybase ASE</option>
                                                                <option value="option103">Teradata</option>
                                                                <option value="option104">Teradata (TPT)</option>
                                                                <option value="option105">Twitter</option>
                                                                <option value="option106">Twitter (QWC)</option>
                                                                <option value="option107">Watson Natural Understanding</option>
                                                                <option value="option108">Watson Natural Understanding (QWC)</option>
                                                                <option value="option109">Youtube Analytics</option>
                                                                <option value="option110">Youtube Analytics (QWC)</option>
                                                            </select>
                                                        </div>
     

                                                        <div className="formGroup">
                                                            <label htmlFor="contactLicense">Affected License Number</label>
                                                            <input type="text" id="contactLicense" placeholder="123456789123456789" />
                                                        </div>

                                                            <div className="endContactBtn">
                                                                <button 
                                                                    type="button" 
                                                                    className="backContactBtn"
                                                                    onClick={contact2}
                                                                >
                                                                    BACK
                                                                </button>
                                                                <button 
                                                                    type="submit" 
                                                                    className="nextContactBtn" 
                                                                    onClick={contact4}
                                                                >
                                                                    NEXT
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>

                                                ) : isProductRelated && isIntegration ? (

                                                    <div className="integrationForm">

                                                    <form className="supportForm" onSubmit={(e) => { e.preventDefault(); contact4(); }}>
                                                        
                                                        <div className="formGroup">
                                                            <label htmlFor="contactEmail">Integration</label>
                                                            <input type="email" id="contactEmail" placeholder="you@example.com" required />
                                                        </div>

                                                        <div className="endContactBtn">
                                                            <button 
                                                                type="button" 
                                                                className="backContactBtn"
                                                                onClick={contact2}
                                                            >
                                                                BACK
                                                            </button>
                                                            <button 
                                                                type="submit" 
                                                                className="nextContactBtn" 
                                                                onClick={contact4}
                                                            >
                                                                NEXT
                                                            </button>
                                                        </div>

                                                    </form>

                                                    </div>

                                                ) : isProductRelated && isCloud ? (

                                                    <div className="cloudForm">

                                                    <form className="supportForm" onSubmit={(e) => { e.preventDefault(); contact4(); }}>
                                                        
                                                        <div className="formGroup">
                                                            <label htmlFor="contactEmail">Cloud</label>
                                                            <input type="email" id="contactEmail" placeholder="you@example.com" required />
                                                        </div>

                                                        <div className="endContactBtn">
                                                            <button 
                                                                type="button" 
                                                                className="backContactBtn"
                                                                onClick={contact2}
                                                            >
                                                                BACK
                                                            </button>
                                                            <button 
                                                                type="submit" 
                                                                className="nextContactBtn" 
                                                                onClick={contact4}
                                                            >
                                                                NEXT
                                                            </button>
                                                        </div>

                                                    </form>

                                                    </div>

                                                ) : isProductRelated && isTalend ? (

                                                    <div className="talendForm">

                                                    <form className="supportForm" onSubmit={(e) => { e.preventDefault(); contact4(); }}>
                                                        
                                                        <div className="formGroup">
                                                            <label htmlFor="contactEmail">Talend</label>
                                                            <input type="email" id="contactEmail" placeholder="you@example.com" required />
                                                        </div>

                                                        <div className="endContactBtn">
                                                            <button 
                                                                type="button" 
                                                                className="backContactBtn"
                                                                onClick={contact2}
                                                            >
                                                                BACK
                                                            </button>
                                                            <button 
                                                                type="submit" 
                                                                className="nextContactBtn" 
                                                                onClick={contact4}
                                                            >
                                                                NEXT
                                                            </button>
                                                        </div>

                                                    </form>

                                                    </div>

                                                ) : (
                                                    
                                                    <div className="accountForm">

                                                    <form className="supportForm" onSubmit={(e) => { e.preventDefault(); contact4(); }}>
                                                            
                                                        <div className="formGroup">
                                                            <label htmlFor="contactEmail">Case Preferred Email</label>
                                                            <input type="email" id="contactEmail" placeholder="you@example.com" required />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactRegion">Case Preferred Support Region</label>
                                                            <input type="text" id="contactRegion" placeholder="Qlik US Eastern" />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactPhone">Case Preferred Phone</label>
                                                            <input type="text" id="contactPhone" placeholder="(123) 456-7890" />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactPortal">Portal Account</label>
                                                            <input type="text" id="contactPortal" placeholder="QlikTech Single Signon Hold Account" />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactIssue">Account Issue</label>
                                                            <select id="contactIssue" value={selectedOption} onChange={handleChange} required>
                                                                <option value="" disabled>
                                                                    --None--
                                                                </option>
                                                                <option value="option1">Training</option>
                                                                <option value="option2">Partner Portal</option>
                                                                <option value="option3">Support Portal</option>
                                                                <option value="option4">Download Site</option>
                                                                <option value="option5">Community</option>
                                                                <option value="option6">Qlik.com</option>
                                                                <option value="option7">Helpsite</option>
                                                                <option value="option8">Sales inquiry or issue</option>
                                                                <option value="option9">Account Administration</option>
                                                                <option value="option10">Payment/Invoice Issue or inquiry</option>
                                                                <option value="option11">MyQlik – Digital ONLINE payment</option>
                                                                <option value="option12">Tenant Access Issue</option>
                                                                <option value="option13">QSD Authentication</option>
                                                                <option value="option14">Need guidance to start using product</option>
                                                                <option value="option15">License related</option>
                                                                <option value="option16">Other</option>
                                                            </select>
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactArea">Area / Component</label>
                                                            <select id="contactArea" value={selectedOption} onChange={handleChange} required>
                                                                <option value="" disabled>
                                                                    --None--
                                                                </option>
                                                                <option value="option1">Access</option>
                                                                <option value="option2">Authentication / Authorization</option>
                                                                <option value="option3">Browser Related</option>
                                                                <option value="option4">Documentation</option>
                                                                <option value="option5">General Question</option>
                                                                <option value="option6">Feature Request</option>
                                                                <option value="option7">File Access/Permissions</option>
                                                                <option value="option8">File Share</option>
                                                                <option value="option9">License Related</option>
                                                                <option value="option10">Product Defect</option>
                                                                <option value="option11">Security Concern</option>
                                                                <option value="option12">Subscriptions</option>
                                                                <option value="option13">User Access</option>
                                                                <option value="option14">User License</option>
                                                                <option value="option15">User Management</option>
                                                                <option value="option16">Web Interface</option>
                                                                <option value="option17">Other/Undetermined</option>
                                                            </select>
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactID">Contact User ID</label>
                                                            <input type="text" id="contactID" placeholder="Mi4w_kMvjs..." />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactLicense">Affected License Number</label>
                                                            <input type="text" id="contactLicense" placeholder="123456789123456789" />
                                                        </div>

                                                        <div className="formGroup">
                                                            <label htmlFor="contactPriority">Priority</label>
                                                            <select id="contactPriority" value={selectedOption} onChange={handleChange} required>
                                                                <option value="" disabled>
                                                                    --None--
                                                                </option>
                                                                <option value="option1">Low/Medium</option>
                                                                <option value="option2">High</option>
                                                                <option value="option3">Urgent</option>
                                                            </select>
                                                        </div>

                                                            <div className="endContactBtn">
                                                                <button 
                                                                    type="button" 
                                                                    className="backContactBtn"
                                                                    onClick={contact2}
                                                                >
                                                                    BACK
                                                                </button>
                                                                <button 
                                                                    type="submit" 
                                                                    className="nextContactBtn" 
                                                                    onClick={contact4}
                                                                >
                                                                    NEXT
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>

                                                ))}
                                        </div>
                                    ) : isContact2 ? (
                                        <div className="contactForm">

                                            <h3>Create a Case</h3>
                                            <p>Tell us what's going on:</p>
                                            
                                            <div className="supportForm">
                                                <div className="relatedButtons">
                                                    <button 
                                                        type="button"
                                                        onClick={accountRelated}
                                                        className={isAccountRelated ? 'problemTypeBtnSelected' : 'problemTypeBtn'}
                                                    >
                                                        <img alt="Account Related" src={accountRelatedIcon}></img>
                                                        <p>ACCOUNT RELATED</p>
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        onClick={productRelated}
                                                        className={isProductRelated ? 'problemTypeBtnSelected' : 'problemTypeBtn'}
                                                    >
                                                        <img alt="Product Related" src={productRelatedIcon}></img>
                                                        <p>PRODUCT RELATED</p>
                                                    </button>
                                                </div>

                                                {isProductRelated && (
                                                    <div className="productButtons">
                                                        <button 
                                                            type="button"
                                                            onClick={analyticsRelated}
                                                            className={isAnalytics ? 'problemTypeBtnSelected' : 'problemTypeBtn'}
                                                        >
                                                            <img alt="Data Analytics" src={analyticsIcon}></img>
                                                            <p>DATA ANALYTICS</p>
                                                        </button>
                                                        <button 
                                                            type="button"
                                                            onClick={integrationRelated}
                                                            className={isIntegration ? 'problemTypeBtnSelected' : 'problemTypeBtn'}
                                                        >
                                                            <img alt="Data Integration" src={integrationIcon}></img>
                                                            <p>DATA INTEGRATION</p>
                                                        </button>
                                                        <button 
                                                            type="button"
                                                            onClick={cloudRelated}
                                                            id="cloudBtn"
                                                            className={isCloud ? 'problemTypeBtnSelected' : 'problemTypeBtn'}
                                                        >
                                                            <img alt="Qlik Cloud" src={cloudIcon}></img>
                                                            <p>QLIK CLOUD</p>
                                                        </button>
                                                        <button 
                                                            type="button" 
                                                            onClick={talendRelated}
                                                            id="talendBtn"
                                                            className={isTalend ? 'problemTypeBtnSelected' : 'problemTypeBtn'}
                                                        >
                                                            <img alt="Talend" src={talendIcon}></img>
                                                            <p>TALEND</p>
                                                        </button>
                                                    </div>
                                                )}

                                                {(isAccountRelated || isProductRelated) && (
                                                    <div className="endContactBtn">
                                                        <button 
                                                            type="button" 
                                                            className="backContactBtn" 
                                                            onClick={contact1}
                                                        >
                                                            BACK
                                                        </button>
                                                        <button 
                                                            type="submit" 
                                                            className="nextContactBtn" 
                                                            onClick={contact3}
                                                        >
                                                            NEXT
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : isContact1 ? (
                                        <div className="contactForm">
                                            <h3>Create a Case</h3>
                                            <p>Tell us what's going on:</p>
                                            
                                            <form className="supportForm" onSubmit={(e) => { e.preventDefault(); contact2(); }}>
                                                <div className="formGroup">
                                                    <label htmlFor="contactSubject">Subject</label>
                                                    <input type="text" id="contactSubject" placeholder="Brief description of your issue" required />
                                                </div>
                                                
                                                <div className="formGroup">
                                                    <label htmlFor="contactMessage">Description</label>
                                                    <textarea 
                                                        id="contactMessage" 
                                                        rows="4" 
                                                        placeholder="Please provide detailed information about your issue..."
                                                        required
                                                    ></textarea>
                                                </div>
                                                
                                                <div className="endContactBtn">
                                                        <button 
                                                            type="button" 
                                                            className="backContactBtnInactive"
                                                        >
                                                            BACK
                                                        </button>
                                                        <button 
                                                            type="submit" 
                                                            className="nextContactBtn" 
                                                            onClick={contact1}
                                                        >
                                                            NEXT
                                                        </button>
                                                    </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="contactForm">
                                            <h3>Create a Case</h3>
                                            <p>Tell us what's going on:</p>
                                            
                                            <form className="supportForm" onSubmit={(e) => { e.preventDefault(); contact2(); }}>
                                                <div className="formGroup">
                                                    <label htmlFor="contactSubject">Subject</label>
                                                    <input type="text" id="contactSubject" placeholder="Brief description of your issue" required />
                                                </div>
                                                
                                                <div className="formGroup">
                                                    <label htmlFor="contactMessage">Description</label>
                                                    <textarea 
                                                        id="contactMessage" 
                                                        rows="4" 
                                                        placeholder="Please provide detailed information about your issue..."
                                                        required
                                                    ></textarea>
                                                </div>
                                                
                                                <div className="endContactBtn">
                                                        <button 
                                                            type="button" 
                                                            className="backContactBtnInactive"
                                                        >
                                                            BACK
                                                        </button>
                                                        <button 
                                                            type="submit" 
                                                            className="nextContactBtn" 
                                                            onClick={contact2}
                                                        >
                                                            NEXT
                                                        </button>
                                                    </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            )}

                            {showProgress && (
                                <div className="responseProgress">
                                    {/* Loading animation when retrieving ADA response */}
                                    <h4>Curating your solution</h4>
                                    <p className="progressSubheading">We’re synthesizing the information you provided with the Qlik Knowledge Fabric to generate your personalized solution</p>
                                    {!showProgress2 && (
                                        <div className="loadGroupLoading">
                                            <div className="loadingCircles">
                                                <div className="circle"></div>
                                                <div className="circle"></div>
                                                <div className="circle"></div>
                                            </div>
                                            <p className="progressText">
                                                Investigating
                                            </p>
                                        </div>
                                    )}

                                    {showProgress2 && !showProgress3 && (
                                        <div className="responseProgress2">
                                            <div className="loadGroupCheck">
                                                <img src={checkIcon} alt="Check icon" />
                                                <p className="progressText">
                                                    Understanding your explanation
                                                </p>
                                            </div>
                                            <div className="loadGroupLoading">
                                                    <div className="loadingCircles">
                                                        <div className="circle"></div>
                                                        <div className="circle"></div>
                                                        <div className="circle"></div>
                                                    </div>
                                                <p className="progressText">
                                                    Searching the Qlik Knowledge Fabric
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {showProgress3 && (
                                        <div className="responseProgress3">
                                            <div className="loadGroupCheck">
                                                <img src={checkIcon} alt="Check icon" />
                                                <p className="progressText">
                                                    Understanding your explanation
                                                </p>
                                            </div>
                                            <div className="loadGroupCheck">
                                                <img src={checkIcon} alt="Check icon" />
                                                <p className="progressText">
                                                    Searching the Qlik Knowledge Fabric
                                                </p>
                                            </div>
                                            <div className="loadGroupLoading">
                                                <div className="loadingCircles">
                                                    <div className="circle"></div>
                                                    <div className="circle"></div>
                                                    <div className="circle"></div>
                                                </div>
                                                <p className="progressText">
                                                    Creating customized recommendations
                                                </p>
                                            </div>
                                        </div>
                                    )}

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