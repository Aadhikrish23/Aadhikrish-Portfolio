import axios from "axios";

// Turns an API/network failure into one readable sentence for a toast or inline message.
// The server forwards Zod failures as a JSON array of issues; show the first one plainly.
export const getErrorMessage = (error: unknown, fallback = "Something went wrong. Try again.") => {
  if (axios.isAxiosError(error)) {
    if (!error.response) return "Can't reach the server. Check your connection and try again.";
    const message = (error.response.data as { message?: unknown } | undefined)?.message;
    if (typeof message === "string" && message) {
      try {
        const issues = JSON.parse(message);
        if (Array.isArray(issues) && issues[0]?.message) {
          const field = Array.isArray(issues[0].path) ? issues[0].path.join(".") : "";
          return field ? `${field}: ${issues[0].message}` : String(issues[0].message);
        }
      } catch {
        /* plain-text message */
      }
      return message;
    }
  }
  return fallback;
};
