import { NextResponse } from "next/server";
import { getGroqApiKey, getGeminiApiKey } from "@/lib/settings";

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
- The AI tutor is not configured yet.
Malayalam:
- AI ട്യൂട്ടർ ഇതുവരെ ക്രമീകരിച്ചിട്ടില്ല.
Better:
- Please add a Groq or Gemini API key in Admin → Settings → AI Tutor.
Tip:
- Admin → Settings → AI Tutor എന്നതിൽ ഒരു API കീ ചേർക്കുക.`;

const PROVIDER_FAIL_MESSAGE = `English:
- The AI service did not respond. Please try again in a moment.
Malayalam:
- AI സേവനം മറുപടി നൽകിയില്ല. ദയവായി അൽപസമയം കഴിഞ്ഞ് ശ്രമിക്കുക.
Better:
- Check that your API key is valid in Admin → Settings → AI Tutor.
Tip:
- Admin → Settings → AI Tutor-ൽ API കീ ശരിയാണോ എന്ന് പരിശോധിക്കുക.`;

type ChatMessage = { role: string; content: string };

/** Current Groq free/dev catalog (llama-3.3 / 3.1 IDs were shut down Aug 2026). */
const GROQ_MODELS = [
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
];

const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
];

async function tryGroq(messages: ChatMessage[], apiKey: string): Promise<string | null> {
  for (const model of GROQ_MODELS) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
          temperature: 0.7,
        }),
      });
      if (!groqRes.ok) {
        const errText = await groqRes.text().catch(() => "");
        console.error("Groq error", model, groqRes.status, errText.slice(0, 300));
        continue;
      }
      const data = await groqRes.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content;
    } catch (e) {
      console.error("Groq failed", model, e);
    }
  }
  return null;
}

async function tryGemini(messages: ChatMessage[], apiKey: string): Promise<string | null> {
  const contents = messages.map((m: ChatMessage, index: number) => {
    let text = m.content;
    if (index === 0 && m.role !== "assistant") {
      text = `INSTRUCTIONS: ${SYSTEM_PROMPT}\n\nUSER INPUT: ${m.content}`;
    }
    return { role: m.role === "assistant" ? "model" : "user", parts: [{ text }] };
  });

  for (const model of GEMINI_MODELS) {
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
          }),
        }
      );
      if (!geminiRes.ok) {
        const errText = await geminiRes.text().catch(() => "");
        console.error("Gemini error", model, geminiRes.status, errText.slice(0, 300));
        continue;
      }
      const data = await geminiRes.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (content) return content;
    } catch (e) {
      console.error("Gemini failed", model, e);
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? (body.messages as ChatMessage[]) : [];
    if (!messages.length) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    const GROQ_API_KEY = await getGroqApiKey();
    const GEMINI_API_KEY = await getGeminiApiKey();
    const hasKey = Boolean(GROQ_API_KEY || GEMINI_API_KEY);

    if (GROQ_API_KEY) {
      const content = await tryGroq(messages, GROQ_API_KEY);
      if (content) return NextResponse.json({ content });
    }

    if (GEMINI_API_KEY) {
      const content = await tryGemini(messages, GEMINI_API_KEY);
      if (content) return NextResponse.json({ content });
    }

    if (!hasKey) {
      console.error("Chat API: no Groq/Gemini key in Admin Settings or env");
      return NextResponse.json({ content: NO_KEY_MESSAGE });
    }

    console.error("Chat API: keys present but all providers failed");
    return NextResponse.json({ content: PROVIDER_FAIL_MESSAGE });
  } catch (error) {
    console.error("Chat API error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
