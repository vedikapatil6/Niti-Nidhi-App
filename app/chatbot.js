// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Speech from 'expo-speech';
// import { useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// // Replace with your Gemini API key
// const GEMINI_API_KEY = 'AIzaSyAoT62V2sddmW8uWfAkm3gDw4_S3tcDuoI';

// const ChatbotScreen = ({ onBack }) => {
//   const [messages, setMessages] = useState([
//     {
//       id: '1',
//       text: 'Hello! I am your government schemes assistant powered by Google Gemini. I can help you find schemes, understand eligibility, benefits, and application processes. How can I help you today?',
//       sender: 'bot',
//       timestamp: new Date(),
//       language: 'en'
//     }
//   ]);
//   const [inputText, setInputText] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [language, setLanguage] = useState('en');
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [schemesData, setSchemesData] = useState([]);
//   const [isInitializing, setIsInitializing] = useState(true);
//   const scrollViewRef = useRef(null);

//   // Fetch all schemes on component mount
//   useEffect(() => {
//     fetchAllSchemes();
//     testGeminiAPIKey(); // Test API key on mount
//   }, []);

//   useEffect(() => {
//     scrollViewRef.current?.scrollToEnd({ animated: true });
//   }, [messages]);

//   useEffect(() => {
//     const welcomeMessages = {
//       en: 'Hello! I am your government schemes assistant powered by Google Gemini. I can help you find schemes, understand eligibility, benefits, and application processes. How can I help you today?',
//       hi: 'नमस्ते! मैं Google Gemini द्वारा संचालित आपका सरकारी योजना सहायक हूं। मैं आपको योजनाएं खोजने, पात्रता समझने, लाभ और आवेदन प्रक्रियाओं में मदद कर सकता हूं। आज मैं आपकी कैसे मदद कर सकता हूं?'
//     };

//     setMessages([{
//       id: '1',
//       text: welcomeMessages[language],
//       sender: 'bot',
//       timestamp: new Date(),
//       language: language
//     }]);
//   }, [language]);

//   const testGeminiAPIKey = async () => {
//     try {
//       console.log('Testing Gemini API key...');
//       const response = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             contents: [
//               {
//                 parts: [
//                   {
//                     text: "Hello"
//                   }
//                 ]
//               }
//             ]
//           })
//         }
//       );

//       if (response.ok) {
//         console.log('✅ Gemini API key is valid and working');
//         return true;
//       } else {
//         const errorText = await response.text();
//         console.error('❌ API key test failed:', errorText);
//         Alert.alert(
//           'API Key Issue',
//           'Your Gemini API key may not be working properly. The chatbot will use fallback responses.',
//           [{ text: 'OK' }]
//         );
//         return false;
//       }
//     } catch (error) {
//       console.error('❌ API key test error:', error);
//       return false;
//     }
//   };

//   const fetchAllSchemes = async () => {
//     try {
//       setIsInitializing(true);
//       const token = await AsyncStorage.getItem('@access_token');
      
//       if (!token) {
//         throw new Error('No authentication token found');
//       }

//       const response = await fetch(
//         'https://2095-202-71-156-226.ngrok-free.app/api/schemes',
//         {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//             'ngrok-skip-browser-warning': 'true'
//           }
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch schemes');
//       }

//       const rawText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(rawText);
//       } catch (parseError) {
//         throw new Error('Invalid response from server');
//       }

//       // Handle both array and paginated response
//       let schemesList = [];
//       if (Array.isArray(data)) {
//         schemesList = data;
//       } else if (data.results && Array.isArray(data.results)) {
//         schemesList = data.results;
//       }

//       setSchemesData(schemesList);
//       console.log(`✅ Loaded ${schemesList.length} schemes for AI knowledge base`);
//     } catch (error) {
//       console.error('Error fetching schemes:', error);
//       Alert.alert('Warning', 'Could not load schemes data. Using limited functionality.');
//     } finally {
//       setIsInitializing(false);
//     }
//   };

//   const getCategoryFromDepartment = (department) => {
//     if (!department) return 'Others';
    
//     const dept = department.toLowerCase();
    
//     if (dept.includes('agriculture') || dept.includes('farming') || dept.includes('krishi') || 
//         dept.includes('crop') || dept.includes('farmer') || dept.includes('kisan')) {
//       return 'Agriculture';
//     }
//     if (dept.includes('health') || dept.includes('medical') || dept.includes('hospital') ||
//         dept.includes('swasthya') || dept.includes('ayush') || dept.includes('clinic')) {
//       return 'Health';
//     }
//     if (dept.includes('finance') || dept.includes('bank') || dept.includes('economic') ||
//         dept.includes('business') || dept.includes('msme') || dept.includes('industry') ||
//         dept.includes('commerce') || dept.includes('trade') || dept.includes('startup') ||
//         dept.includes('entrepreneurship')) {
//       return 'Business';
//     }
//     if (dept.includes('education') || dept.includes('shiksha') || dept.includes('school') ||
//         dept.includes('university') || dept.includes('student') || dept.includes('scholarship')) {
//       return 'Education';
//     }
//     if (dept.includes('women') || dept.includes('child') || dept.includes('mahila') ||
//         dept.includes('girl') || dept.includes('mother') || dept.includes('female')) {
//       return 'Women';
//     }
//     if (dept.includes('housing') || dept.includes('urban') || dept.includes('awas') ||
//         dept.includes('home') || dept.includes('shelter') || dept.includes('rural development')) {
//       return 'Housing';
//     }
//     if (dept.includes('science') || dept.includes('technology') || dept.includes('research') ||
//         dept.includes('innovation') || dept.includes('vigyan') || dept.includes('dst')) {
//       return 'Science';
//     }
//     if (dept.includes('sports') || dept.includes('youth') || dept.includes('khel') ||
//         dept.includes('athletics') || dept.includes('physical')) {
//       return 'Sports';
//     }
//     if (dept.includes('police') || dept.includes('safety') || dept.includes('security') ||
//         dept.includes('disaster') || dept.includes('fire') || dept.includes('defense') ||
//         dept.includes('home affairs')) {
//       return 'Public Safety';
//     }
    
//     return 'Others';
//   };

//   const parseBenefits = (benefits) => {
//     if (Array.isArray(benefits)) return benefits;
//     if (typeof benefits === 'string') {
//       try {
//         const parsed = JSON.parse(benefits);
//         if (Array.isArray(parsed)) return parsed;
//       } catch (e) {
//         return benefits.split(/[,;\n]/).filter(b => b.trim()).map(b => b.trim());
//       }
//     }
//     return [benefits];
//   };

//   const parseDocuments = (documents) => {
//     if (!documents || documents.length === 0) {
//       return ['Aadhaar Card', 'Basic identification documents'];
//     }
    
