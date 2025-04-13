type Model = "claude" | "gpt4" | "gpt35" | "gemini";

interface ModelSelectorProps {
  label: string;
  value: Model;
  onChange: (value: Model) => void;
  otherSelected: Model;
}

export default function ModelSelector({
  label,
  value,
  onChange,
  otherSelected,
}: ModelSelectorProps) {
  const models = [
    { id: "claude", name: "Claude 3 Sonnet" },
    { id: "gpt4", name: "GPT-4 Turbo" },
    { id: "gpt35", name: "GPT-3.5 Turbo" },
    { id: "gemini", name: "Gemini Pro" },
  ];

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-gray-900">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Model)}
        className="p-2 border rounded-md bg-white text-gray-900"
      >
        {models.map((model) => (
          <option
            key={model.id}
            value={model.id}
            disabled={model.id === otherSelected}
            className="text-gray-900"
          >
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
}
