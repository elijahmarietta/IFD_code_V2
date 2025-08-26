import { io } from "socket.io-client";
import { useCallback, useState, useEffect, useRef } from 'react';
import { Tooltip } from 'react-tooltip';
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


    // Getting API Call from backend via fecthing from public ngrok link
    const sendIntentToAPI = useCallback(async (intent) => {
        try {
            const response = await fetch('https://392fbfb0942f.ngrok-free.app/api/chat', {
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
            const response = await fetch('https://392fbfb0942f.ngrok-free.app/api/end_convo', {
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
            const response = await fetch('https://392fbfb0942f.ngrok-free.app/api/end_convo', {
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

    // Initialize speech recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognitionInstance = new SpeechRecognition();
            
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'en-US';
            
            recognitionInstance.onstart = () => {
                setIsListening(true);
            };
            
            recognitionInstance.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setIntent(prev => prev + (prev ? ' ' : '') + transcript);
            };
            
            recognitionInstance.onend = () => {
                setIsListening(false);
            };
            
            recognitionInstance.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
            
            setRecognition(recognitionInstance);
        }
    }, []);

    // Start voice recording
    const startVoiceRecording = useCallback(() => {
        if (recognition && !isListening) {
            recognition.start();
        }
    }, [recognition, isListening]);

    // Stop voice recording
    const stopVoiceRecording = useCallback(() => {
        if (recognition && isListening) {
            recognition.stop();
        }
    }, [recognition, isListening]);

    const enableSend = intent.trim().length>0;

    // Transition from functions to visible elements

    return (
        //Home Landing page
        <div className="homeStatic">
            
            {!isChatStarted ? (
                //Decorative AI curls that fade in and out of landing interface
                <div className="mainContent">
                    {/* <div className="AICurls">
                        <img className="leftAICurls" alt="Left AI Curls" src={leftAICurls}/>
                        <img className="grayLeftAICurls" alt="Gray Left AI Curls" src={grayLeftAICurls}/>
                        <img className="grayRightAICurls" alt="GrayRight AI Curls" src={grayRightAICurls}/>
                        <img className="rightAICurls" alt="Right AI Curls" src={rightAICurls}/>
                    </div> */}
                    {/* Landing page Icon and text to invite user to converse */}
                    {/* <img className="logoIcon" alt="Logo" src={logoIcon} /> */}
                    <b className="invitationToConverse">How can we help you?</b>
                    <p className="landingSubtitle">Please provide detailed information in the form below:</p>

                    {/* Landing page intention box */}
                    <div className={`landingIntentBox ${enableSend ? 'active' : ''}`}>
                     <textarea 
                        id='intent' 
                        value={intent} 
                        placeholder='Please explain your situation...' 
                        onChange={(e) => setIntent(e.target.value)} 
                        onKeyDown={handleKeyPress}
                        className='intentTextarea' 
                        rows={3}
                     ></textarea>
                     {/* Speech-to-txt input for landing page intention box */}
                     <button 
                        className="micBtn" 
                        onClick={isListening ? stopVoiceRecording : startVoiceRecording}
                        data-tooltip-id="mic-tooltip"
                        data-tooltip-content={isListening ? "Stop" : "Dictate"}
                     >
                        <img alt="Microphone" src={isListening ? micActiveIcon : micIcon} />
                     </button>
                    <button className={ `sendBtn ${enableSend ? 'active' : 'inactive'}`} onClick={onLandingIntentBoxClick} disabled={!enableSend}>
                    <img alt="Send" src={enableSend ? sendIcon_green : sendIcon}></img>
                    </button>
                </div>
            </div>
            // When the chat is minimized
            // ) : isMinimized ? (
            //     // Accessibility icons at the top of the screen (minimize, exit)
                
            //     <div className="minimizedChat">
            //         <img className="QlikLogoMinimize" alt="Qlik Logo" src={logoIcon} />
            //         <div className="miniexit">
            //             <button 
            //                 className="miniBtn" 
            //                 onClick={handleRestore} 
            //                 data-tooltip-id="minimize-tooltip"
            //                 data-tooltip-content="Maximize"
            //             >
            //                 <img alt="restore" src={isMinimized ? maximizeIcon : minIcon} />
            //             </button>
            //             {/*Clicking on exit button will launch ending the conversation*/}
            //             <button 
            //                 className="exitBtn" 
            //                 onClick={() => setShowMinimizedEndChatMenu(true)}
            //                 data-tooltip-id="exit-tooltip"
            //                 data-tooltip-content="Exit"
            //             >
            //                 <img alt="exit" src={exitIcon} />
            //             </button>
            //             {/* Ending conversation and displaying toast along with menu */}
            //             {ShowMinimizedEndChatMenu && (
            //                 <div className="minimized_toast_background">
            //                     <div className="minimized_ended_toast">
            //                         <h3 className="minimized_endingTitle">End Chat</h3>
            //                         <h2 className="minimized_endingQ">Are you sure you want to end the chat?</h2>
            //                         <button className="minimized_endChatBtn" onClick={handleMinimizedExit}>End Chat</button>
            //                         <button className="minimized_cancelBtn" onClick={handleMinimizedCancel}>Cancel</button>
            //                     </div>
            //                 </div>
            //             )}

            //             {/* Success Overlay of Ending conversation - only show when ended successfully and not showing the menu */}
            //             {minimizedEndedSuccessful && !ShowMinimizedEndChatMenu && (
            //                 <div className="minimized_toast_background">
            //                     <div className="minimized_ended_toast_success">
            //                         Conversation succesfully ended
            //                     </div>
            //                 </div>
            //             )}
            //         </div>
            //         {/* Chat interface if screen is minimized (mini display similar to what current customer portal looks like) */}
            //         <div className='chatBody' ref={chatBodyRef}>
            //             {/* Sending messages from the user to interface as message boxes */}
            //             <div className="chatMessages">
            //                 {chatMessages.map((msg, index) => 
            //                     msg.from ==='user' ? (
            //                         <div key={index} className={`chatMessage ${msg.from}`}>
            //                             {msg.text}
            //                         </div>
            //                     ) : (
            //                         // Ada's repsonse insertion along with URL sources in source accordion
            //                         <div key={index} className="chatResponse">
            //                         <img className="conversationLogo" alt="Qlik Logo" src={conversationLogo} />
            //                         <div className='responseContent'>
            //                             <div className="responseText">
            //                                 {formatResponseText(msg.text)}
            //                             </div>
            //                             {getUrl(msg.text).length > 0 && (
            //                                 <details className="sourcesAccordion">
            //                                     <summary>Sources</summary>
            //                                     <div className="sourcesList">
            //                                         <ul>
            //                                             {getUrl(msg.text).map((link,i) => (
            //                                                 <li key={i}>
            //                                                 <a
            //                                                 href={link}
            //                                                 target="_blank"
            //                                                 rel="noopener noreferrer"
            //                                                 >
            //                                                     {link}
            //                                                 </a>
            //                                              </li>
            //                                             ))}
            //                                         </ul>
            //                                     </div>
            //                                 </details>
            //                             )}
            //                             {/* Formatting ADA's response by bolding instructional text and seperating last question line to be displayed under source accordion */}
            //                             {getQuestionLines(msg.text).length > 0 && (
            //                                 <div className="questionLines">
            //                                     {getQuestionLines(msg.text).map((questionLine, i) => (
            //                                         <div key={i} className="questionLine">
            //                                             {/* Use a special formatter that doesn't filter question lines */}
            //                                             {(() => {
            //                                                 const urlRegex = /(https?:\/\/[^\s]+?)([.!?]?)(\s|$)/g;
            //                                                 const numberedColonMatch = questionLine.match(/^(\d+[\.\)\:]?\s*.*?:)/);
                                                            
            //                                                 return (
            //                                                     <span>
            //                                                         {numberedColonMatch ? (
            //                                                             // Find the first capital letter after the first colon
            //                                                             (() => {
            //                                                                 const colonIndex = questionLine.indexOf(':');
            //                                                                 if (colonIndex !== -1) {
            //                                                                     const afterColon = questionLine.substring(colonIndex + 1);
            //                                                                     const capitalMatch = afterColon.match(/[A-Z]/);
                                                                                
            //                                                                     if (capitalMatch) {
            //                                                                         const capitalIndex = colonIndex + 1 + capitalMatch.index;
            //                                                                         const boldPart = questionLine.substring(0, capitalIndex);
            //                                                                         const normalPart = questionLine.substring(capitalIndex);
                                                                                    
            //                                                                         return (
            //                                                                             <>
            //                                                                                 <strong>
            //                                                                                     {boldPart.split(urlRegex).map((part, j) => {
            //                                                                                         const urlMatch = part.match(/^https?:\/\/[^\s]+/);
            //                                                                                         if (urlMatch) {
            //                                                                                             return (
            //                                                                                                 <a key={j} href={part} target="_blank" rel="noopener noreferrer">
            //                                                                                                     {part}
            //                                                                                                 </a>
            //                                                                                             );
            //                                                                                         }
            //                                                                                         return part;
            //                                                                                     })}
            //                                                                                 </strong>
            //                                                                                 {normalPart.split(urlRegex).map((part, j) => {
            //                                                                                     const urlMatch = part.match(/^https?:\/\/[^\s]+/);
            //                                                                                     if (urlMatch) {
            //                                                                                         return (
            //                                                                                             <a key={j} href={part} target="_blank" rel="noopener noreferrer">
            //                                                                                                 {part}
            //                                                                                             </a>
            //                                                                                         );
            //                                                                                     }
            //                                                                                     return part;
            //                                                                                 })}
            //                                                                             </>
            //                                                                         );
            //                                                                     } else {
            //                                                                         // No capital letter after colon, bold up to and including the colon
            //                                                                         const boldPart = questionLine.substring(0, colonIndex + 1);
            //                                                                         const normalPart = questionLine.substring(colonIndex + 1);
                                                                                    
            //                                                                         return (
            //                                                                             <>
            //                                                                                 <strong>
            //                                                                                     {boldPart.split(urlRegex).map((part, j) => {
            //                                                                                         const urlMatch = part.match(/^https?:\/\/[^\s]+/);
            //                                                                                         if (urlMatch) {
            //                                                                                             return (
            //                                                                                                 <a key={j} href={part} target="_blank" rel="noopener noreferrer">
            //                                                                                                     {part}
            //                                                                                                 </a>
            //                                                                                             );
            //                                                                                         }
            //                                                                                         return part;
            //                                                                                     })}
            //                                                                                 </strong>
            //                                                                                 {normalPart.split(urlRegex).map((part, j) => {
            //                                                                                     const urlMatch = part.match(/^https?:\/\/[^\s]+/);
            //                                                                                     if (urlMatch) {
            //                                                                                         return (
            //                                                                                             <a key={j} href={part} target="_blank" rel="noopener noreferrer">
            //                                                                                                 {part}
            //                                                                                             </a>
            //                                                                                         );
            //                                                                                     }
            //                                                                                     return part;
            //                                                                                 })}
            //                                                                             </>
            //                                                                         );
            //                                                                     }
            //                                                                 }
                                                                            
            //                                                                 // Fallback: bold the entire line if no colon found
            //                                                                 return questionLine.split(urlRegex).map((part, j) => {
            //                                                                     const urlMatch = part.match(/^https?:\/\/[^\s]+/);
            //                                                                     if (urlMatch) {
            //                                                                         return (
            //                                                                             <a key={j} href={part} target="_blank" rel="noopener noreferrer">
            //                                                                                 {part}
            //                                                                             </a>
            //                                                                         );
            //                                                                     }
            //                                                                     return <strong key={j}>{part}</strong>;
            //                                                                 });
            //                                                             })()
            //                                                         ) : (
            //                                                             // Line doesn't match pattern - process URLs only
            //                                                             questionLine.split(urlRegex).map((part, j) => {
            //                                                                 const urlMatch = part.match(/^https?:\/\/[^\s]+/);
            //                                                                 if (urlMatch) {
            //                                                                     return (
            //                                                                         <a key={j} href={part} target="_blank" rel="noopener noreferrer">
            //                                                                             {part}
            //                                                                         </a>
            //                                                                     );
            //                                                                 }
            //                                                                 return part;
            //                                                             })
            //                                                         )}
            //                                                     </span>
            //                                                 );
            //                                             })()}
            //                                         </div>
            //                                     ))}
            //                                 </div>
            //                             )}
            //                             <div className="postResponseIcons">
            //                                 {/* Icons under ADA's response to copy , like, dislike, and make ADA reponse txt-to-speech */}
            //                                     <button className='copyBtn' onClick={() => copyClick(msg)} data-tooltip-id="copy-tooltip" data-tooltip-content="Copy">
            //                                         <img className="Copy" alt="Copy" src={copiedStates[msg.id] ? copyCheckIcon : copyIcon} />
            //                                     </button>
            //                                     {!isDisliked && (
            //                                         <button className='likeBtn' onClick={() => setIsLiked(!isLiked)} data-tooltip-id="like-tooltip" data-tooltip-content="Like">
            //                                             <img className="Like" alt="Like" src={isLiked ? likeIconFill : likeIcon} />
            //                                         </button>
            //                                     )}
            //                                     {!isLiked && (
            //                                         <button className='dislikeBtn' onClick={() => setIsDisliked(!isDisliked)} data-tooltip-id="dislike-tooltip" data-tooltip-content="Dislike">
            //                                             <img className="Dislike" alt="Dislike" src={isDisliked ? dislikeIconFill : dislikeIcon} />
            //                                         </button>
            //                                     )}
            //                                     <button className='readBtn' onClick={() => readAloud(msg)} data-tooltip-id="read-tooltip" data-tooltip-content={isReading[msg.id] ? "Stop" : "Listen"}>
            //                                         <img className="Read" alt="Read" src={isReading[msg.id] ? stopIcon : speakerIcon} />
            //                                     </button>
            //                                 </div>
            //                             </div>
            //                         </div>
            //                     )
            //                 )}
            //             </div>
            //             {showProgress && (
            //                 <div className="responseProgress">
            //                     {/* Loading animation for retrieving ADA's respopnse */}
            //                     <div className="loadingCircles">
            //                         <div className="circle"></div>
            //                         <div className="circle"></div>
            //                         <div className="circle"></div>
            //                     </div>
            //                     <p className="progressText">
            //                         Searching the Qlik Knowledge Fabric...
            //                     </p>
            //                 </div>
            //             )}
            //         </div>
            //         {/* Intent Box on landing page */}
            //         <div className={`landingIntentBoxChat ${enableSend ? 'active' : ''}`}>
            //             <textarea 
            //                 id='intent' 
            //                 value={intent} 
            //                 placeholder='Please explain your situation...' 
            //                 onChange={(e) => setIntent(e.target.value)} 
            //                 onKeyDown={handleKeyPress}
            //                 className='intentTextareaChat' 
            //                 rows={3}
            //             ></textarea>
            //             <button 
            //                 className="micBtnChat" 
            //                 onClick={isListening ? stopVoiceRecording : startVoiceRecording}
            //                 data-tooltip-id="mic-tooltip"
            //                 data-tooltip-content={isListening ? "Stop" : "Dictate"}
            //             >
            //                 <img alt="Microphone" src={isListening ? micActiveIcon : micIcon} />
            //             </button>
            //             <button className={ `sendBtnChat ${enableSend ? 'active' : 'inactive'}`} onClick={onLandingIntentBoxClick} disabled={!enableSend}>
            //                 <img className="sendBtnChat" alt="Send" src={enableSend ? sendIcon_green : sendIcon} />
            //             </button>
            //         </div>
            //     </div>
            // When the chat is not minimized (default)
            ) : (
                <div className="mainContent">
                    {/* <div className="conversationLoadingResponse"> */}
                        <b className="invitationToConverse">How can we help you?</b>
                        <p className="landingSubtitle">Please provide detailed information in the form below:</p>
                        <div className='chatBody' ref={chatBodyRef}>
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
                                            <img className="conversationLogo" alt="Qlik Logo" src={conversationLogo} />
                                            <div className='responseContent'>
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
                                            {/* Icons under ADA's response to copy , like, dislike, and make ADA reponse txt-to-speech */}
                                            <div className="postResponseIcons">
                                                <button className='copyBtn' onClick={() => copyClick(msg)} data-tooltip-id="copy-tooltip" data-tooltip-content="Copy">
                                                    <img className="Copy" alt="Copy" src={copiedStates[msg.id] ? copyCheckIcon : copyIcon} />
                                                </button>
                                                {!isDisliked && (
                                                    <button className='likeBtn' onClick={() => setIsLiked(!isLiked)} data-tooltip-id="like-tooltip" data-tooltip-content="Like">
                                                        <img className="Like" alt="Like" src={isLiked ? likeIconFill : likeIcon} />
                                                    </button>
                                                )}
                                                {!isLiked && (
                                                    <button className='dislikeBtn' onClick={() => setIsDisliked(!isDisliked)} data-tooltip-id="dislike-tooltip" data-tooltip-content="Dislike">
                                                        <img className="Dislike" alt="Dislike" src={isDisliked ? dislikeIconFill : dislikeIcon} />
                                                    </button>
                                                )}
                                                <button className='readBtn' onClick={() => readAloud(msg)} data-tooltip-id="read-tooltip" data-tooltip-content={isReading[msg.id] ? "Stop" : "Listen"}>
                                                    <img className="Read" alt="Read" src={isReading[msg.id] ? stopIcon : speakerIcon} />
                                                </button>
                                            </div>
                                            </div>
                                    </div>
                                )
                                )}
                            </div>
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
                    {/* Sidebar menu on chat interface, includong decorative AI curls graphic */}
                    {/* <div className="rectangleSideBar">
                        <img 
                            className="QlikLogoSide" 
                            alt="Qlik Logo" 
                            src={logoIcon} 
                            onClick={(e) => e.stopPropagation()}
                            style={{ pointerEvents: 'auto' }}
                        />
                        <div className="AICurls">
                            <img className="sidebarAICurls" alt="Sidebar AI Curls" src={sidebarAICurls}/>
                        </div>
                        <button className="optionsBtn" onClick={() => setOptionsMenu(prev => !prev)}>
                            <img className="sidebarMenuIcon" alt="Options" src={optionsIcon} data-tooltip-id="options-tooltip" data-tooltip-content="Options" />
                        </button> */}
                        {/* Options menu on chat interface for sound, language, and downloading transcripts */}
                        {/* {showOptionsMenu && (
                            <>
                                <div className="overlay" onClick={() => setOptionsMenu(false)} />
                                <div className="settingsPopup">
                                    <div className="settingsHeader">
                                        <h3 className="optionsTitle">Options</h3>
                                        <button className="exitOptions" onClick={() => setOptionsMenu(false)}>
                                            <img className="exitOptionsIcon" alt="exit Options" src={exitIcon} />
                                        </button>
                                    </div>
                                    <div className="settingsBody">
                                        <div className='volumeDiv' onClick={() => setIsSoundEnabled(prev => !prev)}>
                                            <button className="volumeOptions">
                                                <img className="volumeIcon" alt="volume Options" src={isSoundEnabled ? volumeIcon : volumeIconMute}/>
                                            </button>
                                            <p>{isSoundEnabled ? 'Turn off sound' : 'Turn on sound'}</p>
                                        </div>
                                        <div className='languageDiv' onClick={() => setShowLanguageMenu(prev => !prev)}>
                                            <button className="languageOptions" >
                                                <img className="languageIcon" alt="language Options" src={globeIcon} />
                                            </button>
                                            <p>Change language</p>
                                        </div>
                                        {showLanguageMenu && (
                                            <div className="languagePopup">
                                                <div className="languageHeader">
                                                    <h4>Select Language</h4>
                                                    <button onClick={() => setShowLanguageMenu(false)}>
                                                        <img src={exitIcon} alt="close" />
                                                    </button>
                                                </div>
                                                <div className="languageOptions">
                                                    {['اَلْعَرَبِيَّةُ', '简体中文', '繁體中文', 'Nederlands', 'English', 'Français', 'Deutsch', 'Italiano', '日本語', '한국어', 'Polski', 'Português', 'Русский язык', 'Español', 'Svenska', 'Türkçe'].map((language) => (
                                                        <div 
                                                            key={language}
                                                            className={`languageOption ${selectedLanguage === language ? 'selected' : ''}`}
                                                            onClick={() => handleLanguageSelect(language)}
                                                        >
                                                            {language}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className='downloadDiv' onClick={downloadTranscript}>
                                            <button className="downloadOptions">
                                                <img className="downloadIcon" alt="download Options" src={downloadIcon} />
                                            </button>
                                            <p>Download transcript</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div> */}
                    {/* Intent box on chat interface */}
                    {/* <div className={`landingIntentBoxChat ${enableSend ? 'active' : ''}`}>
                        <textarea 
                            id='intent' 
                            value={intent} 
                            placeholder='Please explain your situation...' 
                            onChange={(e) => setIntent(e.target.value)} 
                            onKeyDown={handleKeyPress}
                            className='intentTextareaChat' 
                            rows={3}
                        ></textarea> */}
                        {/* Speech-to-text button/functionality in intention box */}
                        {/* <button 
                            className="micBtnChat" 
                            onClick={isListening ? stopVoiceRecording : startVoiceRecording}
                            data-tooltip-id="mic-tooltip"
                            data-tooltip-content={isListening ? "Stop" : "Dictate"}
                        >
                            <img alt="Microphone" src={isListening ? micActiveIcon : micIcon} />
                        </button>
                        <button className={ `sendBtnChat ${enableSend ? 'active' : 'inactive'}`} onClick={onLandingIntentBoxClick} disabled={!enableSend}>
                            <img className="sendBtnChat" alt="Send" src={enableSend ? sendIcon_green : sendIcon} />
                        </button>
                    </div> */}
                </div>
            )}
            
            {/* Tooltip components when hoovering over icons */}
            <Tooltip id="minimize-tooltip" />
            <Tooltip id="exit-tooltip" />
            <Tooltip id="minimize-tooltip2" />
            <Tooltip id="copy-tooltip" />
            <Tooltip id="like-tooltip" />
            <Tooltip id="dislike-tooltip" />
            <Tooltip id="read-tooltip" />
            <Tooltip id="mic-tooltip" />
            <Tooltip id="options-tooltip" />

            {/* Ending chat menu */}
            {/* {ShowEndChatMenu && (
                <div className="toast_background">
                    <div className="ended_toast">
                        <h3 className="endingTitle">End Chat</h3>
                        <h2 className="endingQ">Are you sure you want to end the chat?</h2>
                        <button className="endChatBtn" onClick={handleExit}>End Chat</button>
                        <button className="cancelBtn" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            )} */}

            {/* Success Overlay */}
            {/* {endedSuccessful && (
                <div className="toast_background">
                    <div className="ended_toast_success">
                        Conversation succesfully ended
                    </div>
                </div>
            )} */}
        </div>
    );
}

export default App;