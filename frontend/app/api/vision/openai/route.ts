"use server";

import OpenAI from "openai";
// console.log("API Key:", process.env.OPENAI_API_KEY);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getChatGPTResponse(text: string): Promise<string> {
  const prompt = `以下の文章に記載されているイベントの日時と開催場所を教えてください。ただし、返答の形式は条件にしたがって下さい。\n
  #条件: \n
  タイトルをつけること。\n
  日時は範囲が分かるように書くこと。\n
  日時の形式は、「'YYYY-MM-DD'」とする。\n
  場所を出力するときは、「'場所: 」'に続いて書くこと。\n
  その他、重要なキーワードを含めること。\n
  #入力文章 \n
  ${text}\n 
  #`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 100,
    });

    return (
      completion.choices?.[0]?.message?.content ||
      "イベント情報が見つかりませんでした。"
    );
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "エラーが発生しました。";
  }
}
