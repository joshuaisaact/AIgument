import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebateState, DebateError } from "./useDebateState";

describe("initial state", () => {
  it("should initialize with empty rounds and correct defaults", () => {
    const { result } = renderHook(() => useDebateState());

    expect(result.current.rounds).toEqual([]);
    expect(result.current.currentRound).toBe(0);
    expect(result.current.currentDebater).toBe("debater1");
    expect(result.current.error).toBeNull();
  });
});

describe("handleResponseComplete - happy path", () => {
  it("should add debater1 response and switch to debater2", () => {
    const { result } = renderHook(() => useDebateState());

    act(() => {
      result.current.handleResponseComplete("Debater 1 first argument");
    });

    expect(result.current.rounds).toHaveLength(1);
    expect(result.current.rounds[0].debater1).toBe("Debater 1 first argument");
    expect(result.current.rounds[0].debater2).toBe("");
    expect(result.current.currentDebater).toBe("debater2");
    expect(result.current.currentRound).toBe(0);
  });

  it("should add debater2 response and advance to next round", () => {
    const { result } = renderHook(() => useDebateState());

    act(() => {
      result.current.handleResponseComplete("Debater 1 argument");
    });

    act(() => {
      result.current.handleResponseComplete("Debater 2 argument");
    });

    expect(result.current.rounds).toHaveLength(1);
    expect(result.current.rounds[0].debater1).toBe("Debater 1 argument");
    expect(result.current.rounds[0].debater2).toBe("Debater 2 argument");
    expect(result.current.currentDebater).toBe("debater1");
    expect(result.current.currentRound).toBe(1);
  });

  it("should handle multiple complete rounds", () => {
    const { result } = renderHook(() => useDebateState());

    // Round 1
    act(() => {
      result.current.handleResponseComplete("Round 1 - Debater 1");
    });
    act(() => {
      result.current.handleResponseComplete("Round 1 - Debater 2");
    });

    // Round 2
    act(() => {
      result.current.handleResponseComplete("Round 2 - Debater 1");
    });
    act(() => {
      result.current.handleResponseComplete("Round 2 - Debater 2");
    });

    expect(result.current.rounds).toHaveLength(2);
    expect(result.current.rounds[0].debater1).toBe("Round 1 - Debater 1");
    expect(result.current.rounds[0].debater2).toBe("Round 1 - Debater 2");
    expect(result.current.rounds[1].debater1).toBe("Round 2 - Debater 1");
    expect(result.current.rounds[1].debater2).toBe("Round 2 - Debater 2");
    expect(result.current.currentRound).toBe(2);
    expect(result.current.currentDebater).toBe("debater1");
  });

  it("should trim whitespace from responses", () => {
    const { result } = renderHook(() => useDebateState());

    act(() => {
      result.current.handleResponseComplete("  Text with spaces  ");
    });

    expect(result.current.rounds[0].debater1).toBe("Text with spaces");
  });
});

describe("resetDebate", () => {
  it("should reset all state to initial values at the end of the round", () => {
    const { result } = renderHook(() => useDebateState());

    // Add some rounds
    act(() => {
      result.current.handleResponseComplete("Debater 1 argument");
    });
    act(() => {
      result.current.handleResponseComplete("Debater 2 argument");
    });

    // Reset
    act(() => {
      result.current.resetDebate();
    });

    expect(result.current.rounds).toEqual([]);
    expect(result.current.currentRound).toBe(0);
    expect(result.current.currentDebater).toBe("debater1");
    expect(result.current.error).toBeNull();
  });
});

describe("error handling", () => {
  it("should not throw an error for an empty string", () => {
    const { result } = renderHook(() => useDebateState());

    act(() => {
      result.current.handleResponseComplete("");
    });

    expect(result.current.rounds[0].debater1).toBe("");
    expect(result.current.error).toBeNull();
  });

  it("should handle very long content", () => {
    const { result } = renderHook(() => useDebateState());
    const longContent = "a".repeat(10000);

    act(() => {
      result.current.handleResponseComplete(longContent);
    });

    expect(result.current.rounds[0].debater1).toBe(longContent);
    expect(result.current.error).toBeNull();
  });
});

it("should create errors with correct message and code", () => {
  const error = new DebateError("Test error message", "API_KEY_MISSING");

  expect(error.message).toBe("Test error message");
  expect(error.code).toBe("API_KEY_MISSING");
  expect(error.name).toBe("DebateError");
});
