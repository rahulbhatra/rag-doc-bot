import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ChatInput from "./ChatInput";
import { createWrapper } from "../test/setup";

describe("ChatInput component", () => {
  const mockOnSend = vi.fn();
  const mockOnStop = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should disable input and submit when isLoading=true", async () => {
    render(
      <ChatInput
        sessionId={1}
        onSend={mockOnSend}
        onStop={mockOnStop}
        isLoading={true}
      />,
      { wrapper: createWrapper() },
    );

    const input = screen.getByPlaceholderText("Ask anything");

    const stopButton = screen.getByRole("button", { name: "stop-button" });
    expect(stopButton).toBeEnabled();

    await userEvent.type(input, "Hello");
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it("should send message when Enter pressed and not loading", async () => {
    render(
      <ChatInput
        sessionId={2}
        onSend={mockOnSend}
        onStop={mockOnStop}
        isLoading={false}
      />,
      { wrapper: createWrapper() },
    );

    const input = screen.getByPlaceholderText("Ask anything");
    await userEvent.type(input, "Test message");

    expect(input).toHaveValue("Test message");

    const sendButton = screen.getByRole("button", { name: "send-button" });
    await userEvent.click(sendButton);

    expect(mockOnSend).toHaveBeenCalledWith("Test message", 2);
    expect(input).toHaveValue("");
  });
});
