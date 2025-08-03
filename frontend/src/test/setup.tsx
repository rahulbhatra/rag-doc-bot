// src/test/setup.ts
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = () => {};
});

export function createWrapper() {
  const queryClient = new QueryClient();

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}