//     if (Array.isArray(documents)) {
//       if (documents.length > 0 && typeof documents[0] === 'object' && documents[0].document_name) {
//         return documents.map(doc => doc.document_name);
//       }
//       if (typeof documents[0] === 'string') {
//         return documents;
//       }
//     }
    
//     if (typeof documents === 'string') {
//       try {
//         const parsed = JSON.parse(documents);
//         if (Array.isArray(parsed)) {
//           if (parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0].document_name) {
//             return parsed.map(doc => doc.document_name);
//           }
//           return parsed;
//         }
//       } catch (e) {
//         return documents.split(/[,;\n]/).filter(d => d.trim()).map(d => d.trim());
//       }
//     }
    
//     return ['Required documents will be specified during application'];
//   };

//   // NEW: Filter relevant schemes based on user query
//   const filterRelevantSchemes = (userMessage) => {
//     const query = userMessage.toLowerCase();
//     const searchTerms = query.split(' ').filter(term => term.length > 3);
    
//     return schemesData.filter(scheme => {
//       const searchableText = `${scheme.name} ${scheme.department} ${scheme.description} ${scheme.eligibility}`.toLowerCase();
//       return searchTerms.some(term => searchableText.includes(term));
//     });
//   };

//   // IMPROVED: Build knowledge context with size limits
//   const buildKnowledgeContext = (userMessage = '') => {
//     if (schemesData.length === 0) {
//       return "No schemes data available.";
//     }

//     // First, try to find relevant schemes
//     let relevantSchemes = filterRelevantSchemes(userMessage);
    
//     // If no relevant schemes found, use all schemes but limit
//     if (relevantSchemes.length === 0) {
//       relevantSchemes = schemesData;
//     }

//     // Limit context to prevent API errors
//     const MAX_SCHEMES = 30;
//     const MAX_CHARS = 15000;
    
//     let context = `You are an expert government schemes assistant with knowledge of ${schemesData.length} schemes. Here are the most relevant schemes:\n\n`;
//     let charCount = context.length;
//     let schemeCount = 0;
    
//     for (let i = 0; i < relevantSchemes.length && schemeCount < MAX_SCHEMES; i++) {
//       const scheme = relevantSchemes[i];
//       const category = getCategoryFromDepartment(scheme.department);
//       const benefits = parseBenefits(scheme.benefits);
//       const documents = parseDocuments(scheme.required_documents);

//       let schemeText = `SCHEME ${schemeCount + 1}:\n`;
//       schemeText += `Name: ${scheme.name}\n`;
//       schemeText += `Category: ${category}\n`;
//       schemeText += `Department: ${scheme.department}\n`;
//       schemeText += `Type: ${scheme.scheme_type}\n`;
//       schemeText += `Description: ${scheme.description.substring(0, 300)}\n`;
//       schemeText += `Eligibility: ${scheme.eligibility.substring(0, 200)}\n`;
      
//       if (Array.isArray(benefits) && benefits.length > 0) {
//         schemeText += `Key Benefits: ${benefits.slice(0, 3).join('; ')}\n`;
//       }

//       if (documents.length > 0) {
//         schemeText += `Documents: ${documents.slice(0, 4).join(', ')}\n`;
//       }

//       schemeText += `\n---\n\n`;

//       // Check if adding this scheme would exceed character limit
//       if (charCount + schemeText.length > MAX_CHARS) {
//         break;
//       }

//       context += schemeText;
//       charCount += schemeText.length;
//       schemeCount++;
//     }

//     context += `\nNote: This is a subset of ${schemesData.length} total schemes. If the user's query isn't fully answered, suggest they ask more specific questions.`;

//     console.log(`📊 Context built with ${schemeCount} schemes, ${charCount} characters`);
//     return context;
//   };

//   // IMPROVED: Send message to Gemini with better error handling
//   const sendMessageToGemini = async (userMessage, retries = 2) => {
//     try {
//       if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
//         console.log('Gemini API key not configured, using fallback...');
//         return fallbackResponse(userMessage);
//       }

//       const knowledgeContext = buildKnowledgeContext(userMessage);
      
//       const systemPrompt = language === 'hi' 
//         ? `आप एक विशेषज्ञ सरकारी योजना सहायक हैं। नीचे दिए गए योजनाओं के डेटाबेस के आधार पर उपयोगकर्ता के प्रश्नों का उत्तर दें।

// निर्देश:
// - स्पष्ट, संक्षिप्त और सहायक उत्तर दें
// - यदि कई योजनाएं प्रासंगिक हैं, तो शीर्ष 3-5 को सूचीबद्ध करें
// - पात्रता, लाभ, दस्तावेज़ और आवेदन प्रक्रिया के बारे में विस्तृत जानकारी प्रदान करें
// - यदि कोई योजना नहीं मिलती है, तो विनम्रता से बताएं और सुझाव दें
// - हिंदी में उत्तर दें
// - उत्तर 250 शब्दों से कम रखें

// ${knowledgeContext}`
//         : `You are an expert government schemes assistant. Answer user questions based on the schemes database provided below.

// Instructions:
// - Provide clear, concise, and helpful answers
// - If multiple schemes are relevant, list the top 3-5 with brief descriptions
// - Include specific details about eligibility, benefits, documents, and application process
// - If no matching scheme is found, politely suggest alternatives or broader categories
// - Be conversational and helpful
// - Keep responses under 250 words

// ${knowledgeContext}`;

//       console.log('🚀 Making Gemini API request...');
//       console.log('📝 User message:', userMessage.substring(0, 50) + '...');

//       const requestBody = {
//         contents: [
//           {
//             parts: [
//               {
//                 text: `${systemPrompt}\n\nUser Question: ${userMessage}\n\nAssistant Answer:`
//               }
//             ]
//           }
//         ],
//         generationConfig: {
//           temperature: 0.7,
//           topK: 40,
//           topP: 0.95,
//           maxOutputTokens: 1024,
//         },
//         safetySettings: [
//           {
//             category: "HARM_CATEGORY_HARASSMENT",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE"
//           },
//           {
//             category: "HARM_CATEGORY_HATE_SPEECH",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE"
//           },
//           {
//             category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE"
//           },
//           {
//             category: "HARM_CATEGORY_DANGEROUS_CONTENT",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE"
//           }
//         ]
//       };

//       const response = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(requestBody)
//         }
//       );

//       console.log('📡 Response status:', response.status);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ Gemini API error response:', errorText);
        
//         let errorData;
//         try {
//           errorData = JSON.parse(errorText);
//         } catch (e) {
//           errorData = { error: { message: errorText } };
//         }
        
