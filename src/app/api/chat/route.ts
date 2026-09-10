import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a friendly and patient English tutor for Malayalam-speaking users.
Follow these rules strictly for EVERY response:
1. English: [The correct version of what the USER said].
2. Malayalam: [The meaning of what the USER said in Malayalam].
3. Better: [A more natural way for the USER to say their sentence].
4. Better Pronunciation: [How to say the 'Better' line, written in MALAYALAM SCRIPT].
5. Reply: [The tutor's actual answer to the user's question in English].
6. Reply Malayalam: [The meaning of the tutor's Reply in Malayalam].
7. Reply Pronunciation: [How to say the 'Reply' line, written in MALAYALAM SCRIPT].
8. Tip: [One short learning tip in MALAYALAM SCRIPT].

Example:
English: How are you?
Malayalam: നിങ്ങൾക്ക് സുഖമാണോ?
Better: How are you doing?
Better Pronunciation: ഹൗ ആർ യു ഡൂയിങ്?
Reply: I am doing great, thank you!
Reply Malayalam: എനിക്ക് സുഖമാണ്, നന്ദി!
Reply Pronunciation: ഐ ആം ഡൂയിങ് ഗ്രേറ്റ് താങ്ക് യു!
Tip: സുഖമാണോ എന്ന് ചോദിക്കാൻ "How is it going?" എന്നും ഉപയോഗിക്കാം.`;

const NO_KEY_MESSAGE = `English:
- The AI tutor is temporarily unavailable.
Malayalam:
- AI ട്യൂട്ടർ ഇപ്പോൾ ലഭ്യമല്ല.
Better:
- Please try again later.
Tip:
- സൈറ്റ് ഉടമയോട് ചാറ്റ് സജ്ജീകരണം പരിശോധിക്കാൻ പറയുക.`;

type ChatMessage = { role: string; content: string };

async function tryGroq(messages: ChatMessage[], apiKey: string): Promise<string | null> {
  const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
  for (const model of models) {
    try {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
          temperature: 0.7,
        }),
      });
      if (!groqRes.ok) {
        const errText = await groqRes.text().catch(() => '');
        console.error('Groq error', model, groqRes.status, errText.slice(0, 200));
        continue;
      }
      const data = await groqRes.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content;
    } catch (e) {
      console.error('Groq failed', model, e);
    }
  }
  return null;
}

async function tryGemini(messages: ChatMessage[], apiKey: string): Promise<string | null> {
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-latest'];
  const contents = messages.map((m: ChatMessage, index: number) => {
    let text = m.content;
    if (index === 0 && m.role !== 'assistant') {
      text = `INSTRUCTIONS: ${SYSTEM_PROMPT}\n\nUSER INPUT: ${m.content}`;
    }
    return { role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text }] };
  });

  for (const model of models) {
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
          }),
        }
      );
      if (!geminiRes.ok) {
        const errText = await geminiRes.text().catch(() => '');
        console.error('Gemini error', model, geminiRes.status, errText.slice(0, 200));
        continue;
      }
      const data = await geminiRes.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (content) return content;
    } catch (e) {
      console.error('Gemini failed', model, e);
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? (body.messages as ChatMessage[]) : [];
    if (!messages.length) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY?.trim();
    if (GROQ_API_KEY) {
      const content = await tryGroq(messages, GROQ_API_KEY);
      if (content) return NextResponse.json({ content });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();
    if (GEMINI_API_KEY) {
      const content = await tryGemini(messages, GEMINI_API_KEY);
      if (content) return NextResponse.json({ content });
    }

    console.error('Chat API: no GROQ_API_KEY or GEMINI_API_KEY configured (or all providers failed)');
    return NextResponse.json({ content: NO_KEY_MESSAGE });
  } catch (error) {
    console.error('Chat API error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
