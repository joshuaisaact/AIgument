import DebaterResponse from './DebaterResponse';
import ModelLogo from '../ui/ModelLogo';
import { ModelType } from '../../hooks/useModelProvider';
import { MODEL_CONFIGS } from '../../constants/models';

interface SharedDebateViewProps {
  debate: {
    debate: {
      id: string;
      topic: string;
      pro_model: ModelType;
      con_model: ModelType;
      created_at: string;
      updated_at: string;
    };
    messages: Array<{
      id: string;
      debate_id: string;
      role: 'pro' | 'con';
      content: string;
      created_at: string;
    }>;
  };
}

export default function SharedDebateView({ debate }: SharedDebateViewProps) {
  const sectionLabelId = `debate-topic-${debate.debate.id}`;

  return (
    <section
      className="max-w-4xl mx-auto p-4 space-y-8"
      aria-labelledby={sectionLabelId}
    >
      <header className="mb-8">
        <h1
          id={sectionLabelId}
          className="text-2xl font-bold text-gray-900 dark:text-white text-center"
        >
          {debate.debate.topic}
        </h1>
        <div className="mt-3 flex justify-between items-start text-sm">
          <div className="text-left">
            <span className="font-semibold text-blue-700 dark:text-blue-400 block">For</span>
            <div className="flex items-center gap-1.5 mt-1">
              <ModelLogo modelId={debate.debate.pro_model} className="w-4 h-4" />
              <span className="text-gray-800 dark:text-gray-200">{MODEL_CONFIGS[debate.debate.pro_model]?.name || debate.debate.pro_model}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-semibold text-red-700 dark:text-red-400 block">Against</span>
            <div className="flex items-center justify-end gap-1.5 mt-1">
              <span className="text-gray-800 dark:text-gray-200">{MODEL_CONFIGS[debate.debate.con_model]?.name || debate.debate.con_model}</span>
              <ModelLogo modelId={debate.debate.con_model} className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-4">
        {debate.messages.map((message) => (
          <DebaterResponse
            key={message.id}
            position={message.role === 'pro' ? 'For' : 'Against'}
            model={message.role === 'pro' ? debate.debate.pro_model : debate.debate.con_model}
          >
            {message.content}
          </DebaterResponse>
        ))}
      </div>
    </section>
  );
}