//         // Handle specific error types
//         if (response.status === 400) {
//           console.error('Bad Request: Check your API request format');
//         } else if (response.status === 403) {
//           console.error('Forbidden: Check your API key permissions');
//           Alert.alert(
//             'API Error',
//             'API key permissions issue. Please verify your Gemini API key.',
//             [{ text: 'OK' }]
//           );
//         } else if (response.status === 429) {
//           console.error('Rate limit exceeded');
//           Alert.alert(
//             'Rate Limit',
//             'Too many requests. Please wait a moment.',
//             [{ text: 'OK' }]
//           );
//         }
        
//         throw new Error(`Gemini API request failed with status ${response.status}`);
//       }

//       const data = await response.json();
//       console.log('✅ Response received successfully');
      
//       // Check for blocked content
//       if (data.candidates && data.candidates[0]?.finishReason === 'SAFETY') {
//         console.warn('Response blocked by safety filters');
//         return language === 'hi'
//           ? 'क्षमा करें, मैं इस प्रश्न का उत्तर नहीं दे सकता। कृपया कुछ और पूछें।'
//           : 'Sorry, I cannot answer this question. Please try asking something else.';
//       }
      
//       if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
//         return data.candidates[0].content.parts[0].text;
//       }
      
//       console.error('Invalid response format:', JSON.stringify(data));
//       throw new Error('Invalid response format from Gemini');
      
//     } catch (error) {
//       console.error('❌ Gemini API error:', error.message);
      
//       // Retry logic
//       if (retries > 0 && !error.message.includes('403') && !error.message.includes('429')) {
//         console.log(`🔄 Retrying... (${retries} attempts left)`);
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         return sendMessageToGemini(userMessage, retries - 1);
//       }
      
//       console.log('⚠️ Falling back to keyword-based search...');
//       return fallbackResponse(userMessage);
//     }
//   };

//   const fallbackResponse = (userMessage) => {
//     const msg = userMessage.toLowerCase();
    
//     // Check for category-based queries
//     const categories = ['agriculture', 'health', 'business', 'education', 'women', 'housing', 'science', 'sports', 'safety'];
//     const categoryMatch = categories.find(cat => 
//       msg.includes(cat) || 
//       msg.includes(cat + ' schemes') ||
//       msg.includes('योजना')
//     );

//     if (categoryMatch) {
//       const categoryName = categoryMatch.charAt(0).toUpperCase() + categoryMatch.slice(1);
//       const categorySchemes = schemesData.filter(scheme => 
//         getCategoryFromDepartment(scheme.department) === categoryName
//       );

//       if (categorySchemes.length > 0) {
//         let response = language === 'hi'
//           ? `${categoryName} श्रेणी में ${categorySchemes.length} योजनाएं उपलब्ध हैं:\n\n`
//           : `Found ${categorySchemes.length} schemes in ${categoryName} category:\n\n`;
        
//         categorySchemes.slice(0, 5).forEach((scheme, index) => {
//           response += `${index + 1}. **${scheme.name}**\n`;
//           response += `   ${language === 'hi' ? 'विभाग' : 'Dept'}: ${scheme.department}\n`;
//           response += `   ${language === 'hi' ? 'पात्रता' : 'Eligibility'}: ${scheme.eligibility.substring(0, 100)}...\n\n`;
//         });

//         if (categorySchemes.length > 5) {
//           response += language === 'hi'
//             ? `और ${categorySchemes.length - 5} योजनाएं उपलब्ध हैं।`
//             : `And ${categorySchemes.length - 5} more schemes available.`;
//         }

//         return response;
//       }
//     }

//     // Search for specific schemes by name or keywords
//     const relevantSchemes = filterRelevantSchemes(userMessage);

//     if (relevantSchemes.length > 0) {
//       let response = language === 'hi' 
//         ? 'मुझे निम्नलिखित योजनाएं मिलीं जो आपके प्रश्न से मेल खाती हैं:\n\n'
//         : 'I found the following schemes matching your query:\n\n';
      
//       relevantSchemes.slice(0, 3).forEach((scheme, index) => {
//         const category = getCategoryFromDepartment(scheme.department);
//         const benefits = parseBenefits(scheme.benefits);
        
//         response += `${index + 1}. **${scheme.name}** (${category})\n`;
//         response += `   ${language === 'hi' ? 'विभाग' : 'Department'}: ${scheme.department}\n`;
//         response += `   ${language === 'hi' ? 'पात्रता' : 'Eligibility'}: ${scheme.eligibility.substring(0, 150)}\n`;
        
//         if (benefits.length > 0) {
//           response += `   ${language === 'hi' ? 'मुख्य लाभ' : 'Key Benefits'}: ${benefits[0]}\n`;
//         }
//         response += '\n';
//       });

//       if (relevantSchemes.length > 3) {
//         response += language === 'hi'
//           ? `\nऔर ${relevantSchemes.length - 3} अन्य संबंधित योजनाएं उपलब्ध हैं।`
//           : `\nAnd ${relevantSchemes.length - 3} more related schemes available.`;
//       }

//       return response;
//     }

//     // General help response
//     if (msg.includes('help') || msg.includes('मदद') || msg.includes('how') || msg.includes('कैसे')) {
//       return language === 'hi'
//         ? `मैं आपकी निम्न तरीकों से मदद कर सकता हूं:\n\n1. श्रेणी के अनुसार योजनाएं खोजें (जैसे: "कृषि योजनाएं दिखाओ")\n2. विशिष्ट योजना की जानकारी (जैसे: "PM-KISAN के बारे में बताओ")\n3. पात्रता जांच (जैसे: "किसानों के लिए कौन सी योजनाएं हैं?")\n4. दस्तावेज़ आवश्यकताएं\n5. आवेदन प्रक्रिया\n\nकृपया अपना प्रश्न पूछें!`
//         : `I can help you with:\n\n1. Finding schemes by category (e.g., "Show me agriculture schemes")\n2. Specific scheme details (e.g., "Tell me about PM-KISAN")\n3. Eligibility checking (e.g., "What schemes are for farmers?")\n4. Document requirements\n5. Application process\n\nPlease ask your question!`;
//     }

//     // Default response
//     return language === 'hi'
//       ? `मुझे खेद है, मैं आपके प्रश्न के लिए कोई प्रासंगिक योजना नहीं खोज पाया।\n\nकुल ${schemesData.length} योजनाएं उपलब्ध हैं। आप पूछ सकते हैं:\n- "कृषि योजनाएं दिखाओ"\n- "स्वास्थ्य योजनाओं के बारे में बताओ"\n- "महिलाओं के लिए योजनाएं"\n\nया किसी विशिष्ट विभाग या लाभ के बारे में पूछें।`
//       : `I couldn't find schemes matching your specific query.\n\nWe have ${schemesData.length} schemes available. You can ask:\n- "Show agriculture schemes"\n- "Tell me about health schemes"\n- "Schemes for women"\n\nOr ask about a specific department or benefit.`;
//   };

