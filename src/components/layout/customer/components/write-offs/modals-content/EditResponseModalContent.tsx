import QuestionnairesStepper from '@/components/QuestionnairesStepper';
import { useState } from 'react';

const EditResponseModalContent = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  return (
    <QuestionnairesStepper
      currentStepIndex={currentStepIndex}
      setCurrentStepIndex={setCurrentStepIndex}
    />
  );
};

export default EditResponseModalContent;
