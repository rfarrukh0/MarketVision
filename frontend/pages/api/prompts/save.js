// src/pages/api/prompts/save.js
import clientPromise from "../../../src/utils/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }

  const { prompt_result } = req.body;
  if (!prompt_result) {
    return res.status(400).json({ error: "Missing prompt result" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("mkdata");
    const prompts = db.collection("prompts");

    await prompts.insertOne({
      username: payload.username,
      prompt_result,
      created_at: new Date(),
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}
