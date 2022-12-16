const getTextarea = () => {
  const textarea = document.createElement("textarea") as HTMLTextAreaElement;
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.display = "fixed";
  return textarea;
};

const isClipboardSupported = () => navigator?.clipboard != null;
const isClipboardCommandSupported = () =>
  document.queryCommandSupported?.("copy") ?? false;

/**
 * 인자로 받은 텍스트를 클립보드에 복사합니다.
 * @param text 복사할 텍스트
 *
 * @example
 * ```ts
 * const result = await copyToClipboard('하이');
 * if (result) {
 *   console.log('클립보드에 복사 성공');
 * } else {
 *   console.log('클립보드에 복사 실패');
 * }
 * ```
 */
export const copyToClipboard = (text: string) => {
  return new Promise<boolean>(async (resolve, _reject) => {
    const rootElement = document.body;

    if (isClipboardSupported()) {
      await navigator.clipboard.writeText(text);
      return resolve(true);
    }

    if (isClipboardCommandSupported()) {
      const textarea = getTextarea();
      textarea.value = text;

      rootElement.appendChild(textarea);

      textarea.focus();
      textarea.select();

      document.execCommand("copy");
      rootElement.removeChild(textarea);

      return resolve(true);
    }

    return resolve(false);
  });
};

export default copyToClipboard;
