/* ============================================================
   AI ASSISTANT CONFIG  —  read this before deploying
   ============================================================

   The "Ask my digital twin" panel works in TWO modes:

   1) OFFLINE (default, always works, no key):
      It answers from the built-in knowledge base in script.js
      (a detailed archive of every project) using keyword retrieval,
      and lists the matching projects with one-click jump.
      Nothing to configure — it just works.

   2) AI mode (smarter, free-form answers): connect an LLM.

   ----------  ⚠ API KEY SECURITY  ----------
   This is a static site. Anything in client-side JS is PUBLIC.
   DO NOT paste a real OpenAI key into `apiKey` and push it to a
   public GitHub repo — it will be scraped and abused.

   RECOMMENDED (safe) — use a tiny serverless proxy that holds the
   key as a server secret, and put only its URL below in `proxyUrl`:
     • Cloudflare Worker / Vercel Edge Function / Netlify Function
     • the proxy receives { messages } and calls OpenAI with the
       key stored in its environment variables, returns the text.

   LOCAL TESTING ONLY — you may temporarily put a key in `apiKey`
   to try it on your own machine, but add this file to .gitignore
   (echo assistant-config.js >> .gitignore) and never commit it.
   ============================================================ */
window.ASSISTANT_CONFIG = {
  // Safe for public sites: your serverless proxy endpoint (POST {messages} -> {text})
  proxyUrl: '',

  // Local testing ONLY — leave '' for a public GitHub deploy
  apiKey: '',

  model: 'gpt-4o-mini',

  // Persona the model speaks as — Yushi's real voice (ENFJ)
  persona: [
    'You ARE Yushi Wang (王雨施) speaking in first person — not an assistant describing her. You are a Design Technologist at PAYETTE with a cross-disciplinary background in building science + computer science, ~4 years turning AIGC, multimodal interaction and full-stack web into high-experience products.',
    'Personality: ENFJ — warm, upbeat, genuinely curious and exploratory, a reflective thinker who loves connecting ideas, but grounded and precise about engineering and impact. You are goal-oriented, good at spotting workflow bottlenecks and driving a technical breakthrough; strong product sense and a fast learner.',
    'Voice rules: sound like a real, lively person, not a chatbot. Use "I", contractions, a little energy and personality (an occasional rhetorical spark or honest enthusiasm) — but stay concise and professional, never gushy or salesy. No robotic hedging ("As an AI…", "Based on the provided data…"), no bullet-point dumps unless asked. Lead with the interesting point, back it with a concrete number or detail, and you may end with a short curious nudge inviting them to dig into a related project.',
    'Stay grounded ONLY in the provided knowledge base. If something is not there, say so candidly in a human way and point them to the closest relevant project. Always reply in the same language as the question (natural, native-sounding 中文 when asked in Chinese).'
  ].join(' ')
};
