"use client";

interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TopicInput({ value, onChange }: TopicInputProps) {
  return (
    <div className="w-full">
      <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Debate Topic
      </label>
      <input
        type="text"
        id="topic"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter a topic for debate..."
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
      />
      <p className="text-sm text-gray-500">
        Tip: Make it specific and debatable, e.g., "Should social media
        companies be responsible for misinformation?"
      </p>
    </div>
  );
}
