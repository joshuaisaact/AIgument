import DebaterResponse from './DebaterResponse';
import ModelLogo from '../ui/ModelLogo';
import { ModelType } from '../../hooks/useModelProvider';
import { MODEL_CONFIGS } from '../../constants/models';
import { PersonalityId, PERSONALITY_CONFIGS } from '../../constants';

interface SharedDebateViewProps {
  debate: {
    debate: {
      id: string;
      topic: string;
      pro_model: ModelType;
      con_model: ModelType;
      pro_personality: PersonalityId;
      con_personality: PersonalityId;
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

  const proPersonalityName = PERSONALITY_CONFIGS[debate.debate.pro_personality]?.name || debate.debate.pro_personality;
  const conPersonalityName = PERSONALITY_CONFIGS[debate.debate.con_personality]?.name || debate.debate.con_personality;

  return (
    <section
      className="mx-auto w-full max-w-2xl px-4 py-12"
      aria-labelledby={sectionLabelId}
    >
      <header className="mb-10">
        <h1 id={sectionLabelId} className="text-2xl font-semibold tracking-tight">
          {debate.debate.topic}
        </h1>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <span className="text-sm font-semibold text-pro">For</span>
            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-ink">
              <ModelLogo modelId={debate.debate.pro_model} className="h-4 w-4" />
              <span>{MODEL_CONFIGS[debate.debate.pro_model]?.name || debate.debate.pro_model}</span>
            </div>
            <span className="mt-0.5 block text-xs text-ink-muted">{proPersonalityName}</span>
          </div>
          <div className="sm:text-right">
            <span className="text-sm font-semibold text-con">Against</span>
            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-ink sm:justify-end">
              <ModelLogo modelId={debate.debate.con_model} className="h-4 w-4" />
              <span>{MODEL_CONFIGS[debate.debate.con_model]?.name || debate.debate.con_model}</span>
            </div>
            <span className="mt-0.5 block text-xs text-ink-muted">{conPersonalityName}</span>
          </div>
        </div>
      </header>

      <div className="space-y-8">
        {debate.messages.map((message) => (
          <DebaterResponse
            key={message.id}
            position={message.role === 'pro' ? 'For' : 'Against'}
            model={message.role === 'pro' ? debate.debate.pro_model : debate.debate.con_model}
            personality={message.role === 'pro' ? debate.debate.pro_personality : debate.debate.con_personality}
          >
            {message.content}
          </DebaterResponse>
        ))}
      </div>
    </section>
  );
}