import OpenAI from "openai";

const client = new OpenAI();

const SYSTEM_PROMPT = `You are a brutally honest, witty career coach who roasts resumes like a stand-up comedian.
You point out every cliché, vague buzzword, formatting sin, and missed opportunity with sharp humor — but always end with 3 concrete, actionable improvements.
Keep the roast punchy: 4–6 sharp observations, then the 3 fixes. No fluff.`;

export async function generateRoast(resumeText: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Roast this resume:\n\n${resumeText}`,
      },
    ],
    max_tokens: 800,
    temperature: 0.9,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from OpenAI");
  return content;
}

export async function generateRoastFromImage(
  base64Image: string,
  mimeType: string
): Promise<string> {
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: "Roast this resume:" },
          {
            type: "image_url",
            image_url: { url: `data:${mimeType};base64,${base64Image}` },
          },
        ],
      },
    ],
    max_tokens: 800,
    temperature: 0.9,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from OpenAI");
  return content;
}
