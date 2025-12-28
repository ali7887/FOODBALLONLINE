'use client';

import { useMemo } from 'react';
import { parseMentions } from '@/lib/utils/mentions';

interface MentionTextProps {
  text: string;
  mentions?: string[];
  className?: string;
}

export function MentionText({ text, mentions = [], className = '' }: MentionTextProps) {
  const parsedText = useMemo(() => {
    if (mentions.length === 0) {
      return text;
    }
    return parseMentions(text, mentions);
  }, [text, mentions]);

  if (mentions.length === 0) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: parsedText }}
    />
  );
}

