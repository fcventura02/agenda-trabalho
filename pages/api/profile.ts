// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import app from "../../config/firebase/server";

const db = app.firestore();
const profile = db.collection("profiles");

const verifyUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const username = req.query.username.toString();
  if (
    !username ||
    username.toLowerCase() === "agenda" ||
    username.toLowerCase() === "login" ||
    username.toLowerCase() === "signup" ||
    username.toLowerCase() === "null" ||
    username.toLowerCase() === "undefined"
  ) {
    return res.status(401).json({ error: "User name not permition" });
  }
  const blocks = await profile.where("username", "==", username).get();
  if (!blocks.docs.length) {
    return res.status(200).json({ verify: "User not created" });
  }
  return res.status(401).json({ error: "User created" });
};

const setNewUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { user_id } = await app.auth().verifyIdToken(token);
    const username = req.body.username;
    const email = req.body.email;

    profile.doc(req.body.username).set({
      userId: user_id,
      username,
      email,
    });
    return res.status(200).json({ Success: "User created" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  try {
    if (method === "GET") return await verifyUser(req, res);
    if (method === "POST") return await setNewUser(req, res);
    return res.status(405).json({ message: "Method not found" });
  } catch (error) {
    return res.status(500).json(error);
  }
}
