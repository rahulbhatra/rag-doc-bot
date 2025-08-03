import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { createWrapper } from "../src/test/setup";

import App from "./App";

test("renders main heading", () => {
  render(<App />, { wrapper: createWrapper() });
  expect(screen.getByText(/dragon/i)).toBeInTheDocument();
});