//   const sendMessage = async () => {
//     if (!inputText.trim()) return;

//     const userMessage = {
//       id: Date.now().toString(),
//       text: inputText.trim(),
//       sender: 'user',
//       timestamp: new Date(),
//       language: language
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputText('');
//     setIsLoading(true);

//     try {
//       const botResponse = await sendMessageToGemini(userMessage.text);
      
//       const botMessage = {
//         id: (Date.now() + 1).toString(),
//         text: botResponse,
//         sender: 'bot',
//         timestamp: new Date(),
//         language: language
//       };

//       setMessages(prev => [...prev, botMessage]);
//     } catch (error) {
//       console.error('Error sending message:', error);
//       const errorMessage = {
//         id: (Date.now() + 1).toString(),
//         text: language === 'hi'
//           ? 'क्षमा करें, कुछ गलत हो गया। कृपया पुनः प्रयास करें।'
//           : 'Sorry, something went wrong. Please try again.',
//         sender: 'bot',
//         timestamp: new Date(),
//         language: language
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const speakText = (text) => {
//     if (isSpeaking) {
//       Speech.stop();
//       setIsSpeaking(false);
//       return;
//     }

//     const languageCode = language === 'hi' ? 'hi-IN' : 'en-US';

//     Speech.speak(text, {
//       language: languageCode,
//       pitch: 1.0,
//       rate: 0.9,
//       onStart: () => setIsSpeaking(true),
//       onDone: () => setIsSpeaking(false),
//       onStopped: () => setIsSpeaking(false),
//       onError: () => {
//         setIsSpeaking(false);
//         Alert.alert(
//           language === 'hi' ? 'त्रुटि' : 'Error',
//           language === 'hi' 
//             ? 'ऑडियो चलाने में समस्या हुई।'
//             : 'Failed to play audio.'
//         );
//       }
//     });
//   };

//   const toggleLanguage = () => {
//     setLanguage(prev => prev === 'en' ? 'hi' : 'en');
//     Speech.stop();
//     setIsSpeaking(false);
//   };

//   const clearChat = () => {
//     Alert.alert(
//       language === 'hi' ? 'चैट साफ़ करें' : 'Clear Chat',
//       language === 'hi' 
//         ? 'क्या आप सभी संदेश हटाना चाहते हैं?'
//         : 'Do you want to delete all messages?',
//       [
//         {
//           text: language === 'hi' ? 'रद्द करें' : 'Cancel',
//           style: 'cancel'
//         },
//         {
//           text: language === 'hi' ? 'हटाएं' : 'Delete',
//           onPress: () => {
//             const welcomeMessages = {
//               en: 'Hello! I am your government schemes assistant powered by Google Gemini. I can help you find schemes, understand eligibility, benefits, and application processes. How can I help you today?',
//               hi: 'नमस्ते! मैं Google Gemini द्वारा संचालित आपका सरकारी योजना सहायक हूं। मैं आपको योजनाएं खोजने, पात्रता समझने, लाभ और आवेदन प्रक्रियाओं में मदद कर सकता हूं। आज मैं आपकी कैसे मदद कर सकता हूं?'
//             };

//             setMessages([{
//               id: '1',
//               text: welcomeMessages[language],
//               sender: 'bot',
//               timestamp: new Date(),
//               language: language
//             }]);
//             Speech.stop();
//             setIsSpeaking(false);
//           },
//           style: 'destructive'
//         }
//       ]
//     );
//   };

//   const formatTime = (date) => {
//     return date.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (isInitializing) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <View style={styles.headerLeft}>
//             <TouchableOpacity style={styles.backButton} onPress={onBack}>
//               <Ionicons name="arrow-back" size={24} color="#fff" />
//             </TouchableOpacity>
//             <Ionicons name="chatbubbles" size={24} color="#fff" />
//             <Text style={styles.headerTitle}>Scheme Assistant</Text>
//           </View>
//         </View>
//         <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }]}>
//           <ActivityIndicator size="large" color="#6366f1" />
//           <Text style={[styles.loadingText, { marginTop: 16, fontSize: 16 }]}>
//             {language === 'hi' ? 'योजनाएं लोड हो रही हैं...' : 'Loading schemes database...'}
//           </Text>
//           <Text style={[styles.loadingText, { marginTop: 8, fontSize: 12, color: '#9ca3af' }]}>
//             {language === 'hi' ? 'कृपया प्रतीक्षा करें' : 'Please wait'}
//           </Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={onBack}
//           >
//             <Ionicons name="arrow-back" size={24} color="#fff" />
//           </TouchableOpacity>
//           <Ionicons name="chatbubbles" size={24} color="#fff" />
//           <Text style={styles.headerTitle}>
//             {language === 'hi' ? 'सरकारी योजना सहायक' : 'Scheme Assistant'}
//           </Text>
//           <View style={styles.schemesCountBadge}>
//             <Text style={styles.schemesCountText}>{schemesData.length}</Text>
//           </View>
//         </View>
//         <View style={styles.headerRight}>
//           <TouchableOpacity
//             style={styles.headerButton}
//             onPress={toggleLanguage}
//           >
//             <Text style={styles.languageText}>
//               {language === 'en' ? 'अ' : 'A'}
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.headerButton}
//             onPress={clearChat}
//           >
//             <Ionicons name="trash-outline" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Messages Area with Keyboard Avoiding */}
//       <KeyboardAvoidingView
//         style={styles.contentContainer}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//       >
//         <ScrollView
//           ref={scrollViewRef}
//           style={styles.messagesContainer}
//           contentContainerStyle={styles.messagesContent}
//           onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
//         >
//           {messages.map((message) => (
//             <View
//               key={message.id}
//               style={[
//                 styles.messageWrapper,
//                 message.sender === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper
//               ]}
//             >
//               <View
//                 style={[
//                   styles.messageBubble,
//                   message.sender === 'user' ? styles.userMessage : styles.botMessage
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.messageText,
//                     message.sender === 'user' ? styles.userMessageText : styles.botMessageText
//                   ]}
//                 >
//                   {message.text}
//                 </Text>
//                 <Text
//                   style={[
//                     styles.timestamp,
//                     message.sender === 'user' ? styles.userTimestamp : styles.botTimestamp
//                   ]}
//                 >
//                   {formatTime(message.timestamp)}
//                 </Text>
//               </View>
//               {message.sender === 'bot' && (
//                 <TouchableOpacity
//                   style={styles.speakerButton}
//                   onPress={() => speakText(message.text)}
//                 >
//                   <Ionicons
//                     name={isSpeaking ? "volume-high" : "volume-medium-outline"}
//                     size={20}
//                     color="#6366f1"
//                   />
//                 </TouchableOpacity>
//               )}
//             </View>
//           ))}
//           {isLoading && (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="small" color="#6366f1" />
//               <Text style={styles.loadingText}>
//                 {language === 'hi' ? 'टाइप कर रहा है...' : 'Typing...'}
//               </Text>
//             </View>
//           )}
//         </ScrollView>

