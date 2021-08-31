import type { NextApiRequest, NextApiResponse } from "next";
import app from "../../config/firebase/server";

const db = app.firestore();
const agenda = db.collection("agenda");

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const when = req.query.when;
  if (token === "undefined") return res.status(401);
  try {
    const { user_id } = await app.auth().verifyIdToken(token);
    const snapshot = await agenda
      .where("userId", "==", user_id)
      .where("when", "==", when)
      .get();
    res.status(200).json(snapshot.docs);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};
