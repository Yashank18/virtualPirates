import { Form, Input, Upload, Button, Modal, Space, Checkbox, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Move all form-related styled components from App.tsx here

const GradientBackground = styled.div`
  background: #ffffff;
  min-height: 100vh;
  padding-top: 10vh;
  box-sizing: border-box;
`;

const FormSection = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  margin-bottom: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const RuleContainer = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  width: 100%;
`;

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    color: #334155;
  }
  
  .ant-input {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    
    &:hover, &:focus {
      border-color: #6366f1;
    }
  }

  .ant-upload-list {
    margin-top: 16px;
    
    .ant-upload-list-item {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      margin-top: 8px;
      background: #ffffff;
    }
  }

  ${RuleContainer} {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;

    .ant-input {
      background: #ffffff;
    }

    .ant-btn-text {
      height: 32px;
      padding: 4px 8px;
      color: #ef4444;
      
      &:hover {
        background: #fee2e2;
        color: #dc2626;
      }
    }
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 0.5rem;
  height: 48px;
  font-size: 1rem;
  background: #6366f1;
  border: none;

  &:hover {
    background: #4f46e5;
    transform: translateY(-2px);
  }
`;

const GuidelinesSection = styled.div`
  max-width: 600px;
  margin: 0 auto 1.5rem auto;
`;

const GuidelineHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const GuidelineCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 20px;
  width: 100%;
`;

const GuidelineCard = styled(Card)`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }
  
  .ant-card-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    min-height: 40px;
  }
  
  .guideline-name {
    color: #334155;
    font-size: 0.95rem;
    cursor: pointer;
    flex: 1;
    
    &:hover {
      color: #6366f1;
    }
  }
  
  .ant-checkbox-wrapper {
    color: rgba(255, 255, 255, 0.85);
  }

  .ant-checkbox {
    .ant-checkbox-inner {
      background-color: transparent;
      border-color: rgba(255, 255, 255, 0.2);
    }
    
    &.ant-checkbox-checked .ant-checkbox-inner {
      background-color: #a78bfa;
      border-color: #a78bfa;
    }
  }
`;

const AddGuidelineButton = styled(Button)`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #6366f1;

  &:hover {
    color: #ffffff;
  border: 1px solid #e2e8f0;
  background: #6366f1;
  }
