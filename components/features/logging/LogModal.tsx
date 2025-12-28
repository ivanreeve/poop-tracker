import { Check, Loader2, X } from 'lucide-react';
import type { StoolType } from '../../../types/models';
import { JuicyButton } from '../../ui/JuicyButton';
import { StoolTypeCard } from '../../ui/StoolTypeCard';

type LogModalProps = {
  open: boolean;
  onClose: () => void;
  selectedType: number | null;
  onSelectType: (type: number | null) => void;
  onConfirm: () => void;
  isSaving: boolean;
  stoolTypes: StoolType[];
};

export const LogModal = ({
  open,
  onClose,
  selectedType,
  onSelectType,
  onConfirm,
  isSaving,
  stoolTypes,
}: LogModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#fcf6f4] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-4 sm:px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={24} className="text-gray-400 hover:text-gray-600" strokeWidth={3} />
          </button>
          <div className="bg-gray-100 rounded-full h-2 w-full max-w-[50%] mx-4">
            <div className={`bg-[#5c1916] h-2 rounded-full transition-all duration-500 ${selectedType ? 'w-full' : 'w-1/2'}`} />
          </div>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-black text-gray-700 text-center mb-2">How was it?</h2>
          <p className="text-center text-gray-400 font-bold text-sm mb-6 sm:mb-8">Select the type that best matches.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {stoolTypes.map((type, index) => (
              <StoolTypeCard
                key={type.type}
                label={type.label}
                emoji={type.emoji}
                selected={selectedType === type.type}
                onClick={() => onSelectType(selectedType === type.type ? null : type.type)}
                delay={index * 50}
              />
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-white border-t-2 border-gray-100 shrink-0">
          <JuicyButton
            variant={selectedType ? 'primary' : 'outline'}
            size="lg"
            fullWidth
            disabled={!selectedType || isSaving}
            onClick={onConfirm}
            className={''}
          >
            {isSaving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                SAVING...
              </>
            ) : selectedType ? (
              <>
                <Check size={20} />
                CONFIRM
              </>
            ) : (
              'SELECT A TYPE'
            )}
          </JuicyButton>
        </div>
      </div>
    </div>
  );
};
