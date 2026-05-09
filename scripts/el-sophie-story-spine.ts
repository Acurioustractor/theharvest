import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SOPHIE_STORYTELLER_ID = "c2ba535c-aa50-42c3-af18-ed61d3330716";
const EL_ENV_PATH = "/Users/benknight/Code/empathy-ledger-v2/.env.local";
const OUT_DIR = "docs/communications/story-packs";
const SOPHIE_STORY_TITLE = "From seeds to social connection";
const LEGACY_SOPHIE_STORY_TITLE = "From clearing to care";
const SOPHIE_ARTICLE_SLUG = "from-clearing-to-care-sophie-harvest-garden";
const SOCIAL_IMAGE_FILENAMES = [
  "20260506-1E5A4675.jpg",
  "20260506-1E5A4665.jpg",
  "20260506-1E5A4671.jpg",
];

dotenv.config({ path: ".env.local", override: false });
dotenv.config({ path: ".env", override: false });
dotenv.config({ path: EL_ENV_PATH, override: true });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const makePack = args.has("--pack");
const createStory = args.has("--create-story");
const publishArticle = args.has("--publish-article");
const verifyArticle = args.has("--verify-article");

type Storyteller = {
  id: string;
  profile_id: string | null;
  display_name: string | null;
  bio: string | null;
  cultural_background: string[] | null;
  location: string | null;
  organization_id: string | null;
  public_avatar_url: string | null;
};

type MediaAsset = {
  id: string;
  original_filename: string;
  title: string | null;
  alt_text: string | null;
  cdn_url: string | null;
  url: string | null;
  metadata: Record<string, unknown> | null;
  requires_consent: boolean | null;
  consent_obtained: boolean | null;
};

type Transcript = {
  id: string;
  title: string;
  transcript_content: string;
  text: string | null;
  ai_summary: string | null;
  key_quotes: string[] | null;
  themes: string[] | null;
  video_url: string | null;
  audio_url: string | null;
  source_video_url: string | null;
  media_asset_id: string | null;
  word_count: number | null;
  created_at: string | null;
  organization_id: string | null;
  tenant_id: string | null;
  project_id: string | null;
};

function mustEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`${name} is missing. Checked ${EL_ENV_PATH}`);
  return value;
}

