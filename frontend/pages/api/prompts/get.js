// pages/api/prompts/get.js
import clientPromise from "../../../src/utils/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const client = await clientPromise;
    const db = client.db("mkdata");
    const prompts = db.collection("prompts");

    const userPrompts = await prompts
      .find({ username: payload.username })
      .sort({ created_at: -1 }) // newest first
      .toArray();

    res.status(200).json({ prompts: userPrompts });
  } catch (err) {
    console.error("Prompt fetch error:", err);
    res.status(500).json({ error: "Failed to retrieve prompts" });
  }
}
