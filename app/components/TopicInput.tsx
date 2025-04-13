interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TopicInput({ value, onChange }: TopicInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium">Debate Topic</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter a topic for debate..."
        className="p-2 border rounded-md"
      />
      <p className="text-sm text-gray-500">
        Tip: Make it specific and debatable, e.g., "Should social media
        companies be responsible for misinformation?"
      </p>
    </div>
  );
}
