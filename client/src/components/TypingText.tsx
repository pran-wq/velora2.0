import { useEffect, useState } from 'react';

/** Lightweight typing reveal for assistant messages (post-API). */
export function TypingText({ text, className }: { text: string; className?: string }) {
  const [shown, setShown] = useState('');

  useEffect(() => {
    setShown('');
    if (!text) return;
    let i = 0;
    const step = Math.max(2, Math.floor(text.length / 400));
    const id = window.setInterval(() => {
      i += step;
      if (i >= text.length) {
        setShown(text);
        window.clearInterval(id);
      } else {
        setShown(text.slice(0, i));
      }
    }, 14);
    return () => window.clearInterval(id);
  }, [text]);

  return <p className={className}>{shown}</p>;
}
