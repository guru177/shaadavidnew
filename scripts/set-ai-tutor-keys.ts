/**
 * One-shot: save AI tutor keys into site settings (Admin → Settings → AI Tutor).
 * Usage (PowerShell):
 *   $env:SET_GROQ_API_KEY="gsk_…"; $env:SET_GEMINI_API_KEY="…"; npx.cmd tsx scripts/set-ai-tutor-keys.ts
 */
import { getSettings, saveSettings } from "../src/lib/settings";

async function main() {
  const groq = process.env.SET_GROQ_API_KEY?.trim() || "";
  const gemini = process.env.SET_GEMINI_API_KEY?.trim() || "";
  if (!groq && !gemini) {
    console.error("Set SET_GROQ_API_KEY and/or SET_GEMINI_API_KEY");
    process.exit(1);
  }

  const settings = await getSettings();
  settings.aiTutor = {
    groqApiKey: groq || settings.aiTutor?.groqApiKey || "",
    geminiApiKey: gemini || settings.aiTutor?.geminiApiKey || "",
  };
  await saveSettings(settings);
  console.log("Saved AI tutor keys to settings.", {
    groq: Boolean(settings.aiTutor.groqApiKey),
    gemini: Boolean(settings.aiTutor.geminiApiKey),
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
