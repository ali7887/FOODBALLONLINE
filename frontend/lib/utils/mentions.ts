/**
 * Extract @username mentions from text
 */
export function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const matches = text.match(mentionRegex);
  
  if (!matches) {
    return [];
  }
  
  // Remove @ symbol and return unique usernames
  return Array.from(new Set(matches.map(match => match.substring(1))));
}

/**
 * Parse text and highlight mentions
 */
export function parseMentions(text: string, mentions: string[] = []): string {
  if (mentions.length === 0) {
    return text;
  }
  
  let parsed = text;
  mentions.forEach((username) => {
    const regex = new RegExp(`@${username}`, 'g');
    parsed = parsed.replace(
      regex,
      `<span class="text-tm-green font-semibold">@${username}</span>`
    );
  });
  
  return parsed;
}

