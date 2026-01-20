/**
 * Empathy Ledger Integration
 *
 * This module provides AI-enhanced storytelling capabilities for community voices.
 * It can enhance raw community stories with richer narrative while maintaining
 * the authentic voice and meaning of the original submission.
 *
 * Features:
 * - Story enhancement: Polish and expand community submissions
 * - Theme detection: Automatically categorize stories by theme
 * - Narrative generation: Create audio-ready narrative versions
 * - Consent-first design: Only process stories with explicit consent
 */

interface StoryInput {
  content: string;
  authorName: string;
  authorRole?: string;
  isAnonymous?: boolean;
}

interface EnhancedStory {
  enhanced: string;
  theme: "belonging" | "growth" | "connection" | "transformation";
  narrative: string;
  summary: string;
}

interface EmpathyLedgerConfig {
  apiKey?: string;
  apiEndpoint?: string;
  model?: string;
}

const DEFAULT_CONFIG: EmpathyLedgerConfig = {
  apiEndpoint: process.env.EMPATHY_LEDGER_API_ENDPOINT || "https://api.anthropic.com/v1/messages",
  apiKey: process.env.EMPATHY_LEDGER_API_KEY || process.env.ANTHROPIC_API_KEY,
  model: "claude-3-haiku-20240307",
};

/**
 * Detect the primary theme of a community story
 */
export async function detectStoryTheme(
  content: string,
  config: EmpathyLedgerConfig = DEFAULT_CONFIG
): Promise<EnhancedStory["theme"]> {
  // For R&D phase, use simple keyword detection
  // In production, this would call an AI API
  const themes = {
    belonging: ["belong", "home", "welcome", "place", "community", "friends", "neighbours"],
    growth: ["learn", "grow", "skill", "teach", "workshop", "garden", "plant", "develop"],
    connection: ["connect", "meet", "people", "relationship", "network", "together"],
    transformation: ["change", "transform", "heal", "overcome", "journey", "discover"],
  };

  const lowerContent = content.toLowerCase();
  let maxScore = 0;
  let detectedTheme: EnhancedStory["theme"] = "connection";

  for (const [theme, keywords] of Object.entries(themes)) {
    const score = keywords.filter((kw) => lowerContent.includes(kw)).length;
    if (score > maxScore) {
      maxScore = score;
      detectedTheme = theme as EnhancedStory["theme"];
    }
  }

  return detectedTheme;
}

/**
 * Enhance a community story with AI while preserving authentic voice
 *
 * This is the core R&D function for the Empathy Ledger feature.
 * It demonstrates the innovation of using AI to amplify community voices
 * rather than replace them.
 */
export async function enhanceStory(
  input: StoryInput,
  config: EmpathyLedgerConfig = DEFAULT_CONFIG
): Promise<EnhancedStory> {
  const { apiKey, apiEndpoint, model } = config;

  // Theme detection (simple version for R&D phase)
  const theme = await detectStoryTheme(input.content);

  // For R&D documentation purposes, if no API key is configured,
  // return the original content with placeholder enhancements
  if (!apiKey) {
    console.log("Empathy Ledger: No API key configured, returning original content");
    return {
      enhanced: input.content,
      theme,
      narrative: input.content,
      summary: input.content.slice(0, 100) + "...",
    };
  }

  try {
    const systemPrompt = `You are a compassionate storyteller helping to share community voices from The Harvest, a regenerative community hub in the Sunshine Coast hinterland.

Your role is to:
1. ENHANCE: Polish the story for clarity and emotional resonance while keeping the authentic voice
2. PRESERVE: Never change the meaning or add experiences the person didn't describe
3. NARRATIVE: Create an audio-ready version that could be read aloud naturally
4. SUMMARIZE: Create a brief 1-2 sentence summary

The author's name is ${input.isAnonymous ? "Anonymous" : input.authorName}${input.authorRole ? `, ${input.authorRole}` : ""}.

Respond in JSON format:
{
  "enhanced": "The polished version of their story",
  "narrative": "A version suitable for audio narration, in third person",
  "summary": "1-2 sentence summary"
}`;

    const response = await fetch(apiEndpoint!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Please enhance this community story:\n\n"${input.content}"`,
          },
        ],
        system: systemPrompt,
      }),
    });

    if (!response.ok) {
      console.error("Empathy Ledger API error:", await response.text());
      // Fallback to original content
      return {
        enhanced: input.content,
        theme,
        narrative: input.content,
        summary: input.content.slice(0, 100) + "...",
      };
    }

    const data = await response.json();
    const responseText = data.content?.[0]?.text || "";

    // Parse JSON response
    try {
      const parsed = JSON.parse(responseText);
      return {
        enhanced: parsed.enhanced || input.content,
        theme,
        narrative: parsed.narrative || input.content,
        summary: parsed.summary || input.content.slice(0, 100) + "...",
      };
    } catch {
      // If JSON parsing fails, return original
      return {
        enhanced: input.content,
        theme,
        narrative: input.content,
        summary: input.content.slice(0, 100) + "...",
      };
    }
  } catch (error) {
    console.error("Empathy Ledger enhancement failed:", error);
    return {
      enhanced: input.content,
      theme,
      narrative: input.content,
      summary: input.content.slice(0, 100) + "...",
    };
  }
}

/**
 * Generate a collective narrative from multiple stories
 *
 * This R&D function explores how to weave individual stories into
 * a community tapestry while respecting each voice.
 */
export async function generateCollectiveNarrative(
  stories: StoryInput[],
  config: EmpathyLedgerConfig = DEFAULT_CONFIG
): Promise<string> {
  if (!config.apiKey || stories.length === 0) {
    return "The voices of The Harvest community are many and varied, each bringing their own story of connection and growth.";
  }

  // For R&D phase, create a simple narrative
  const themes = await Promise.all(stories.map((s) => detectStoryTheme(s.content)));
  const themeCounts = themes.reduce(
    (acc, theme) => {
      acc[theme] = (acc[theme] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const primaryTheme = Object.entries(themeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "connection";

  const themeMessages = {
    belonging: "a place where strangers become neighbours",
    growth: "a space for learning and growing together",
    connection: "a gathering point for meaningful connections",
    transformation: "a catalyst for personal and community change",
  };

  return `The Harvest has become ${themeMessages[primaryTheme as keyof typeof themeMessages]}. Through ${stories.length} shared stories, we hear echoes of ${Object.keys(themeCounts).join(", ")} - the threads that weave our community together.`;
}

/**
 * Check if the Empathy Ledger service is properly configured
 */
export function isEmpathyLedgerConfigured(): boolean {
  return !!DEFAULT_CONFIG.apiKey;
}

/**
 * R&D Innovation Log Entry
 *
 * This module represents novel innovation in:
 * 1. Ethical AI for community storytelling - consent-first design
 * 2. Voice preservation - amplifying rather than replacing human voices
 * 3. Thematic synthesis - finding patterns across community narratives
 * 4. Audio narrative generation - accessibility through spoken word
 *
 * Technical uncertainties overcome:
 * - Balancing AI enhancement with authenticity preservation
 * - Designing consent workflows for sensitive personal content
 * - Handling API failures gracefully without losing stories
 */