function cleanTranscript(text: string): string {
  return text
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function excerpt(text: string, max = 650): string {
  const clean = cleanTranscript(text);
  return clean.length > max ? `${clean.slice(0, max)}...` : clean;
}

function likelySophieMedia(media: MediaAsset[]): MediaAsset[] {
  return media.filter((asset) => {
    const batch = asset.metadata?.harvestBatch;
    return batch === "sophie-garden";
  });
}

function firstUsefulTranscript(transcripts: Transcript[]): Transcript | null {
  return transcripts
    .filter((transcript) => (transcript.transcript_content || transcript.text || "").trim().length > 0)
    .sort((a, b) => (b.word_count ?? 0) - (a.word_count ?? 0))[0] ?? null;
}

function buildStoryPack(storyteller: Storyteller, transcript: Transcript | null, media: MediaAsset[]): string {
  const transcriptText = transcript ? cleanTranscript(transcript.transcript_content || transcript.text || "") : "";
  const quoteSeeds = transcript?.key_quotes?.length
    ? transcript.key_quotes.slice(0, 6)
    : transcriptText
        .split(/\n+/)
        .map((line) => line.trim())
        .filter((line) => line.length > 80 && line.length < 260)
        .slice(0, 6);

  const mediaLines = media.slice(0, 12).map((asset) => {
    const url = asset.cdn_url || asset.url || "";
    return `- ${asset.original_filename}: ${asset.title || asset.alt_text || "Sophie garden image"}${url ? `\n  ${url}` : ""}`;
  });

  return `# Sophie Garden Story Pack

Source:

- Storyteller: ${storyteller.display_name || "Sophie"}
- Storyteller ID: ${storyteller.id}
- Transcript: ${transcript ? `${transcript.title} (${transcript.id})` : "none found"}
- Sophie-linked media: ${media.length}

## Current Read

This is the human garden story.

The useful angle is not "look at our garden". It is:

\`\`\`text
people are starting to care for the place before it is finished
\`\`\`

Sophie gives the garden a face, but the post should still make the work bigger than one person. Use her as the way in, not the whole frame.

## Story Directions To Test

### 1. The Garden Has A Keeper Energy

Short social angle:

\`\`\`text
Some parts of The Harvest are being built with machines.
Some parts are being built by people noticing what needs care.
\`\`\`

Use for:

- Instagram carousel
- newsletter paragraph
- soft Facebook update

### 2. Before The Place Opens, People Are Already Showing Up

Short social angle:

\`\`\`text
The place is not open yet, but the pattern is already there:
someone sees a useful job and steps in.
\`\`\`

Use for:

- Facebook
- newsletter lead
- volunteer / working bee bridge

### 3. From Seeds To Social Connection

Short social angle:

\`\`\`text
The garden story is not just plants.
It is how people start talking while the work gets done.
\`\`\`

Use for:

- garden update
- reel voiceover
- bridge from Sophie article to weekly social posts

## Draft Caption

\`\`\`text
The garden is starting to need a different kind of attention now.

Not just clearing. Care.

Sophie has been in the beds, checking what is coming through, moving small things into better places, and giving the garden the kind of attention that makes it feel less like a project and more like a place.

That is probably the real shift at The Harvest this week.

Some of it is machines and milk crates and big visible change.
Some of it is quieter.

Someone noticing what needs doing.
Someone taking a corner seriously.
Someone helping the place become itself.
\`\`\`

## Newsletter Seed

\`\`\`html
<h2>From seeds to social connection</h2>

<p>Sophie knew this place before it was The Harvest.</p>

<p>She came here as a gardener, buying seeds from Green Harvest and chasing the weird and wonderful vegetables that made sense in this climate.</p>

<p>Now she is back in the garden, helping the place find its next shape. Her line about seedlings says a lot about this stage: "You've got these constant babies."</p>

<p>For Sophie, the deeper point is not really the gardening. "That's just a fun byproduct. It's really about social connection."</p>
\`\`\`

## Reel / Video Cut Idea

Use Sophie interview audio as the spine.

Visual order:

1. Sophie in the garden, hands / movement before full face.
2. Garden detail.
3. Wide pavilion build shot.
4. Back to Sophie / garden.
5. End on a wide garden or pavilion frame.

Overlay text, if needed:

\`\`\`text
From seeds to social connection
The garden story is people learning to show up
\`\`\`

Keep overlay minimal. Let her voice and the garden carry it.

## Quote Seeds

${quoteSeeds.length ? quoteSeeds.map((quote) => `- ${quote}`).join("\n") : "- No transcript quotes found yet."}

## Transcript Excerpt

\`\`\`text
${transcriptText ? excerpt(transcriptText, 1600) : "No transcript found."}
\`\`\`

## Linked Media

${mediaLines.length ? mediaLines.join("\n") : "No Sophie media linked yet."}

## Review Notes

- Confirm Sophie is comfortable being named and shown.
- Prefer hands, garden, and working shots before face-led portraits.
- Do not publish a direct quote until checked against the transcript and tone.
- Use this as a story source for GHL, not as raw public copy.
`;
}

function buildStoryContent(transcript: Transcript | null, media: MediaAsset[]): string {
  const transcriptText = transcript ? cleanTranscript(transcript.transcript_content || transcript.text || "") : "";
  return `# From seeds to social connection

Working draft for Sophie Hickey's Harvest garden story.

## Story Spine

Sophie is not just helping in the garden.

She carries three useful threads:

1. Green Harvest memory: she knew the old site as a gardener and seed buyer.
2. Seedling craft: she talks about seedlings as fiddly, seasonal, constant care.
3. Social connection: for her, growing food is a way people start talking without it being awkward.

The Harvest story is this:

A former seed place is becoming a working public place again, and Sophie helps explain why the garden matters.

## Draft Social Caption

Sophie knew this place before it was The Harvest.

She came here as a gardener, buying seeds from Green Harvest and chasing the weird and wonderful vegetables that made sense in this climate.

Now she is back in the garden, helping the place find its next shape.

"You've got these constant babies," she says about seedlings.

That feels like the right lesson for this stage of The Harvest. Not just clearing. Care. Timing. Weather. Netting. Raised beds. People noticing what the place is ready for.

And the best line from Sophie so far:

"It's not really about the gardening anymore. That's just a fun byproduct. It's really about social connection."

That is the garden story.

## Video Cut

Use Sophie interview audio as the spine.

1. Old garden / beds / wide Harvest site.
2. Sophie with seedlings.
3. Hands, trays, soil, raised beds.
4. Milk crate pavilion or wide drone shot.
5. Sophie / garden / people working.

Overlay, only if needed:

From seeds to social connection

## Review Notes

- Confirm Sophie is comfortable being named and shown.
- Prefer hands, garden, and working shots before face-led portraits.
- Do not publish a direct quote until checked against the transcript and tone.
- Use this as a source story for GHL, not raw public copy.

## Transcript Excerpt

${transcriptText ? excerpt(transcriptText, 1800) : "No transcript found."}

## Media Count

${media.length} Sophie garden photos linked.
`;
}

function articleContent(): string {
  return `Sophie Hickey remembers Green Harvest as a gardener first.

Before The Harvest had a name, before milk crates started turning into a pavilion, this place was somewhere she came for seeds.

"I used to come here as a customer at the Green Harvest site to buy seeds as a gardener," she says.

The old catalogue mattered. The nursery mattered. It carried "a really fun, eclectic range of weird and wonderful vegetables", the kind of food plants that made sense in this climate but did not always show up in ordinary backyard thinking.

So when Green Harvest closed, Sophie says people felt it.

"People were palpably upset that Green Harvest shut down."

That is part of why her voice matters here. Sophie is not walking into a blank site. She knows the old use of the place. She knows what people came here for. She also knows what it takes to keep small growing things alive.

Her own work began after a move from Brisbane to Maleny, a block of land, and a slow change in what felt worth doing.

"The more I was working from home in such a beautiful location, the less I wanted to be in front of a screen," she says.

She had been working in healthcare through COVID, inside a system that was already under pressure. The garden became the place she went to recover from that.

"I was just gardening more and more to de-stress. Until one day I was like, hang on, I can do this instead."

That became Sophie Seedlings.

Seedlings sound simple until someone who grows them starts talking properly.

"It is actually quite fiddly to get the seedlings to be strong, the right time of year, for the right climate," Sophie says.

Then she says the line that explains the whole job:

"You've got these constant babies."

That is the energy The Harvest needs in the garden now. Not just clearing. Not just moving mulch. The next layer is care, timing, protection, and people who notice what the place is ready for.

Sophie has already been thinking practically: raised beds, mesh arches for creepers, better netting, irrigation, wildlife, clay soil, storms, and the point where a garden can feed people without pretending it is bigger than it is.

Her advice is simple and useful:

"You start at your capacity and then once you're humming at your capacity, you can keep going."

That feels like the right pace for The Harvest.

The big visible work is easy to photograph. Machines. Paths. Timber. Milk crates. A shed waking up.

But Sophie notices the other part too.

"It's been really nice to see the energy being put back into the space," she says.

She laughs about the play in it.

"Seeing adults play is really funny."

Then, about the milk-crate experiments:

"Why not build Lego monster beings out of milk crates?"

That line probably says more about The Harvest than any polished description could.

It is a garden, kitchen, and art space taking shape in Witta. But it is also a place where the practical and the playful are starting to meet. Raised beds and weird vegetables. Seedlings and storms. Food and experiments. Adults playing seriously enough to make something useful.

For Sophie, the deeper point of growing food is not just the food.

"It's not really about the gardening anymore. That's just a fun byproduct. It's really about social connection."

That is the story worth holding.

The Harvest does not need to pretend it is finished.

It needs to keep making room for people to show up, put hands in soil, ask what grows here, and start talking while the work gets done.

One bed first.

Then the next.`;
}

function socialCaption(articleUrl: string): string {
  return `Sophie knew this place before it was The Harvest.

She came here as a gardener, buying seeds from Green Harvest and chasing the weird and wonderful vegetables that made sense in this climate.

Now she is back in the garden, helping the place find its next shape.

"You've got these constant babies," she says about seedlings.

That feels like the right lesson for this stage of The Harvest. Not just clearing. Care. Timing. Weather. Netting. Raised beds. People noticing what the place is ready for.

And the best line from Sophie so far:

"It's not really about the gardening anymore. That's just a fun byproduct. It's really about social connection."

That is the garden story.

Read the story:
${articleUrl}`;
}

async function main() {
  const supabase = createClient(
    mustEnv("NEXT_PUBLIC_SUPABASE_URL", SUPABASE_URL),
    mustEnv("SUPABASE_SERVICE_ROLE_KEY", SUPABASE_SERVICE_KEY),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data: storyteller, error: storytellerError } = await supabase
    .from("storytellers")
    .select("id, profile_id, display_name, bio, cultural_background, location, organization_id, public_avatar_url")
    .eq("id", SOPHIE_STORYTELLER_ID)
    .maybeSingle<Storyteller>();
  if (storytellerError) throw storytellerError;
  if (!storyteller) throw new Error(`Storyteller not found: ${SOPHIE_STORYTELLER_ID}`);

  const { data: transcripts, error: transcriptError } = await supabase
    .from("transcripts")
    .select("id, title, transcript_content, text, ai_summary, key_quotes, themes, video_url, audio_url, source_video_url, media_asset_id, word_count, created_at, organization_id, tenant_id, project_id")
    .or(`storyteller_id.eq.${storyteller.id}${storyteller.profile_id ? `,storyteller_id.eq.${storyteller.profile_id}` : ""}`)
    .order("created_at", { ascending: false })
    .returns<Transcript[]>();
  if (transcriptError) throw transcriptError;

  const { data: harvestAssets, error: mediaError } = await supabase
    .from("media_assets")
    .select("id, original_filename, title, alt_text, cdn_url, url, metadata, requires_consent, consent_obtained")
    .eq("source_type", "harvest-lightroom-export")
    .returns<MediaAsset[]>();
  if (mediaError) throw mediaError;

  const sophieMedia = likelySophieMedia(harvestAssets ?? []);

  const { data: existingLinks, error: linksError } = await supabase
    .from("media_storytellers")
    .select("media_asset_id, storyteller_id, relationship, consent_status")
    .eq("storyteller_id", storyteller.id);
  if (linksError) throw linksError;
  const linkedIds = new Set((existingLinks ?? []).map((link) => link.media_asset_id));
  const toLink = sophieMedia.filter((asset) => !linkedIds.has(asset.id));

  console.log(`Storyteller: ${storyteller.display_name || "Unknown"} (${storyteller.id})`);
  console.log(`Bio: ${storyteller.bio ? "yes" : "no"}`);
  console.log(`Transcripts: ${transcripts?.length ?? 0}`);
  for (const transcript of transcripts ?? []) {
    const text = transcript.transcript_content || transcript.text || "";
    console.log(`- ${transcript.title} (${transcript.id}) words=${transcript.word_count ?? text.split(/\s+/).length} video=${transcript.video_url || transcript.source_video_url ? "yes" : "no"}`);
  }
  console.log(`Sophie candidate photos from Harvest batch: ${sophieMedia.length}`);
  console.log(`Already linked to Sophie: ${sophieMedia.length - toLink.length}`);
  console.log(`Need linking: ${toLink.length}`);

  if (apply && toLink.length) {
    const rows = toLink.map((asset) => ({
      media_asset_id: asset.id,
      storyteller_id: storyteller.id,
      relationship: "appears_in",
      consent_status: "pending",
      source: "batch",
      hide_from_public: true,
      consent_notes: "Batch linked from Harvest May Sophie garden media. Review before public use.",
    }));
    const { error: linkError } = await supabase
      .from("media_storytellers")
      .upsert(rows, {
        onConflict: "media_asset_id,storyteller_id,relationship",
        ignoreDuplicates: true,
      });
    if (linkError) throw linkError;
    console.log(`Linked ${rows.length} Sophie candidate photos with pending consent and hidden-from-public flag.`);
  } else if (!apply) {
    console.log("No writes made. Re-run with --apply to link candidate photos to Sophie.");
  }

  if (makePack) {
    mkdirSync(OUT_DIR, { recursive: true });
    const transcript = firstUsefulTranscript(transcripts ?? []);
    const pack = buildStoryPack(storyteller, transcript, sophieMedia);
    const outPath = resolve(OUT_DIR, "2026-05-07-sophie-garden-story-pack.md");
    writeFileSync(outPath, pack);
    console.log(`Wrote story pack: ${outPath}`);
  }

  if (createStory) {
    const transcript = firstUsefulTranscript(transcripts ?? []);
    if (!transcript) {
      throw new Error("Cannot create EL story: no usable Sophie transcript found.");
    }

    const title = SOPHIE_STORY_TITLE;
    const { data: existingStory, error: existingStoryError } = await supabase
      .from("stories")
      .select("id, title, status")
      .eq("storyteller_id", storyteller.id)
      .eq("transcript_id", transcript.id)
      .in("title", [title, LEGACY_SOPHIE_STORY_TITLE])
      .maybeSingle();
    if (existingStoryError) throw existingStoryError;

    if (existingStory) {
      const mediaUrls = sophieMedia
        .map((asset) => asset.cdn_url || asset.url)
        .filter((url): url is string => Boolean(url));
      const mediaAttachments = sophieMedia.map((asset) => ({
        media_asset_id: asset.id,
        filename: asset.original_filename,
        title: asset.title,
        url: asset.cdn_url || asset.url,
        consent_status: "pending",
      }));
      const { data: updatedStory, error: updateStoryError } = await supabase
        .from("stories")
        .update({
          title,
          content: buildStoryContent(transcript, sophieMedia),
          excerpt: "Sophie, Green Harvest memory, seedlings, and why the garden is really about social connection.",
          summary: "A private working draft using Sophie's transcript and garden photos as the source for social, newsletter, and a future reel.",
          media_url: mediaUrls[0] ?? null,
          media_urls: mediaUrls,
          story_image_url: mediaUrls[0] ?? null,
          media_attachments: mediaAttachments,
          tags: ["the-harvest", "garden", "sophie", "green-harvest", "seedlings", "social-connection", "witta"],
          cultural_themes: ["place-care", "community-making", "food-growing"],
          source_links: {
            source: "harvest-sophie-story-spine",
            generated_from: "scripts/el-sophie-story-spine.ts",
            transcript_id: transcript.id,
            media_asset_ids: sophieMedia.map((asset) => asset.id),
          },
        })
        .eq("id", existingStory.id)
        .select("id, title, status")
        .single();
      if (updateStoryError) throw updateStoryError;
      console.log(`Updated EL draft story: ${updatedStory.title} (${updatedStory.id}) status=${updatedStory.status}`);
    } else {
      const mediaUrls = sophieMedia
        .map((asset) => asset.cdn_url || asset.url)
        .filter((url): url is string => Boolean(url));
      const mediaAttachments = sophieMedia.map((asset) => ({
        media_asset_id: asset.id,
        filename: asset.original_filename,
        title: asset.title,
        url: asset.cdn_url || asset.url,
        consent_status: "pending",
      }));

      const { data: insertedStory, error: insertStoryError } = await supabase
        .from("stories")
        .insert({
          title,
          content: buildStoryContent(transcript, sophieMedia),
          excerpt: "Sophie, Green Harvest memory, seedlings, and why the garden is really about social connection.",
          summary: "A private working draft using Sophie's transcript and garden photos as the source for social, newsletter, and a future reel.",
          status: "draft",
          is_public: false,
          privacy_level: "private",
          story_type: "project_update",
          story_category: "the-harvest",
          storyteller_id: storyteller.id,
          author_id: storyteller.profile_id,
          organization_id: transcript.organization_id || storyteller.organization_id,
          tenant_id: transcript.tenant_id,
          project_id: transcript.project_id,
          transcript_id: transcript.id,
          media_url: mediaUrls[0] ?? null,
          media_urls: mediaUrls,
          story_image_url: mediaUrls[0] ?? null,
          media_attachments: mediaAttachments,
          tags: ["the-harvest", "garden", "sophie", "green-harvest", "seedlings", "social-connection", "witta"],
          cultural_themes: ["place-care", "community-making", "food-growing"],
          has_explicit_consent: false,
          consent_details: {
            status: "pending_review",
            note: "Draft only. Confirm Sophie is comfortable being named and shown before publishing.",
          },
          enable_ai_processing: true,
          social_sharing_enabled: false,
          syndication_enabled: false,
          source_links: {
            source: "harvest-sophie-story-spine",
            generated_from: "scripts/el-sophie-story-spine.ts",
            transcript_id: transcript.id,
            media_asset_ids: sophieMedia.map((asset) => asset.id),
          },
        })
        .select("id, title, status")
        .single();
      if (insertStoryError) throw insertStoryError;
      console.log(`Created EL draft story: ${insertedStory.title} (${insertedStory.id}) status=${insertedStory.status}`);
    }
  }

  if (publishArticle) {
    const transcript = firstUsefulTranscript(transcripts ?? []);
    if (!transcript) {
      throw new Error("Cannot publish EL article: no usable Sophie transcript found.");
    }

    const { data: sourceStory, error: sourceStoryError } = await supabase
      .from("stories")
      .select("id, title")
      .eq("storyteller_id", storyteller.id)
      .eq("transcript_id", transcript.id)
      .in("title", [SOPHIE_STORY_TITLE, LEGACY_SOPHIE_STORY_TITLE])
      .maybeSingle();
    if (sourceStoryError) throw sourceStoryError;

    const socialMedia = SOCIAL_IMAGE_FILENAMES
      .map((filename) => sophieMedia.find((asset) => asset.original_filename === filename))
      .filter((asset): asset is MediaAsset => Boolean(asset));
    const orderedMedia = [
      ...socialMedia,
      ...sophieMedia.filter((asset) => !SOCIAL_IMAGE_FILENAMES.includes(asset.original_filename)),
    ];
    const mediaUrls = orderedMedia
      .map((asset) => asset.cdn_url || asset.url)
      .filter((url): url is string => Boolean(url));
    const featuredImage = orderedMedia[0] ?? null;
    const publishedAt = new Date().toISOString();
    const articleRow = {
      title: SOPHIE_STORY_TITLE,
      slug: SOPHIE_ARTICLE_SLUG,
      subtitle: "Sophie, Green Harvest memory, and why the garden is really about social connection.",
      excerpt: "Sophie knew this place before it was The Harvest. Her story carries Green Harvest memory, seedlings, and the social life of growing food.",
      content: articleContent(),
      author_name: "The Harvest Witta",
      author_bio: "Community hub in Witta, Sunshine Coast Hinterland.",
      author_type: "organization",
      article_type: "project_update",
      primary_project: "the-garden",
      related_projects: ["milk-crate-pavilion"],
      tags: ["the-harvest", "garden", "sophie", "green-harvest", "seedlings", "social-connection", "witta"],
      themes: ["Land", "Community", "Growth"],
      status: "published",
      visibility: "public",
      syndication_enabled: true,
      syndication_destinations: ["harvest"],
      featured_image_id: featuredImage?.id ?? null,
      meta_title: "From seeds to social connection | The Harvest Witta",
      meta_description: "Sophie knew this place before it was The Harvest. Her story carries Green Harvest memory, seedlings, and the social life of growing food.",
      organization_id: storyteller.organization_id || transcript.organization_id,
      transcript_id: transcript.id,
      story_id: sourceStory?.id ?? null,
      source_id: sourceStory?.id ?? transcript.id,
      source_platform: "empathy_ledger",
      source_url: `https://www.empathyledger.com/admin/storytellers/${storyteller.id}/edit`,
      linked_storytellers: [storyteller.id],
      published_at: publishedAt,
      import_metadata: {
        source: "harvest-sophie-story-spine",
        generated_from: "scripts/el-sophie-story-spine.ts",
        source_story_id: sourceStory?.id ?? null,
        transcript_id: transcript.id,
        featuredImageUrl: featuredImage?.cdn_url || featuredImage?.url || null,
        photo_urls: mediaUrls,
        media: {
          photos: orderedMedia.map((asset) => ({
            id: asset.id,
            filename: asset.original_filename,
            title: asset.title,
            url: asset.cdn_url || asset.url,
            alt_text: asset.alt_text,
            consent_status: "pending",
          })),
          videos: [
            transcript.video_url || transcript.source_video_url || transcript.audio_url,
          ].filter(Boolean),
        },
        review: {
          consent_status: "pending_review",
          note: "Ben is testing the story-to-website flow. Reconfirm Sophie consent before heavier syndication.",
        },
      },
    };

    const { data: existingArticle, error: existingArticleError } = await supabase
      .from("articles")
      .select("id, title, slug, status, published_at")
      .eq("slug", SOPHIE_ARTICLE_SLUG)
      .maybeSingle();
    if (existingArticleError) throw existingArticleError;

    if (existingArticle) {
      const { data: updatedArticle, error: updateArticleError } = await supabase
        .from("articles")
        .update({
          ...articleRow,
          published_at: existingArticle.published_at || publishedAt,
        })
        .eq("id", existingArticle.id)
        .select("id, title, slug, status")
        .single();
      if (updateArticleError) throw updateArticleError;
      console.log(`Updated EL article: ${updatedArticle.title} (${updatedArticle.id}) slug=${updatedArticle.slug} status=${updatedArticle.status}`);
    } else {
      const { data: insertedArticle, error: insertArticleError } = await supabase
        .from("articles")
        .insert(articleRow)
        .select("id, title, slug, status")
        .single();
      if (insertArticleError) throw insertArticleError;
      console.log(`Created EL article: ${insertedArticle.title} (${insertedArticle.id}) slug=${insertedArticle.slug} status=${insertedArticle.status}`);
    }
  }

  if (verifyArticle) {
    const harvestUrl = `https://theharvestwitta.com.au/blog/${SOPHIE_ARTICLE_SLUG}`;
    const elApiBase = (process.env.EMPATHY_LEDGER_API_URL || "https://www.empathyledger.com").replace(/\/$/, "");
    const headers: Record<string, string> = {};
    if (process.env.EMPATHY_LEDGER_API_KEY) {
      headers["X-API-Key"] = process.env.EMPATHY_LEDGER_API_KEY;
    }

    const response = await fetch(`${elApiBase}/api/v1/content-hub/articles/${SOPHIE_ARTICLE_SLUG}`, { headers });
    const json = await response.json().catch(() => null) as Record<string, unknown> | null;
    console.log(`EL article API: status=${response.status} slug=${json?.slug || "none"} title=${json?.title || "none"}`);
    console.log(`Harvest article URL: ${harvestUrl}`);
    console.log("Social draft caption:");
    console.log(socialCaption(harvestUrl));
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
