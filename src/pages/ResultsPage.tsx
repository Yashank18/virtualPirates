import { Card, Progress, Modal, Button } from 'antd';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeftOutlined, MessageOutlined } from '@ant-design/icons';
interface Evaluation {
  guideline: string;
  score: number;
  feedback: string;
}

interface BrandReview {
  rawresponse: string;
  cleanedResponse: any[];
  respOBJ: {
    evaluations: Evaluation[];
  };
}

interface PersonaResult {
  "Brand Recognition": number;
  "Message Clarity": number;
  "Visual Appeal": number;
  "Emotional Resonance": number;
  "Brand Recall": number;
  "Interest Generation": number;
  "Ad Visibility": number;
  "Simplicity": number;
  "Relevance": number;
  "Brand Association": number;
}

interface PersonaReview {
  persona: string;
  result: PersonaResult;
  interactionID: string;
}

interface ImageResult {
  brandReviews: BrandReview[];
  personaReviews: PersonaReview[][];
}

interface RatingInfo {
  emoji: string;
  label: string;
  description: string;
}

const RATING_MAP: Record<number, RatingInfo> = {
  0: { emoji: "😔", label: "Not Aligned", description: "Complete misalignment with brand guidelines" },
  1: { emoji: "😟", label: "Rarely Aligned", description: "Slight effort but still far from acceptable" },
  2: { emoji: "😐", label: "Somewhat Aligned", description: "Partial alignment but needs improvement" },
  3: { emoji: "🙂", label: "Mostly Aligned", description: "Good adherence with minor deviations" },
  4: { emoji: "😊", label: "Almost There", description: "Strong adherence to brand guidelines" },
  5: { emoji: "😁", label: "Perfectly Aligned", description: "Flawless alignment with brand guidelines" }
};

const ResultsContainer = styled(motion.div)`
  background: #ffffff;
  min-height: 100vh;
  padding: 2rem;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ImageAnalysisCard = styled.div`
  width: 100%;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
`;

const ImageSection = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
  align-items: flex-start;
`;

const ImagePreview = styled.img`
  width: 200px;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
`;

const ImageDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MetadataSection = styled.div`
  padding: 1.5rem;
`;

const MetadataItem = styled.div`
  margin-bottom: 1rem;
  
  h4 {
    color: #64748b;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
`;

const ChatToggle = styled(Button)`
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: #6523D1;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(101, 35, 209, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #5019B0;
    color: white;
  }
`;

const ChatSection = styled.div<{ isOpen: boolean }>`
  position: fixed;
  right: ${props => props.isOpen ? '0' : '-500px'};
  top: 0;
  width: 500px;
  height: 100vh;
  background: white;
  border-left: 1px solid #e2e8f0;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: right 0.3s ease;
  z-index: 1000;
`;

const ChatHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  
  h2 {
    font-size: 1rem;
    color: #334155;
    margin: 0;
  }
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

const ChatInput = styled.div`
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  background: white;
`;

const ChatInputArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  resize: none;
  min-height: 60px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #6523D1;
    box-shadow: 0 0 0 3px rgba(101, 35, 209, 0.1);
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: 12px;
  margin-bottom: 8px;
  
  span {
    width: 8px;
    height: 8px;
    background: #6523D1;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
  
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`;

const EvaluationItem = styled.div`
  margin-bottom: 1.5rem;
  
  h4 {
    color: white;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
`;

const GuidelineText = styled.p<{ isExpanded: boolean }>`
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.isExpanded ? 'none' : 2};
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
`;

const ExpandButton = styled(Button)`
  font-size: 0.8rem;
  padding: 2px 8px;
  height: auto;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  margin-bottom: 8px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
`;

const RatingEmoji = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const RatingLabel = styled.div`
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const RatingDescription = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  text-align: center;
`;

const ShowMoreButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;
const BackButton = styled(Button)`
  position: absolute;
  left: 24px;
  top: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: rgba(255, 255, 255, 0.85);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
`;

const PersonaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const PersonaCard = styled(Card)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);

  .ant-card-head {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;


const ChatTriggerButton = styled(Button)`
  margin-top: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #6523D1;
  width: 100%;
  
  &:hover {
    background: #f1f5f9;
    border-color: #6523D1;
    color: #5019B0;
  }
`;

// Add array of colors for circles
const PERSONA_COLORS = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#10B981', // Emerald
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#F97316', // Orange
  '#6366F1', // Violet
];

// Update calculateAverageScore to handle NaN
const calculateAverageScore = (scores: PersonaResult): number | null => {
  const values = Object.values(scores) as number[];
  const validValues = values.filter(val => !isNaN(val));
  
  if (validValues.length === 0) return null;
  
  const sum = validValues.reduce((acc, val) => acc + val, 0);
  const average = sum / validValues.length;
  return Math.round(average);
};

// Add new styled components for chat bubbles
const ChatMessage = styled.div<{ isUser?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 1rem;
`;

const MessageBubble = styled.div<{ isUser?: boolean }>`
  background: ${props => props.isUser ? '#6523D1' : '#f1f5f9'};
  color: ${props => props.isUser ? 'white' : '#334155'};
  padding: 0.75rem 1rem;
  border-radius: 16px;
  border-bottom-${props => props.isUser ? 'right' : 'left'}-radius: 4px;
  max-width: 80%;
  word-wrap: break-word;
`;

// Add interface for chat message
interface ChatMessage {
  text: string;
  isUser: boolean;
}

// Add new styled components
const PersonaCirclesContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const PersonaCircle = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: #6523D1;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 32px;

  &:hover {
    background: #f1f5f9;
    transform: translateY(-2px);
  }
`;

const ScoreBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background: #6523D1;
  color: white;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 10px;
  border: 2px solid white;
`;

const PersonaTooltip = styled.div`
  position: absolute;
  top: -48px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  white-space: nowrap;
  z-index: 10;

  ${PersonaCircle}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-8px);
  }
`;

// Update interface to match new structure
interface PersonaReviewsData {
  identifiedPersonasList: any; // We'll type this later when needed
  results: PersonaReview[];
}

// Update validation function
const isValidResult = (brandReview: BrandReview, personaReviews: PersonaReviewsData) => {
  return personaReviews.results.some(persona => {
    const averageScore = calculateAverageScore(persona.result);
    return averageScore !== null;
  });
};

// Add new styled component for collapsible section
const BrandAnalysisSection = styled.div`
  margin-top: 1rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
`;

const ViewMoreButton = styled(Button)`
  margin: 1rem auto 0;
  display: block;
  color: #6523D1;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  padding: 0 2rem;
  
  &:hover {
    color: #5019B0;
    border-color: #6523D1;
    background: #f8fafc;
  }
`;

// Add new styled component for heading
const SectionHeading = styled.h4`
  color: #334155;
  font-size: 1rem;
  margin-bottom: 1rem;
  font-weight: 500;
`;

// Add new styled components
const LegendCard = styled.div`
  position: sticky;
  top: 2rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const LegendTitle = styled.h3`
  color: #334155;
  font-size: 1rem;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const LegendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .emoji {
    font-size: 1.25rem;
  }
  
  .info {
    .score {
      color: #334155;
      font-weight: 500;
      font-size: 0.875rem;
    }
    .label {
      color: #64748b;
      font-size: 0.75rem;
    }
  }
`;

// Add interface for persona details
interface PersonaDetails {
  _id: string;
  name: string;
  age: number;
  occupation: string;
  interests: string[];
  description: string;
}

// Add new styled components
const PersonaListCard = styled.div`
  margin-top: 2rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const PersonaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PersonaItem = styled.div`
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;

  .name {
    color: #334155;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }

  .details {
    color: #64748b;
    font-size: 0.875rem;
  }

  .interests {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  .interest-tag {
    background: #e2e8f0;
    color: #475569;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
  }
`;

// Update interface for review structure
interface PersonaReviewData {
  imageIdentifiedPersonasList: string[];
  results: PersonaReview[];
}

function ResultsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  
  // Add validation for state
  if (!state || !state.results || !state.images) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        background: '#fff',
        color: '#64748b'
      }}>
        <h3 style={{ color: '#334155', marginBottom: '0.5rem' }}>
          No Results Available
        </h3>
        <p>Please analyze some images first.</p>
        <Button 
          type="primary" 
          onClick={() => navigate('/analyze')}
          style={{ marginTop: '1rem' }}
        >
          Go to Analysis
        </Button>
      </div>
    );
  }

  const result = state.results;
  const images = state.images;
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentContext, setCurrentContext] = useState<string>('');
  const chatRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentInteractionId, setCurrentInteractionId] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [personas, setPersonas] = useState<PersonaDetails[]>([]);
  const [matchingPersonas, setMatchingPersonas] = useState<PersonaDetails[]>([]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsChatOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChatOpen = (evaluation: Evaluation, interactionId?: string) => {
    setCurrentContext(`Talking to ${evaluation.feedback}`);
    setCurrentInteractionId(interactionId || '');
    setIsChatOpen(true);
    setMessages([]); // Clear previous messages
  };

  const getWorstEvaluation = (evaluations: Evaluation[]) => {
    return evaluations.reduce((worst, current) => 
      current.score < worst.score ? current : worst
    );
  };

  const avgScore = Math.round(
    result.brandReviews[0].respOBJ.evaluations.reduce((acc: number, evaluation: Evaluation) => acc + evaluation.score, 0) / 
    result.brandReviews[0].respOBJ.evaluations.length
  );
  const rating = RATING_MAP[avgScore];

  // Add function to handle message send
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const message = inputMessage;
    setInputMessage(''); // Clear input immediately
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    setIsTyping(true); // Show typing indicator

    try {
      const response = await fetch('http://10.1.222.153:8080/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userMessage: message,
          interactionID: currentInteractionId
        })
      });

      const data = await response.json();
      console.log('Chat response:', data);
      setMessages(prev => [...prev, { text: data.message || data.response, isUser: false }]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false); // Hide typing indicator
    }
  };

  // Add effect to fetch personas
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const response = await fetch('http://10.1.222.153:8080/persona/personas');
        const data = await response.json();
        setPersonas(data);
      } catch (error) {
        console.error('Error fetching personas:', error);
      }
    };

    fetchPersonas();
  }, []);

  // Add effect to filter matching personas
  useEffect(() => {
    console.log('personas', personas, result?.personaReviews);
    if (personas.length && result?.personaReviews) {
      const identifiedIds = result.personaReviews.flatMap((review: PersonaReviewData) => 
        review.imageIdentifiedPersonasList || []
      );
      
      const matching = personas.filter(persona => 
        identifiedIds.includes(persona._id)
      );
      
      setMatchingPersonas(matching);
      console.log('matching', matching);
    }
  }, [personas, result]);

  return (
    <ResultsContainer>
      <LegendCard>
        <LegendTitle>Score Legend</LegendTitle>
        <LegendGrid>
          {Object.entries(RATING_MAP).map(([score, info]) => (
            <LegendItem key={score}>
              <span className="emoji">{info.emoji}</span>
              <div className="info">
                <div className="score">{score}/5</div>
                <div className="label">{info.label}</div>
              </div>
            </LegendItem>
          ))}
        </LegendGrid>
      </LegendCard>
      <MainContent>
        {result.brandReviews.map((brandReview: BrandReview, reviewIndex: number) => {
          // Skip this result if no valid persona data
          if (!result.personaReviews[reviewIndex]?.results) {
            return null;
          }

          const avgScore = Math.round(
            brandReview.respOBJ.evaluations.reduce((acc: number, evaluation: Evaluation) => acc + evaluation.score, 0) / 
            brandReview.respOBJ.evaluations.length
          );
          const rating = RATING_MAP[avgScore];

          return (
            <ImageAnalysisCard key={reviewIndex}>
              <ImageSection>
                <ImagePreview 
                  src={URL.createObjectURL(images[reviewIndex])} 
                  alt={`Analyzed image ${reviewIndex + 1}`}
                  onClick={() => setPreviewImage(URL.createObjectURL(images[reviewIndex]))}
                />
                <ImageDetails>
                  {/* Persona Analysis First */}
                  <div>
                    <SectionHeading>Target Audience Score</SectionHeading>
                    <PersonaCirclesContainer>
                      {result.personaReviews[reviewIndex].results.map((persona: PersonaReview) => {
                        const averageScore = calculateAverageScore(persona.result);
                        if (averageScore === null) return null;

                        const initials = persona.persona
                          .split(' ')
                          .map(word => word[0])
                          .join('')
                          .toUpperCase();
                        
                        const colorIndex = persona.persona
                          .split('')
                          .reduce((acc, char) => acc + char.charCodeAt(0), 0) % PERSONA_COLORS.length;
                        
                        return (
                          <PersonaCircle 
                            key={persona.interactionID}
                            onClick={() => handleChatOpen({
                              guideline: '',
                              score: averageScore,
                              feedback: `${persona.persona}`
                            }, persona.interactionID)}
                            style={{ 
                              background: `${PERSONA_COLORS[colorIndex]}15`,
                              color: PERSONA_COLORS[colorIndex],
                              borderColor: `${PERSONA_COLORS[colorIndex]}30`
                            }}
                          >
                            {initials}
                            <ScoreBadge style={{ background: PERSONA_COLORS[colorIndex] }}>
                              {averageScore}
                            </ScoreBadge>
                            <PersonaTooltip>
                              <div style={{ marginBottom: '0.5rem', color: '#334155' }}>
                                {persona.persona}
                              </div>
                              <Button
                                type="primary"
                                size="small"
                                icon={<MessageOutlined />}
                                style={{
                                  background: PERSONA_COLORS[colorIndex],
                                  border: 'none',
                                  boxShadow: 'none'
                                }}
                              >
                                Chat Now
                              </Button>
                            </PersonaTooltip>
                          </PersonaCircle>
                        );
                      })}
                    </PersonaCirclesContainer>
                  </div>

                  {/* Collapsible Brand Analysis */}
                  <BrandAnalysisSection>
                    <MetadataItem>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{rating.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <Progress
                            percent={avgScore * 20}
                            strokeColor={{
                              '0%': '#6523D1',
                              '100%': '#8F5AE8'
                            }}
                          />
                        </div>
                        <span style={{ color: '#334155', fontWeight: 500 }}>{rating.label}</span>
                      </div>
                    </MetadataItem>

                    {!expandedCards[reviewIndex] ? (
                      <ViewMoreButton 
                        onClick={() => setExpandedCards(prev => ({ ...prev, [reviewIndex]: true }))}
                      >
                        View Brand Analysis
                      </ViewMoreButton>
                    ) : (
                      <>
                        {brandReview.respOBJ.evaluations.map((evaluation: Evaluation, evalIndex: number) => (
                          <div key={evalIndex} style={{ marginTop: '1rem' }}>
                            <h4 style={{ color: '#334155', fontSize: '0.875rem' }}>
                              {evaluation.guideline}
                            </h4>
                            <Progress
                              percent={evaluation.score * 20}
                              size="small"
                              strokeColor={{
                                '0%': '#6523D1',
                                '100%': '#8F5AE8'
                              }}
                            />
                            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                              {evaluation.feedback}
                            </p>
                          </div>
                        ))}
                        <ViewMoreButton 
                          onClick={() => setExpandedCards(prev => ({ ...prev, [reviewIndex]: false }))}
                        >
                          Show Less
                        </ViewMoreButton>
                      </>
                    )}
                  </BrandAnalysisSection>
                </ImageDetails>
              </ImageSection>
            </ImageAnalysisCard>
          );
        }).filter(Boolean)}

        {/* Show message if all results were filtered out */}
        {result.brandReviews.every((brandReview: BrandReview, index: number) => 
          !result.personaReviews[index]?.results
        ) && (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            color: '#64748b'
          }}>
            <h3 style={{ color: '#334155', marginBottom: '0.5rem' }}>
              Analysis Incomplete
            </h3>
            <p>
              We encountered an issue processing the persona analysis for these images. 
              Please try again or contact support if the problem persists.
            </p>
          </div>
        )}
      </MainContent>

      <ChatToggle 
        icon={<MessageOutlined />}
        onClick={() => setIsChatOpen(!isChatOpen)}
      />
       <PersonaListCard>
        <LegendTitle>Identified Target Personas</LegendTitle>
        <PersonaList>
          {matchingPersonas?.length > 0 ? (
            matchingPersonas.map(persona => (
              <PersonaItem key={persona._id}>
                <div className="name">{persona.name}</div>
                <div className="details">{persona.description}</div>
                
              </PersonaItem>
            ))
          ) : (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '1rem' }}>
              No matching personas found
            </div>
          )}
        </PersonaList>
      </PersonaListCard>

      <ChatSection isOpen={isChatOpen} ref={chatRef}>
        <ChatHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Chat</h2>
            <Button 
              type="text" 
              size="small"
              onClick={() => setIsChatOpen(false)}
            >
              ✕
            </Button>
          </div>
        </ChatHeader>
        <ChatBody>
          {currentContext && (
            <div style={{ 
              padding: '0.75rem', 
              background: '#f8fafc', 
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              color: '#334155'
            }}>
              {currentContext}
            </div>
          )}
          {messages.map((message, index) => (
            <ChatMessage key={index} isUser={message.isUser}>
              <MessageBubble isUser={message.isUser}>
                {message.text}
              </MessageBubble>
            </ChatMessage>
          ))}
          {isTyping && (
            <ChatMessage>
              <TypingIndicator>
                <span></span>
                <span></span>
                <span></span>
              </TypingIndicator>
            </ChatMessage>
          )}
        </ChatBody>
        <ChatInput>
          <ChatInputArea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
          />
        </ChatInput>
      </ChatSection>

      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        width="80%"
        centered
        bodyStyle={{ padding: 0 }}
      >
        <img 
          src={previewImage || ''} 
          style={{ width: '100%', height: 'auto' }} 
          alt="Preview"
        />
      </Modal>
    </ResultsContainer>
  );
}

export default ResultsPage; 