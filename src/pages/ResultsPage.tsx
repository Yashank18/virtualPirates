import { Card, Progress, Modal, Button } from 'antd';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
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
  4: { emoji: "😊", label: "Aligned", description: "Strong adherence to brand guidelines" },
  5: { emoji: "😁", label: "Perfectly Aligned", description: "Flawless alignment with brand guidelines" }
};

const ResultsContainer = styled(motion.div)`
  background: linear-gradient(to bottom, #6523D1, #1a1a2e);
  min-height: 100vh;
  padding: 2rem;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ResultCard = styled(Card)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  justify-self: center;
  
  .ant-card-head {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    min-height: 40px;
    padding: 0 16px;
  }
  
  .ant-card-body {
    padding: 16px;
    color: rgba(255, 255, 255, 0.85);
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
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

const PersonaSection = styled.div`
  margin-top: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
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

function ResultsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log(state);
  // const { result, images } = state || { results: { brandReviews: [], personaReviews: [[]] }};
  const result = state.results;
  const images = state.images;
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  const getWorstEvaluation = (evaluations: Evaluation[]) => {
    return evaluations.reduce((worst, current) => 
      current.score < worst.score ? current : worst
    );
  };

  return (
    <ResultsContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ResultsGrid>
        <ResultCard title={`Image Analysis`}>
          {(() => {
            const brandReview = result.brandReviews[0];
            const avgScore = Math.round(
              brandReview.respOBJ.evaluations.reduce((acc, evaluation) => acc + evaluation.score, 0) / 
              brandReview.respOBJ.evaluations.length
            );
            const rating = RATING_MAP[avgScore];
            
            return (
              <>
                <RatingContainer>
                  <RatingEmoji>{rating.emoji}</RatingEmoji>
                  <RatingLabel>{rating.label}</RatingLabel>
                  <RatingDescription>{rating.description}</RatingDescription>
                </RatingContainer>

                <ImagePreview 
                  src={URL.createObjectURL(images[0])} 
                  alt="Analyzed image"
                  onClick={() => setPreviewImage(URL.createObjectURL(images[0]))}
                  style={{ cursor: 'pointer' }}
                />
                
                <h3 style={{ color: 'white', marginTop: '1rem' }}>Brand Guidelines</h3>
                {brandReview.respOBJ.evaluations.map((evaluation: Evaluation, evalIndex: number) => (
                  <EvaluationItem key={evalIndex}>
                    <h4>Guideline {evalIndex + 1}</h4>
                    <GuidelineText isExpanded={expandedItems[`${evalIndex}`]}>
                      {evaluation.guideline}
                    </GuidelineText>
                    {evaluation.guideline.length > 100 && (
                      <ExpandButton
                        type="text"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedItems(prev => ({
                            ...prev,
                            [`${evalIndex}`]: !prev[`${evalIndex}`]
                          }));
                        }}
                      >
                        {expandedItems[`${evalIndex}`] ? 'Show Less' : 'Show More'}
                      </ExpandButton>
                    )}
                    <Progress
                      percent={evaluation.score * 20}
                      status={evaluation.score >= 4 ? "success" : evaluation.score >= 2 ? "normal" : "exception"}
                      strokeColor={{
                        '0%': '#6523D1',
                        '100%': '#8F5AE8'
                      }}
                    />
                    <GuidelineText isExpanded={expandedItems[`${evalIndex}-feedback`]}>
                      {evaluation.feedback}
                    </GuidelineText>
                    {evaluation.feedback.length > 100 && (
                      <ExpandButton
                        type="text"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedItems(prev => ({
                            ...prev,
                            [`${evalIndex}-feedback`]: !prev[`${evalIndex}-feedback`]
                          }));
                        }}
                      >
                        {expandedItems[`${evalIndex}-feedback`] ? 'Show Less' : 'Show More'}
                      </ExpandButton>
                    )}
                  </EvaluationItem>
                ))}

                <PersonaSection>
                  <h3 style={{ color: 'white' }}>Persona Analysis</h3>
                  <PersonaGrid>
                    {result.personaReviews[0].map((persona) => (
                      <PersonaCard
                        key={persona.interactionID}
                        title={persona.persona}
                      >
                        {Object.entries(persona.result).map(([key, value]) => (
                          <div key={key}>
                            <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{key}: </span>
                            <Progress
                              percent={value * 20}
                              size="small"
                              strokeColor={{
                                '0%': '#6523D1',
                                '100%': '#8F5AE8'
                              }}
                            />
                          </div>
                        ))}
                      </PersonaCard>
                    ))}
                  </PersonaGrid>
                </PersonaSection>
              </>
            );
          })()}
        </ResultCard>
      </ResultsGrid>

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