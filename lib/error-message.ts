export function getUserFriendlyErrorMessage(error: unknown): string {
  const rawMessage = extractErrorMessage(error).toLowerCase();

  if (rawMessage.includes("42501") || rawMessage.includes("row-level security")) {
    return "이 작업을 수행할 권한이 없습니다.";
  }

  if (rawMessage.includes("failed to fetch")) {
    return "인터넷 연결을 확인해주세요.";
  }

  if (rawMessage.includes("not found")) {
    return "요청한 게시글을 찾을 수 없습니다.";
  }

  return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
}

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;

    if (typeof message === "string") {
      return message;
    }
  }

  return "";
}