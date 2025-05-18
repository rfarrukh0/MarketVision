import clientPromise from "../../../src/utils/db";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    console.log("Connecting to Mongo...");
    const client = await clientPromise;

    console.log("Connected. Getting DB...");
    const db = client.db("mkdata");

    console.log("Getting collection...");
    const users = db.collection("users");

    console.log("Checking if username exists...");
    const existing = await users.findOne({ username });

    if (existing) {
      console.log("Username taken.");
      return res.status(400).json({ error: "Username already taken!" });
    }

    console.log("Hashing password...");
    const hash = await bcrypt.hash(password, 10);

    console.log("Inserting user...");
    const result = await users.insertOne({
      username,
      password: hash,
      created_at: new Date(),
    });

    console.log("User registered successfully.");
    res.status(200).json({ success: true, userId: result.insertedId });
  } catch (err) {
    console.error("🔥 REGISTER ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