//         {/* Input */}
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             value={inputText}
//             onChangeText={setInputText}
//             placeholder={
//               language === 'hi'
//                 ? 'अपना प्रश्न लिखें...'
//                 : 'Type your question...'
//             }
//             placeholderTextColor="#9ca3af"
//             multiline
//             maxLength={500}
//             editable={!isLoading}
//           />
//           <TouchableOpacity
//             style={[
//               styles.sendButton,
//               (!inputText.trim() || isLoading) && styles.sendButtonDisabled
//             ]}
//             onPress={sendMessage}
//             disabled={!inputText.trim() || isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <Ionicons name="send" size={20} color="#fff" />
//             )}
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9fafb',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#6366f1',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     paddingTop: Platform.OS === 'ios' ? 50 : 12,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     flex: 1,
//   },
//   backButton: {
//     padding: 4,
//     marginRight: 4,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   schemesCountBadge: {
//     backgroundColor: '#fbbf24',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 10,
//     marginLeft: 8,
//   },
//   schemesCountText: {
//     color: '#1e3a8a',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   headerRight: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   headerButton: {
//     padding: 6,
//   },
//   languageText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   contentContainer: {
//     flex: 1,
//   },
//   messagesContainer: {
//     flex: 1,
//   },
//   messagesContent: {
//     padding: 16,
//     paddingBottom: 8,
//   },
//   messageWrapper: {
//     marginBottom: 16,
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//   },
//   userMessageWrapper: {
//     justifyContent: 'flex-end',
//   },
//   botMessageWrapper: {
//     justifyContent: 'flex-start',
//   },
//   messageBubble: {
//     maxWidth: '80%',
//     padding: 12,
//     borderRadius: 16,
//   },
//   userMessage: {
//     backgroundColor: '#6366f1',
//     borderBottomRightRadius: 4,
//   },
//   botMessage: {
//     backgroundColor: '#fff',
//     borderBottomLeftRadius: 4,
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//   },
//   messageText: {
//     fontSize: 15,
//     lineHeight: 20,
//   },
//   userMessageText: {
//     color: '#fff',
//   },
//   botMessageText: {
//     color: '#1f2937',
//   },
//   timestamp: {
//     fontSize: 11,
//     marginTop: 4,
//   },
//   userTimestamp: {
//     color: '#e0e7ff',
//     textAlign: 'right',
//   },
//   botTimestamp: {
//     color: '#9ca3af',
//   },
//   speakerButton: {
//     marginLeft: 8,
//     padding: 8,
//   },
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 12,
//     borderRadius: 16,
//     maxWidth: '80%',
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//   },
//   loadingText: {
//     marginLeft: 8,
//     fontSize: 14,
//     color: '#6b7280',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     paddingBottom: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#e5e7eb',
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   input: {
//     flex: 1,
//     backgroundColor: '#f3f4f6',
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     paddingTop: 10,
//     fontSize: 15,
//     maxHeight: 100,
//     color: '#1f2937',
//   },
//   sendButton: {
//     backgroundColor: '#6366f1',
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 8,
//   },
//   sendButtonDisabled: {
//     backgroundColor: '#c7d2fe',
//   },
// });

// export default ChatbotScreen;

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Replace with your Gemini API key
const GEMINI_API_KEY = 'AIzaSyAoT62V2sddmW8uWfAkm3gDw4_S3tcDuoI';

const ChatbotScreen = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! I am your government schemes assistant powered by Google Gemini. I can help you find schemes, understand eligibility, benefits, and application processes. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
      language: 'en'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [schemesData, setSchemesData] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const scrollViewRef = useRef(null);

  // Fetch all schemes on component mount
  useEffect(() => {
    fetchAllSchemes();
    testGeminiAPIKey(); // Test API key on mount
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    const welcomeMessages = {
      en: 'Hello! I am your government schemes assistant powered by Google Gemini. I can help you find schemes, understand eligibility, benefits, and application processes. How can I help you today?',
      hi: 'नमस्ते! मैं Google Gemini द्वारा संचालित आपका सरकारी योजना सहायक हूं। मैं आपको योजनाएं खोजने, पात्रता समझने, लाभ और आवेदन प्रक्रियाओं में मदद कर सकता हूं। आज मैं आपकी कैसे मदद कर सकता हूं?'
    };

    setMessages([{
      id: '1',
      text: welcomeMessages[language],
      sender: 'bot',
      timestamp: new Date(),
      language: language
    }]);
  }, [language]);

  const testGeminiAPIKey = async () => {
    try {
      console.log('Testing Gemini API key...');
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: "Hello"
                  }
                ]
              }
            ]
          })
        }
      );

      if (response.ok) {
        console.log('✅ Gemini API key is valid and working');
        return true;
      } else {
        const errorText = await response.text();
        console.error('❌ API key test failed:', errorText);
        Alert.alert(
          'API Key Issue',
          'Your Gemini API key may not be working properly. The chatbot will use fallback responses.',
          [{ text: 'OK' }]
        );
        return false;
      }
    } catch (error) {
      console.error('❌ API key test error:', error);
      return false;
    }
  };

  const fetchAllSchemes = async () => {
    try {
      setIsInitializing(true);
      const token = await AsyncStorage.getItem('@access_token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        'https://2095-202-71-156-226.ngrok-free.app/api/schemes',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch schemes');
      }

      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        throw new Error('Invalid response from server');
      }

      // Handle both array and paginated response
      let schemesList = [];
      if (Array.isArray(data)) {
        schemesList = data;
      } else if (data.results && Array.isArray(data.results)) {
        schemesList = data.results;
      }

      setSchemesData(schemesList);
      console.log(`✅ Loaded ${schemesList.length} schemes for AI knowledge base`);
    } catch (error) {
      console.error('Error fetching schemes:', error);
      Alert.alert('Warning', 'Could not load schemes data. Using limited functionality.');
    } finally {
      setIsInitializing(false);
    }
  };

  const getCategoryFromDepartment = (department) => {
    if (!department) return 'Others';
    
    const dept = department.toLowerCase();
    
    if (dept.includes('agriculture') || dept.includes('farming') || dept.includes('krishi') || 
        dept.includes('crop') || dept.includes('farmer') || dept.includes('kisan')) {
      return 'Agriculture';
    }
    if (dept.includes('health') || dept.includes('medical') || dept.includes('hospital') ||
        dept.includes('swasthya') || dept.includes('ayush') || dept.includes('clinic')) {
      return 'Health';
    }
    if (dept.includes('finance') || dept.includes('bank') || dept.includes('economic') ||
        dept.includes('business') || dept.includes('msme') || dept.includes('industry') ||
        dept.includes('commerce') || dept.includes('trade') || dept.includes('startup') ||
        dept.includes('entrepreneurship')) {
      return 'Business';
    }
    if (dept.includes('education') || dept.includes('shiksha') || dept.includes('school') ||
        dept.includes('university') || dept.includes('student') || dept.includes('scholarship')) {
      return 'Education';
    }
    if (dept.includes('women') || dept.includes('child') || dept.includes('mahila') ||
        dept.includes('girl') || dept.includes('mother') || dept.includes('female')) {
      return 'Women';
    }
    if (dept.includes('housing') || dept.includes('urban') || dept.includes('awas') ||
        dept.includes('home') || dept.includes('shelter') || dept.includes('rural development')) {
      return 'Housing';
    }
    if (dept.includes('science') || dept.includes('technology') || dept.includes('research') ||
        dept.includes('innovation') || dept.includes('vigyan') || dept.includes('dst')) {
      return 'Science';
    }
    if (dept.includes('sports') || dept.includes('youth') || dept.includes('khel') ||
        dept.includes('athletics') || dept.includes('physical')) {
      return 'Sports';
    }
    if (dept.includes('police') || dept.includes('safety') || dept.includes('security') ||
        dept.includes('disaster') || dept.includes('fire') || dept.includes('defense') ||
        dept.includes('home affairs')) {
      return 'Public Safety';
    }
    
    return 'Others';
  };

  const parseBenefits = (benefits) => {
    if (Array.isArray(benefits)) return benefits;
    if (typeof benefits === 'string') {
      try {
        const parsed = JSON.parse(benefits);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return benefits.split(/[,;\n]/).filter(b => b.trim()).map(b => b.trim());
      }
    }
    return [benefits];
  };

  const parseDocuments = (documents) => {
    if (!documents || documents.length === 0) {
      return ['Aadhaar Card', 'Basic identification documents'];
    }
    
    if (Array.isArray(documents)) {
      if (documents.length > 0 && typeof documents[0] === 'object' && documents[0].document_name) {
        return documents.map(doc => doc.document_name);
      }
      if (typeof documents[0] === 'string') {
        return documents;
      }
    }
    
    if (typeof documents === 'string') {
      try {
        const parsed = JSON.parse(documents);
        if (Array.isArray(parsed)) {
          if (parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0].document_name) {
            return parsed.map(doc => doc.document_name);
          }
          return parsed;
        }
      } catch (e) {
        return documents.split(/[,;\n]/).filter(d => d.trim()).map(d => d.trim());
      }
    }
    
    return ['Required documents will be specified during application'];
  };

  // NEW: Filter relevant schemes based on user query
  const filterRelevantSchemes = (userMessage) => {
    const query = userMessage.toLowerCase();
    const searchTerms = query.split(' ').filter(term => term.length > 3);
    
    return schemesData.filter(scheme => {
      const searchableText = `${scheme.name} ${scheme.department} ${scheme.description} ${scheme.eligibility}`.toLowerCase();
      return searchTerms.some(term => searchableText.includes(term));
    });
  };

  // IMPROVED: Build knowledge context with size limits
  const buildKnowledgeContext = (userMessage = '') => {
    if (schemesData.length === 0) {
      return "No schemes data available.";
    }

    // First, try to find relevant schemes
    let relevantSchemes = filterRelevantSchemes(userMessage);
    
    // If no relevant schemes found, use all schemes but limit
    if (relevantSchemes.length === 0) {
      relevantSchemes = schemesData;
    }

    // Limit context to prevent API errors
    const MAX_SCHEMES = 30;
    const MAX_CHARS = 15000;
    
    let context = `You are an expert government schemes assistant with knowledge of ${schemesData.length} schemes. Here are the most relevant schemes:\n\n`;
    let charCount = context.length;
    let schemeCount = 0;
    
    for (let i = 0; i < relevantSchemes.length && schemeCount < MAX_SCHEMES; i++) {
      const scheme = relevantSchemes[i];
      const category = getCategoryFromDepartment(scheme.department);
      const benefits = parseBenefits(scheme.benefits);
      const documents = parseDocuments(scheme.required_documents);

      let schemeText = `SCHEME ${schemeCount + 1}:\n`;
      schemeText += `Name: ${scheme.name}\n`;
      schemeText += `Category: ${category}\n`;
      schemeText += `Department: ${scheme.department}\n`;
      schemeText += `Type: ${scheme.scheme_type}\n`;
      schemeText += `Description: ${scheme.description.substring(0, 300)}\n`;
      schemeText += `Eligibility: ${scheme.eligibility.substring(0, 200)}\n`;
      
      if (Array.isArray(benefits) && benefits.length > 0) {
        schemeText += `Key Benefits: ${benefits.slice(0, 3).join('; ')}\n`;
      }

      if (documents.length > 0) {
        schemeText += `Documents: ${documents.slice(0, 4).join(', ')}\n`;
      }

      schemeText += `\n---\n\n`;

      // Check if adding this scheme would exceed character limit
      if (charCount + schemeText.length > MAX_CHARS) {
        break;
      }

      context += schemeText;
      charCount += schemeText.length;
      schemeCount++;
    }

    context += `\nNote: This is a subset of ${schemesData.length} total schemes. If the user's query isn't fully answered, suggest they ask more specific questions.`;

    console.log(`📊 Context built with ${schemeCount} schemes, ${charCount} characters`);
    return context;
  };

  // IMPROVED: Send message to Gemini with better error handling
  const sendMessageToGemini = async (userMessage, retries = 2) => {
    try {
      if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
        console.log('Gemini API key not configured, using fallback...');
        return fallbackResponse(userMessage);
      }

      const knowledgeContext = buildKnowledgeContext(userMessage);
      
      const systemPrompt = language === 'hi' 
        ? `आप एक विशेषज्ञ सरकारी योजना सहायक हैं। नीचे दिए गए योजनाओं के डेटाबेस के आधार पर उपयोगकर्ता के प्रश्नों का उत्तर दें।

निर्देश:
- स्पष्ट, संक्षिप्त और सहायक उत्तर दें
- यदि कई योजनाएं प्रासंगिक हैं, तो शीर्ष 3-5 को सूचीबद्ध करें
- पात्रता, लाभ, दस्तावेज़ और आवेदन प्रक्रिया के बारे में विस्तृत जानकारी प्रदान करें
- यदि कोई योजना नहीं मिलती है, तो विनम्रता से बताएं और सुझाव दें
- हिंदी में उत्तर दें
- उत्तर 250 शब्दों से कम रखें

${knowledgeContext}`
        : `You are an expert government schemes assistant. Answer user questions based on the schemes database provided below.

Instructions:
- Provide clear, concise, and helpful answers
- If multiple schemes are relevant, list the top 3-5 with brief descriptions
- Include specific details about eligibility, benefits, documents, and application process
- If no matching scheme is found, politely suggest alternatives or broader categories
- Be conversational and helpful
- Keep responses under 250 words

${knowledgeContext}`;

      console.log('🚀 Making Gemini API request...');
      console.log('📝 User message:', userMessage.substring(0, 50) + '...');

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser Question: ${userMessage}\n\nAssistant Answer:`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      );

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Gemini API error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: { message: errorText } };
        }
        
        // Handle specific error types
        if (response.status === 400) {
          console.error('Bad Request: Check your API request format');
        } else if (response.status === 403) {
          console.error('Forbidden: Check your API key permissions');
          Alert.alert(
            'API Error',
            'API key permissions issue. Please verify your Gemini API key.',
            [{ text: 'OK' }]
          );
        } else if (response.status === 429) {
          console.error('Rate limit exceeded');
          Alert.alert(
            'Rate Limit',
            'Too many requests. Please wait a moment.',
            [{ text: 'OK' }]
          );
        }
        
        throw new Error(`Gemini API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Response received successfully');
      
      // Check for blocked content
      if (data.candidates && data.candidates[0]?.finishReason === 'SAFETY') {
        console.warn('Response blocked by safety filters');
        return language === 'hi'
          ? 'क्षमा करें, मैं इस प्रश्न का उत्तर नहीं दे सकता। कृपया कुछ और पूछें।'
          : 'Sorry, I cannot answer this question. Please try asking something else.';
      }
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      
      console.error('Invalid response format:', JSON.stringify(data));
      throw new Error('Invalid response format from Gemini');
      
    } catch (error) {
      console.error('❌ Gemini API error:', error.message);
      
      // Retry logic
      if (retries > 0 && !error.message.includes('403') && !error.message.includes('429')) {
        console.log(`🔄 Retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return sendMessageToGemini(userMessage, retries - 1);
      }
      
      console.log('⚠️ Falling back to keyword-based search...');
      return fallbackResponse(userMessage);
    }
  };

  const fallbackResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    // Check for category-based queries
    const categories = ['agriculture', 'health', 'business', 'education', 'women', 'housing', 'science', 'sports', 'safety'];
    const categoryMatch = categories.find(cat => 
      msg.includes(cat) || 
      msg.includes(cat + ' schemes') ||
      msg.includes('योजना')
    );

    if (categoryMatch) {
      const categoryName = categoryMatch.charAt(0).toUpperCase() + categoryMatch.slice(1);
      const categorySchemes = schemesData.filter(scheme => 
        getCategoryFromDepartment(scheme.department) === categoryName
      );

      if (categorySchemes.length > 0) {
        let response = language === 'hi'
          ? `${categoryName} श्रेणी में ${categorySchemes.length} योजनाएं उपलब्ध हैं:\n\n`
          : `Found ${categorySchemes.length} schemes in ${categoryName} category:\n\n`;
        
        categorySchemes.slice(0, 5).forEach((scheme, index) => {
          response += `${index + 1}. **${scheme.name}**\n`;
          response += `   ${language === 'hi' ? 'विभाग' : 'Dept'}: ${scheme.department}\n`;
          response += `   ${language === 'hi' ? 'पात्रता' : 'Eligibility'}: ${scheme.eligibility.substring(0, 100)}...\n\n`;
        });

        if (categorySchemes.length > 5) {
          response += language === 'hi'
            ? `और ${categorySchemes.length - 5} योजनाएं उपलब्ध हैं।`
            : `And ${categorySchemes.length - 5} more schemes available.`;
        }

        return response;
      }
    }

    // Search for specific schemes by name or keywords
    const relevantSchemes = filterRelevantSchemes(userMessage);

    if (relevantSchemes.length > 0) {
      let response = language === 'hi' 
        ? 'मुझे निम्नलिखित योजनाएं मिलीं जो आपके प्रश्न से मेल खाती हैं:\n\n'
        : 'I found the following schemes matching your query:\n\n';
      
      relevantSchemes.slice(0, 3).forEach((scheme, index) => {
        const category = getCategoryFromDepartment(scheme.department);
        const benefits = parseBenefits(scheme.benefits);
        
        response += `${index + 1}. **${scheme.name}** (${category})\n`;
        response += `   ${language === 'hi' ? 'विभाग' : 'Department'}: ${scheme.department}\n`;
        response += `   ${language === 'hi' ? 'पात्रता' : 'Eligibility'}: ${scheme.eligibility.substring(0, 150)}\n`;
        
        if (benefits.length > 0) {
          response += `   ${language === 'hi' ? 'मुख्य लाभ' : 'Key Benefits'}: ${benefits[0]}\n`;
        }
        response += '\n';
      });

      if (relevantSchemes.length > 3) {
        response += language === 'hi'
          ? `\nऔर ${relevantSchemes.length - 3} अन्य संबंधित योजनाएं उपलब्ध हैं।`
          : `\nAnd ${relevantSchemes.length - 3} more related schemes available.`;
      }

      return response;
    }

    // General help response
    if (msg.includes('help') || msg.includes('मदद') || msg.includes('how') || msg.includes('कैसे')) {
      return language === 'hi'
        ? `मैं आपकी निम्न तरीकों से मदद कर सकता हूं:\n\n1. श्रेणी के अनुसार योजनाएं खोजें (जैसे: "कृषि योजनाएं दिखाओ")\n2. विशिष्ट योजना की जानकारी (जैसे: "PM-KISAN के बारे में बताओ")\n3. पात्रता जांच (जैसे: "किसानों के लिए कौन सी योजनाएं हैं?")\n4. दस्तावेज़ आवश्यकताएं\n5. आवेदन प्रक्रिया\n\nकृपया अपना प्रश्न पूछें!`
        : `I can help you with:\n\n1. Finding schemes by category (e.g., "Show me agriculture schemes")\n2. Specific scheme details (e.g., "Tell me about PM-KISAN")\n3. Eligibility checking (e.g., "What schemes are for farmers?")\n4. Document requirements\n5. Application process\n\nPlease ask your question!`;
    }

    // Default response
    return language === 'hi'
      ? `मुझे खेद है, मैं आपके प्रश्न के लिए कोई प्रासंगिक योजना नहीं खोज पाया।\n\nकुल ${schemesData.length} योजनाएं उपलब्ध हैं। आप पूछ सकते हैं:\n- "कृषि योजनाएं दिखाओ"\n- "स्वास्थ्य योजनाओं के बारे में बताओ"\n- "महिलाओं के लिए योजनाएं"\n\nया किसी विशिष्ट विभाग या लाभ के बारे में पूछें।`
      : `I couldn't find schemes matching your specific query.\n\nWe have ${schemesData.length} schemes available. You can ask:\n- "Show agriculture schemes"\n- "Tell me about health schemes"\n- "Schemes for women"\n\nOr ask about a specific department or benefit.`;
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
      language: language
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const botResponse = await sendMessageToGemini(userMessage.text);
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        language: language
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: language === 'hi'
          ? 'क्षमा करें, कुछ गलत हो गया। कृपया पुनः प्रयास करें।'
          : 'Sorry, something went wrong. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        language: language
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    const languageCode = language === 'hi' ? 'hi-IN' : 'en-US';

    Speech.speak(text, {
      language: languageCode,
      pitch: 1.0,
      rate: 0.9,
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => {
        setIsSpeaking(false);
        Alert.alert(
          language === 'hi' ? 'त्रुटि' : 'Error',
          language === 'hi' 
            ? 'ऑडियो चलाने में समस्या हुई।'
            : 'Failed to play audio.'
        );
      }
    });
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
    Speech.stop();
    setIsSpeaking(false);
  };

  const clearChat = () => {
    Alert.alert(
      language === 'hi' ? 'चैट साफ़ करें' : 'Clear Chat',
      language === 'hi' 
        ? 'क्या आप सभी संदेश हटाना चाहते हैं?'
        : 'Do you want to delete all messages?',
      [
        {
          text: language === 'hi' ? 'रद्द करें' : 'Cancel',
          style: 'cancel'
        },
        {
          text: language === 'hi' ? 'हटाएं' : 'Delete',
          onPress: () => {
            const welcomeMessages = {
              en: 'Hello! I am your government schemes assistant powered by Google Gemini. I can help you find schemes, understand eligibility, benefits, and application processes. How can I help you today?',
              hi: 'नमस्ते! मैं Google Gemini द्वारा संचालित आपका सरकारी योजना सहायक हूं। मैं आपको योजनाएं खोजने, पात्रता समझने, लाभ और आवेदन प्रक्रियाओं में मदद कर सकता हूं। आज मैं आपकी कैसे मदद कर सकता हूं?'
            };

            setMessages([{
              id: '1',
              text: welcomeMessages[language],
              sender: 'bot',
              timestamp: new Date(),
              language: language
            }]);
            Speech.stop();
            setIsSpeaking(false);
          },
          style: 'destructive'
        }
      ]
    );
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isInitializing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Ionicons name="chatbubbles" size={24} color="#fff" />
            <Text style={styles.headerTitle}>Scheme Assistant</Text>
          </View>
        </View>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }]}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={[styles.loadingText, { marginTop: 16, fontSize: 16 }]}>
            {language === 'hi' ? 'योजनाएं लोड हो रही हैं...' : 'Loading schemes database...'}
          </Text>
          <Text style={[styles.loadingText, { marginTop: 8, fontSize: 12, color: '#9ca3af' }]}>
            {language === 'hi' ? 'कृपया प्रतीक्षा करें' : 'Please wait'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Ionicons name="chatbubbles" size={24} color="#fff" />
          <Text style={styles.headerTitle}>
            {language === 'hi' ? 'सरकारी योजना सहायक' : 'Scheme Assistant'}
          </Text>
          <View style={styles.schemesCountBadge}>
            <Text style={styles.schemesCountText}>{schemesData.length}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={toggleLanguage}
          >
            <Text style={styles.languageText}>
              {language === 'en' ? 'अ' : 'A'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={clearChat}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages Area with Keyboard Avoiding */}
      <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
>
  <View style={{ flex: 1 }}>
    
    {/* Messages */}
    <ScrollView
      ref={scrollViewRef}
      style={styles.messagesContainer}
      contentContainerStyle={{ paddingBottom: 100 }}
      keyboardShouldPersistTaps="handled"
      onContentSizeChange={() =>
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }
    >
      {messages.map((message) => (
  <View
    key={message.id}
    style={[
      styles.messageWrapper,
      message.sender === "user"
        ? styles.userMessageWrapper
        : styles.botMessageWrapper,
    ]}
  >
    <View
      style={[
        styles.messageBubble,
        message.sender === "user"
          ? styles.userMessage
          : styles.botMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          message.sender === "user"
            ? styles.userMessageText
            : styles.botMessageText,
        ]}
      >
        {message.text}
      </Text>

      <Text
        style={[
          styles.timestamp,
          message.sender === "user"
            ? styles.userTimestamp
            : styles.botTimestamp,
        ]}
      >
        {formatTime(message.timestamp)}
      </Text>
    </View>

    {/* Speaker button */}
    {message.sender === "bot" && (
      <TouchableOpacity
        style={styles.speakerButton}
        onPress={() => speakText(message.text)}
      >
        <Ionicons
          name="volume-medium-outline"
          size={20}
          color="#6366f1"
        />
      </TouchableOpacity>
    )}
  </View>
))}

    </ScrollView>

    {/* Input stays fixed */}
    <View style={styles.inputContainer}>
      <TextInput
  style={styles.input}
  value={inputText}
  onChangeText={setInputText}
  placeholder={
    language === "hi"
      ? "अपना प्रश्न लिखें..."
      : "Type your question..."
  }
  placeholderTextColor="#9ca3af"
  multiline={false}   // IMPORTANT
  returnKeyType="send"
  onSubmitEditing={sendMessage}
/>


      <TouchableOpacity
  style={[
    styles.sendButton,
    (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
  ]}
  onPress={sendMessage}
  disabled={!inputText.trim() || isLoading}
>
  <Ionicons name="send" size={20} color="#fff" />
</TouchableOpacity>

    </View>
  </View>
</KeyboardAvoidingView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  backButton: {
    padding: 4,
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  schemesCountBadge: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  schemesCountText: {
    color: '#1e3a8a',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 6,
  },
  languageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
  messagesContainer: {
  flex: 1,
  marginBottom: 80,
},

  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageWrapper: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  botMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: '#6366f1',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#1f2937',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: '#e0e7ff',
    textAlign: 'right',
  },
  botTimestamp: {
    color: '#9ca3af',
  },
  speakerButton: {
    marginLeft: 8,
    padding: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  inputContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderTopWidth: 1,
  borderTopColor: "#e5e7eb",
},

  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 10,
    fontSize: 15,
    maxHeight: 100,
    color: '#1f2937',
  },
  sendButton: {
    backgroundColor: '#6366f1',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#c7d2fe',
  },
});

export default ChatbotScreen;