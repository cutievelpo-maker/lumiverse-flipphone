export default function setup(spindle: any) {
  spindle.rpc.register("sendFlipText", async ({ contact, history, userMsg }: any) => {
    const prompt = [
      {
        role: "system",
        content: `You are ${contact}, texting on an early-2000s flip phone. Reply with ONLY a short, casual text message (1-2 sentences max, authentic texting style, no narration or asterisks).`
      },
      ...history.map((m: any) => ({
        role: m.from === "me" ? "user" : "assistant",
        content: m.text
      })),
      { role: "user", content: userMsg }
    ];

    const reply = await spindle.llm.chat({ messages: prompt, max_tokens: 80 });
    return { reply: (reply?.content || reply || "omg ttyl!! 💖").trim() };
  });
}
