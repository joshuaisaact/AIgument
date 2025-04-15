"use client";

import { Debate, DebateMessage } from '../../lib/db/debateService';
import DebaterResponse from './DebaterResponse';
import ModelLogo from '../ui/ModelLogo';

interface SharedDebateViewProps {
  debate: {
    debate: Debate;
    messages: DebateMessage[];
  };
}

export default function SharedDebateView({ debate }: SharedDebateViewProps) {
  const { debate: debateInfo, messages } = debate;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {debateInfo.topic}
        </h1>
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <ModelLogo modelId={debateInfo.pro_model} />
            <span>For</span>
          </div>
          <div className="flex items-center gap-2">
            <ModelLogo modelId={debateInfo.con_model} />
            <span>Against</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {messages.map((message, index) => (
          <DebaterResponse
            key={message.id}
            position={message.role === 'pro' ? 'For' : 'Against'}
            model={message.role === 'pro' ? debateInfo.pro_model : debateInfo.con_model}
          >
            {message.content}
          </DebaterResponse>
        ))}
      </div>
    </div>
  );
}