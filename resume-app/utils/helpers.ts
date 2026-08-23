export const formatText = (text: string): string => {
  if (!text) return '';
  return text.replace(/\*\*(.*?)\*\*/g, '$1');
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
