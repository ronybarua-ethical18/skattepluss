import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MdOutlineSignpost } from 'react-icons/md';
import SharedModal from '@/components/SharedModal';
import CreateRuleModalContent from './CreateRuleModalContent';
import { Edit2 } from 'lucide-react';
import { useTranslation } from '@/lib/TranslationProvider';
import { UpdateRuleProps } from '@/types/questionnaire';

export default function CreateRuleModal({
  updateRulePayload,
  origin,
}: {
  updateRulePayload?: UpdateRuleProps;
  origin?: string;
}) {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleButtonClick = () => {
    setModalOpen(true);
  };
  const { translate } = useTranslation();

  return (
    <>
      {!origin ? (
        <Button variant="purple" onClick={handleButtonClick}>
          <MdOutlineSignpost size={20} className="mr-2" />
          {translate('page.rulesTopSection.create_rule')}
        </Button>
      ) : (
        <Edit2
          className="h-4 w-4 text-[#5B52F9] cursor-pointer mr-2"
          onClick={handleButtonClick}
        />
      )}
      <div className="bg-white z-50">
        <SharedModal
          open={isModalOpen}
          onOpenChange={setModalOpen}
          customClassName="max-w-[500px]"
        >
          <div className="bg-white">
            <CreateRuleModalContent
              origin={origin}
              modalClose={setModalOpen}
              updateRulePayload={updateRulePayload}
            />
          </div>
        </SharedModal>
      </div>
    </>
  );
}
