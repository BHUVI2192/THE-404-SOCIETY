/**
 * Utility to wrap selected text in a textarea with HTML tags.
 */
export const wrapSelection = (
    textarea: HTMLTextAreaElement,
    startTag: string,
    endTag: string,
    onUpdate: (value: string) => void
) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end);

    const newValue = `${before}${startTag}${selectedText}${endTag}${after}`;
    onUpdate(newValue);

    // Restore focus and selection
    setTimeout(() => {
        textarea.focus();
        const newStart = start + startTag.length;
        const newEnd = end + startTag.length;
        textarea.setSelectionRange(newStart, newEnd);
    }, 0);
};

export const insertTag = (
    textarea: HTMLTextAreaElement,
    tag: string,
    onUpdate: (value: string) => void
) => {
    const start = textarea.selectionStart;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(start);

    const newValue = `${before}${tag}${after}`;
    onUpdate(newValue);

    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
};
