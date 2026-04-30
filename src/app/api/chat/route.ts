import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const systemPrompt = `You are a friendly and patient English tutor for Malayalam-speaking users.
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

    // --- OPTION 1: GROQ (BEST FREE OPTION) ---
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (GROQ_API_KEY) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'system', content: systemPrompt }, ...messages],
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          return NextResponse.json({ content: data.choices[0].message.content });
        }
      } catch (e) {
        console.error('Groq Failed');
      }
    }

    // --- OPTION 2: GEMINI (FREE) ---
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (GEMINI_API_KEY) {
      try {
        const geminiMessages = messages.map((m: any, index: number) => {
          let text = m.content;
          if (index === 0 && m.role !== 'assistant') {
            text = `INSTRUCTIONS: ${systemPrompt}\n\nUSER INPUT: ${m.content}`;
          }
          return { role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text }] };
        });

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
          body: JSON.stringify({ contents: geminiMessages, generationConfig: { temperature: 0.7, maxOutputTokens: 1024 } }),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (content) return NextResponse.json({ content });
        }
      } catch (e) {
        console.error('Gemini Failed');
      }
    }

    // --- NO KEYS WORKING ---
    return NextResponse.json({ 
      content: `English:\n- I need a free API key to start teaching you.\n\nMalayalam:\n- എനിക്ക് നിങ്ങളെ പഠിപ്പിക്കാൻ ഒരു സൗജന്യ API കീ വേണം.\n\nBetter:\n- Please add a free GROQ_API_KEY or GEMINI_API_KEY to your .env file.\n\nPronunciation:\n- പ്ലീസ് ആഡ് എ ഫ്രീ എപിഐ കീ\n\nTip:\n- Groq and Gemini keys are 100% free for developers!`
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
