"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect } from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/chat",
      headers: {
        "Content-Type": "application/json",
      },
      onResponse: (response) => {
        console.log("Received response:", response);
      },
      onFinish: (message) => {
        console.log("Chat finished with message:", message);
      },
      onError: (error) => {
        console.error("Chat error:", error);
      },
    });

  useEffect(() => {
    console.log("Messages updated:", messages);
  }, [messages]);

  useEffect(() => {
    console.log("Loading state:", isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      console.error("Error state:", error);
    }
  }, [error]);

  return (
    <div className="flex flex-col w-full max-w-md mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 p-4 rounded-lg ${
              message.role === "user" ? "bg-blue-100 ml-auto" : "bg-gray-100"
            }`}
          >
            <div className="font-semibold mb-1">
              {message.role === "user" ? "You" : "AI"}
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600
            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
