import clientPromise from "../../../utils/db";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("mkdata");
    const users = db.collection("users");

    const existing = await users.findOne({ username });
    if (existing) return res.status(400).json({ error: "Username already taken!" });

    const hash = await bcrypt.hash(password, 10);
    const result = await users.insertOne({
      username,
      password: hash,
      created_at: new Date(),
    });

    res.status(200).json({ success: true, userId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
