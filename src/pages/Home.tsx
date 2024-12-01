import { Button as AntButton } from 'antd';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AnimatedGradientTitle = styled(motion.h1)`
  background: linear-gradient(
    to right,
    #6523D1,
    #8F5AE8
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: clamp(3rem, 5vw, 4.5rem);
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  max-width: 60vw;
`;

const GradientBackground = styled.div`
  background: linear-gradient(to bottom, #0f0f1a, #1a1a2e);
  min-height: 100vh;
`;

const HeroContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  min-height: 100vh;
`;

const AnimatedSubtitle = styled(motion.p)`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.25rem;
  text-align: center;
  margin-bottom: 3rem;
  max-width: 42rem;
`;

const CTAButton = styled(AntButton)`
  height: 48px;
  font-size: 1.1rem;
  padding: 0 32px;
`;

// ... other styled components from App.tsx except form-related ones

function Home() {
  const navigate = useNavigate();

  return (
    <GradientBackground>
      <HeroContainer>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <AnimatedGradientTitle>
            Do your know if your <span style={{fontSize: '100px'}}>Ads</span> are attention grabbing?
          </AnimatedGradientTitle>

          <AnimatedSubtitle>
            Let's find out! With simple drag and drop, you can get instant insights and analytics.
          </AnimatedSubtitle>

          <CTAButton onClick={() => navigate('/analyze')}>
            Get Started
          </CTAButton>
        </motion.div>
      </HeroContainer>
    </GradientBackground>
  );
}

export default Home; 