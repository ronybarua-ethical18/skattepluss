import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { questionnaires } from '@/lib/questionnaires';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/redux/hooks';
import {
  filterAndUpdateQuestionnaires,
  showModal,
} from '@/redux/slices/questionnaire';
import { SelectedAnswer } from './layout/auth/Onboard';

type QuestionnairesStepperProps = {
  currentStepIndex: number;
  setCurrentStepIndex: Dispatch<SetStateAction<number>>;
};

export default function QuestionnairesStepper({
  currentStepIndex,
  setCurrentStepIndex,
}: QuestionnairesStepperProps) {
  const { data: user } = useSession();
  const utils = trpc.useUtils();
  const { data: loggedUser } = trpc.users.getUserByEmail.useQuery();

  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswer[]>(
    () => {
      if (!loggedUser?.questionnaires) return [];

      return loggedUser.questionnaires.map((questionnaire: any) => {
        if (
          typeof questionnaire.answers[0] === 'string' ||
          Array.isArray(questionnaire.answers[0])
        ) {
          return questionnaire;
        }

        return {
          question: questionnaire.question,
          answers: questionnaire.answers.map((answerObj: any) => {
            const [key] = Object.entries(answerObj)[0];
            return key;
          }),
        };
      });
    }
  );

  const step = questionnaires[currentStepIndex];

  const updateQuestionnaires = trpc.users.updateUser.useMutation();

  const mutateUpdateQestionnaires = useCallback(() => {
    updateQuestionnaires.mutate(
      { questionnaires: selectedAnswers },
      {
        onSuccess: () => {
          toast.success(
            pathname.split('/').pop() !== 'write-offs'
              ? 'Congrats! you have successfully onboarded'
              : 'You have successfully updated your answers'
          );
          setLoading(false);
          utils.users.getUserByEmail.invalidate();
          dispatch(filterAndUpdateQuestionnaires(selectedAnswers));
          dispatch(showModal(false));
          if (pathname.split('/').pop() !== 'write-offs')
            router.push(`/${loggedUser?.role}/dashboard`);
        },
        onError: (error) => {
          console.error('Failed to update questionnaires:', error);
        },
      }
    );
  }, [selectedAnswers, router, updateQuestionnaires, user?.user?.email]);

  const handleComplete = async () => {
    setLoading(true);
    mutateUpdateQestionnaires();
  };

  const handleAnswerClick = (answer: string, question: string): void => {
    setSelectedAnswers((prev) => {
      const existingQuestion = prev.find((item) => item.question === question);
      if (existingQuestion) {
        const isAnswerSelected = existingQuestion.answers.includes(answer);
        const updatedAnswers = isAnswerSelected
          ? existingQuestion.answers.filter((ans) => ans !== answer)
          : [...existingQuestion.answers, answer];

        return prev.map((item) =>
          item.question === question
            ? { ...item, answers: updatedAnswers }
            : item
        );
      } else {
        return [...prev, { question, answers: [answer] }];
      }
    });
  };

  const goToNextStep = () => setCurrentStepIndex((prev) => prev + 1);

  const goToPreviousStep = () => setCurrentStepIndex((prev) => prev - 1);

  const handleSkip = () => {
    // Remove answers for current question if any exist
    setSelectedAnswers((prev) =>
      prev.filter((item) => item.question !== step?.question)
    );
    goToNextStep();
  };

  // Check if current step has any selected answers
  const hasSelectedAnswers = selectedAnswers.some(
    (item) => item.question === step?.question && item.answers.length > 0
  );

  return (
    <>
      <div
        className={cn(
          'flex flex-col justify-between w-[560px] h-[485px] ',
          pathname.split('/').pop() !== 'write-offs' &&
            'border border-[#E4E4E7] p-6 rounded-lg shadow-md'
        )}
      >
        <div className="text-center space-y-6">
          <div className="space-y-3 relative">
            {currentStepIndex > 0 ? (
              <Button
                type="button"
                className="absolute left-0 top-0 border-none p-0 hover:bg-gray-100 transition-colors"
                variant="white"
                onClick={goToPreviousStep}
              >
                <ChevronLeft
                  color="#8F8F8F"
                  className="hover:text-gray-700 transition-colors"
                />
              </Button>
            ) : (
              <span />
            )}

            <h2 className="text-[var(--700,#18181B)] font-inter text-[20px] md:text-[24px] font-bold leading-normal">
              {step?.question}
            </h2>
            <p className="text-gray-600 text-center text-[var(--500,#71717A)] font-inter text-[12px] font-medium leading-normal">
              This information allows Skattepluss to suggest tax savings. Select
              all that apply.
            </p>
          </div>
        </div>
        <div className="space-y-2 w-full flex flex-col max-h-[297px] overflow-y-auto [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-[#5B52F9] [&::-webkit-scrollbar-thumb]:rounded-full">
          {step?.answers?.map((answer, i) => (
            <label
              key={i}
              onClick={() => handleAnswerClick(answer, step?.question)}
              className={cn(
                'cursor-pointer text-center transition-colors p-4 rounded-[6px] border',
                selectedAnswers
                  .find((item) => item.question === step?.question)
                  ?.answers.includes(answer)
                  ? 'border-[var(--violet,#5B52F9)] bg-[var(--violet-2,#F0EFFE)]'
                  : 'border-[var(--grey,#E4E4E7)] bg-white hover:bg-gray-100'
              )}
            >
              <span
                className={cn(
                  'self-stretch text-center font-inter text-sm font-normal leading-[150%]',
                  selectedAnswers
                    .find((item) => item.question === step?.question)
                    ?.answers.includes(answer)
                    ? 'text-[var(--violet,#5B52F9)]'
                    : 'text-black'
                )}
              >
                {answer}
              </span>
            </label>
          ))}
        </div>
        <div
          className={`flex ${currentStepIndex > 0 && 'space-x-2'} w-full justify-between`}
        >
          {currentStepIndex < questionnaires.length - 1 ? (
            <div className="flex space-x-2 w-full">
              <Button
                type="button"
                className="w-full"
                variant="white"
                onClick={handleSkip}
              >
                Skip
              </Button>
              <Button
                className="w-full"
                type="button"
                variant="purple"
                onClick={goToNextStep}
                disabled={!hasSelectedAnswers}
              >
                Next
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="purple"
              onClick={handleComplete}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {pathname.split('/').pop() !== 'write-offs'
                ? 'Complete'
                : 'Update'}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
