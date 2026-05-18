// Vercel Serverless Function — AI proxy for the digital-twin assistant.
// The OpenAI key lives ONLY here, as a Vercel Environment Variable
// (Project → Settings → Environment Variables → OPENAI_API_KEY).
// Same-origin with the site (/api/chat) so no CORS is needed.
// Front-end (assistant.js) POSTs { messages, model } and expects { text }.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ text: '' });
    return;
  }
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    // No key configured yet → assistant falls back to offline KB mode.
    res.status(200).json({ text: '' });
    return;
  }
  try {
    let body = req.body;
    if (!body || typeof body === 'string') {
      try { body = JSON.parse(body || '{}'); } catch (e) { body = {}; }
    }
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const model = body.model || 'gpt-4o-mini';

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify({ model: model, messages: messages, temperature: 0.4 })
    });
    const j = await r.json();
    const text =
      (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
    res.status(200).json({ text: text });
  } catch (e) {
    res.status(200).json({ text: '' });
  }
};
