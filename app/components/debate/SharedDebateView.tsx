"use client";

import DebaterResponse from './DebaterResponse';
import ModelLogo from '../ui/ModelLogo';
import { ModelType } from '../../hooks/useModelProvider';

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
      <header className="text-center">
        <h1
          id={sectionLabelId}
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          {debate.debate.topic}
        </h1>
        <div className="flex justify-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <ModelLogo modelId={debate.debate.pro_model} />
            <span className="text-sm text-gray-600 dark:text-gray-400">For</span>
          </div>
          <div className="flex items-center gap-2">
            <ModelLogo modelId={debate.debate.con_model} />
            <span className="text-sm text-gray-600 dark:text-gray-400">Against</span>
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