`;


interface Guideline {
	_id?: string;
	name: string;
	guidelines: string;
}

// Add these styled components
const StyledModal = styled(Modal)`
  .ant-modal-content {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    padding: 24px;
  }
  
  .ant-modal-header {
    padding: 0;
    margin-bottom: 24px;
    border: none;
    background: transparent;
    
    .ant-modal-title {
      color: #1e293b;
      font-size: 24px;
      font-weight: 600;
    }
  }

  .ant-modal-body {
    padding: 0;
    color: #334155;

    .ant-form-item-label {
      padding-bottom: 8px;
      
      > label {
        color: #1e293b;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .ant-input, .ant-input-textarea {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 12px;
      color: #334155;
      font-size: 14px;
      
      &:hover, &:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
      }

      &::placeholder {
        color: #94a3b8;
      }
    }
  }

  .ant-modal-footer {
    padding: 0;
    margin-top: 24px;
    border: none;
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    .ant-btn {
      border-radius: 8px;
      height: 40px;
      font-weight: 500;
      padding: 0 16px;
      
      &.ant-btn-default {
        border: 1px solid #e2e8f0;
        color: #64748b;
        
        &:hover {
          border-color: #6366f1;
          color: #6366f1;
        }
      }
      
      &.ant-btn-primary {
        background: #6366f1;
        border: none;
        
        &:hover {
          background: #4f46e5;
        }
      }
    }
  }

  // Style for the rules section
  ${RuleContainer} {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;

    .ant-input {
      background: #ffffff;
    }

    .ant-btn-text {
      height: 32px;
      padding: 4px 8px;
      color: #ef4444;
      
      &:hover {
        background: #fee2e2;
        color: #dc2626;
      }
    }
  }

  // Add guideline button
  .ant-btn-dashed {
    border-color: #e2e8f0;
  border: 1px solid #e2e8f0;
    color: #6366f1;
    background: #ffffff;
    width: 100%;
    height: 40px;
    margin-top: 8px;
    
    &:hover {
      border-color: #6366f1;
      color: #4f46e5;
    }
  }

  // Checkbox styling
  .ant-checkbox-wrapper {
    color: #334155;
    margin: 16px 0;
    
    .ant-checkbox {
      .ant-checkbox-inner {
        border-color: #e2e8f0;
      }
      
      &.ant-checkbox-checked .ant-checkbox-inner {
        background-color: #6366f1;
        border-color: #6366f1;
      }
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 24px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const DeleteButton = styled(Button)`
  color: #ef4444;
  border-color: #ef4444;
  
  &:hover {
    color: #dc2626;
    border-color: #dc2626;
    background: #fee2e2;
  }
`;

const BackButton = styled(Button)`
  position: absolute;
  left: 24px;
  top: 24px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #64748b;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  &:hover {
    background: #f8fafc;
    color: #6366f1;
    border-color: #6366f1;
  }
`;

// Move these interfaces outside
interface FileWithBlob extends UploadFile {
  blobUrl?: string;
}

// Add API functions
const fetchGuidelines = async () => {
  try {
    const response = await fetch('http://10.1.222.153:8080/brand/getBrandGuideline', {
      headers: {
        'accept': '/'
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching guidelines:', error);
    return [];
  }
};

const ValidationMessage = styled.div`
  color: #ff4d4f;
  font-size: 0.9rem;
  margin-top: 8px;
`;

// Move these outside - they're just type definitions
interface CleanGuideline {
  GuidelineCategory: string;
  GuidelineDescription: string;
}

interface AIResponse {
  cleanedGuidelines: CleanGuideline[];
  rawGuidelines: string;
  normalizeGuidelines: string;
}

// Add new styled components
const LoadingModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ImageContainer = styled(motion.div)`
  width: 300px;
  height: 300px;
  position: relative;
`;

const LoadingText = styled(motion.h2)`
  color: #6523D1;
  margin-top: 2rem;
  font-size: 1.5rem;
`;

// Add array of loading messages
const LOADING_MESSAGES = [
  'Analyzing your ads on different users',
  'Analyzing your ads on different platforms',
  'Analyzing your ads on brand guidelines'
];

function AnalyzeForm() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<FileWithBlob[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [guidelineForm] = Form.useForm();
  const [editingGuideline, setEditingGuideline] = useState<Guideline | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeGuidelineId, setActiveGuidelineId] = useState<string>('');
  const [viewingGuideline, setViewingGuideline] = useState<Guideline | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiSummary, setAiSummary] = useState<AIResponse | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const images = [
    '/src/assets/first.png',
    '/src/assets/second.png',
    '/src/assets/third.png',
    '/src/assets/fourth.png',
    '/src/assets/fifth.jpeg',
  ];

  // Replace localStorage with API fetch
  useEffect(() => {
    fetchGuidelines().then(data => setGuidelines(data));
  }, []);

  // Update effect to rotate both images and messages
  useEffect(() => {
    if (isSubmitting) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setCurrentMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isSubmitting]);

  const handleSaveGuideline = async (values: any) => {
    try {
      // Format rules into a single string
      const guidelinesText = values.rules
        .map((rule: any, index: number) => `${index + 1}. ${rule.name}`)
        .join('\n');

      const response = await fetch('http://10.1.222.153:8080/brand/createBrandGuideline', {
        method: 'POST',
        headers: {
          'accept': '/',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          brandName: values.name,
          guidelines: guidelinesText
        })
      });

      if (response.ok) {
        const newGuideline = await response.json();
        setGuidelines([...guidelines, newGuideline]);
        setIsModalOpen(false);
        guidelineForm.resetFields();
      }
    } catch (error) {
      console.error('Error saving guideline:', error);
    }
  };

  const handleEditGuideline = (values: any) => {
    if (editingGuideline) {
      const updatedGuidelines = guidelines.map(g => 
        g._id === editingGuideline._id 
          ? { ...g, name: values.name, rules: values.rules || [] }
          : g
      );
      setGuidelines(updatedGuidelines);
      localStorage.setItem('guidelines', JSON.stringify(updatedGuidelines));
      setEditingGuideline(null);
      guidelineForm.resetFields();
    }
  };

  const handleFileChange = ({ fileList: newFileList }: { fileList: FileWithBlob[] }) => {
    // Create blob URLs for new files
    const processedFiles = newFileList.map(file => {
      if (file.originFileObj && !file.blobUrl) {
        file.blobUrl = URL.createObjectURL(file.originFileObj);
      }
      return file;
    });
    
    setFileList(processedFiles);
  };

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      fileList.forEach(file => {
        if (file.blobUrl) {
          URL.revokeObjectURL(file.blobUrl);
        }
      });
    };
  }, []);

  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    
    try {
      if (!activeGuidelineId) {
        console.error('Please select a guideline first');
        return;
      }

      const formData = new FormData();
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('images', file.originFileObj);
        }
      });
      formData.append('brandID', activeGuidelineId);
      formData.append('adBrief', values.description);

      const response = await fetch('http://10.1.222.153:8080/brand/batchBrandReview', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      navigate('/results', { 
        state: { 
          results: result,
          images: fileList.map(f => f.originFileObj)
        } 
      });
      
    } catch (error) {
      console.error('Error processing images:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const processWithAI = async (guidelines: string) => {
    setIsProcessingAI(true);
    try {
      const response = await fetch('http://10.1.222.153:8080/brand/generateBrandGuidelines', {
        method: 'POST',
        headers: {
          'accept': '/',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guidelines })
      });
      
      const result = await response.json();
      setAiSummary(result);
    } catch (error) {
      console.error('Error processing with AI:', error);
    } finally {
      setIsProcessingAI(false);
    }
  };

  return (
    <GradientBackground>
      <BackButton 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/')}
      >
        Back to Home
      </BackButton>
      
      <GuidelinesSection>
        <GuidelineHeader>
          <AddGuidelineButton
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Guidelines
          </AddGuidelineButton>
        </GuidelineHeader>
        
        <GuidelineCards>
          {guidelines.map(guideline => (
            <GuidelineCard key={guideline._id}>
              <div 
                className="guideline-name"
                onClick={() => {
                  setViewingGuideline(guideline);
                  setIsModalOpen(true);
                }}
              >
                {guideline.name || 'Unnamed Guideline'}
              </div>
              <Checkbox
                checked={activeGuidelineId === guideline._id}
                onClick={(e) => e.stopPropagation()}
                onChange={e => {
                  setActiveGuidelineId(e.target.checked ? guideline._id! : '');
                }}
              />
            </GuidelineCard>
          ))}
        </GuidelineCards>
      </GuidelinesSection>

      <FormSection>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <StyledForm
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              label="Tell us about your ad campaign"
              name="description"
              rules={[{ required: true, message: 'Please enter your campaign details' }]}
            >
              <Input.TextArea
                placeholder="Describe your campaign goals, target audience, and key messages..."
                rows={4}
                style={{ color: 'black' }}
              />
            </Form.Item>

            <Form.Item
              label="Upload your ad creatives"
              name="images"
            >
              <Upload.Dragger
                listType="picture-card"
                fileList={fileList}
                onChange={handleFileChange}
                multiple
                showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
                accept="image/*"
                beforeUpload={() => false} // Prevent auto-upload
                style={{ 
                  padding: '12px',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined style={{ fontSize: '1.5rem', color: '#6366f1' }} />
                </p>
                <p className="ant-upload-text" style={{ 
                  color: '#334155',
                  fontSize: '0.9rem',
                  marginBottom: '4px'
                }}>
                  Click or drag files to upload
                </p>
                <p className="ant-upload-hint" style={{ 
                  color: '#64748b',
                  fontSize: '0.8rem'
                }}>
                  Support for single or bulk upload
                </p>
              </Upload.Dragger>
            </Form.Item>

            <Form.Item>
              <SubmitButton 
                type="primary" 
                htmlType="submit"
                loading={isSubmitting}
                disabled={isSubmitting || fileList.length === 0}
              >
                {isSubmitting ? 'Analyzing...' : 'Analyze My Ad'}
              </SubmitButton>
            </Form.Item>
          </StyledForm>
        </motion.div>
      </FormSection>

      <StyledModal
        title={viewingGuideline ? "View Guideline" : "Create Guideline"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setViewingGuideline(null);
          guidelineForm.resetFields();
        }}
        centered
        width={600}
        footer={null}
      >
        {viewingGuideline ? (
          <div>
            <h3 style={{ color: '#334155' }}>{viewingGuideline.name}</h3>
            <Divider />
            <pre style={{ 
              whiteSpace: 'pre-wrap', 
              color: '#334155',
              fontSize: '1rem',
              background: '#f8fafc',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              {viewingGuideline.guidelines}
            </pre>
          </div>
        ) : (
          <Form
            form={guidelineForm}
            layout="vertical"
            onFinish={editingGuideline ? handleEditGuideline : handleSaveGuideline}
          >
            <Form.Item
              name="name"
              label="Brand Name"
              rules={[{ required: true, message: 'Please enter brand name' }]}
            >
              <Input placeholder="Enter brand name" />
            </Form.Item>

            <Form.List 
              name="rules"
              rules={[
                {
                  validator: async (_, rules) => {
                    if (!rules || rules.length < 1) {
                      return Promise.reject(new Error('At least one guideline is required'));
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <RuleContainer key={key}>
                      <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          rules={[{ required: true, message: 'Missing guideline' }]}
                        >
                          <Input.TextArea 
                            placeholder="Enter guideline"
                            rows={2}
                          />
                        </Form.Item>
                        <Button 
                          type="text" 
                          onClick={() => remove(name)}
                          icon={<DeleteOutlined />}
                          danger
                        >
                          Remove
                        </Button>
                      </Space>
                    </RuleContainer>
                  ))}
                  <ButtonGroup>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      style={{ width: 'auto' }}
                    >
                      Add Guideline
                    </Button>
                  </ButtonGroup>
                  {errors && errors.length > 0 && (
                    <ValidationMessage>{errors[0]}</ValidationMessage>
                  )}
                </>
              )}
            </Form.List>

            <Checkbox
              onChange={async (e) => {
                if (e.target.checked) {
                  const currentRules = guidelineForm.getFieldValue('rules') || [];
                  const guidelinesText = currentRules
                    .map((rule: any, index: number) => `${index + 1}. ${rule.name}`)
                    .join('\n');
                  
                  await processWithAI(guidelinesText);
                } else {
                  setAiSummary(null);
                }
              }}
            >
              Process with AI
            </Checkbox>

            {isProcessingAI && (
              <div style={{ color: 'rgba(255, 255, 255, 0.85)', marginTop: '8px' }}>
                Processing guidelines with AI...
              </div>
            )}

            {aiSummary && (
              <div>
                <h4 style={{ color: 'white', marginBottom: '12px' }}>AI Suggested Guidelines</h4>
                {aiSummary.cleanedGuidelines.map((guideline, index) => (
                  <Form.Item
                    key={index}
                    name={['aiRules', index]}
                    initialValue={guideline.GuidelineDescription}
                  >
                    <Input.TextArea
                      placeholder={guideline.GuidelineCategory}
                      defaultValue={guideline.GuidelineDescription}
                      rows={2}
                      style={{ marginBottom: '8px' }}
                    />
                  </Form.Item>
                ))}
                <ButtonGroup>
                  <Button
                    type="primary"
                    onClick={() => {
                      const aiRules = guidelineForm.getFieldValue('aiRules');
                      guidelineForm.setFieldsValue({
                        rules: aiRules.map((rule: string) => ({ name: rule }))
                      });
                      setAiSummary(null);
                    }}
                  >
                    Accept AI Suggestions
                  </Button>
                  <Button onClick={() => setAiSummary(null)}>
                    Discard
                  </Button>
                </ButtonGroup>
              </div>
            )}

            <Divider />

            <ButtonGroup>
              {editingGuideline && (
                <DeleteButton
                  danger
                  onClick={() => {
                    const updatedGuidelines = guidelines.filter(g => g._id !== editingGuideline._id);
                    setGuidelines(updatedGuidelines);
                    localStorage.setItem('guidelines', JSON.stringify(updatedGuidelines));
                    setEditingGuideline(null);
                    setIsModalOpen(false);
                  }}
                >
                  Delete Guideline
                </DeleteButton>
              )}
              <Button type="primary" onClick={() => guidelineForm.submit()}>
                {editingGuideline ? 'Save Changes' : 'Create Guideline'}
              </Button>
            </ButtonGroup>
          </Form>
        )}
      </StyledModal>

      <AnimatePresence>
        {isSubmitting && (
          <LoadingModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ImageContainer>
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </ImageContainer>
            <LoadingText
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {LOADING_MESSAGES[currentMessageIndex]}
            </LoadingText>
          </LoadingModal>
        )}
      </AnimatePresence>
    </GradientBackground>
  );
}

export default AnalyzeForm; 