import { addHours, differenceInHours, format } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import app from "../../config/firebase/server";

const db = app.firestore();
const profile = db.collection("profiles");
const agenda = db.collection("agenda");
const startAt = new Date(2021, 1, 1, 8, 0);
const endtAt = new Date(2021, 1, 1, 17, 0);
const totalHours = differenceInHours(endtAt, startAt);

const timeBlocks: string[] = [];

for (let i = 0; i <= totalHours; i++) {
  const hours = format(addHours(startAt, i), "HH:mm");
  timeBlocks.push(hours);
}

const getUserId = async (username: string | string[]): Promise<string> => {
  const blocks = await profile.where("username", "==", username).get();
  const { userId } = blocks.docs[0]?.data();
  return userId;
};

const setSchedule = async (req: NextApiRequest, res: NextApiResponse) => {
  const when = req.query.when;
  const username = req.query.username;
  const userId = await getUserId(username);
  const doc = await agenda.doc(`${userId}#${when}`).get();
  if (doc.exists) {
    return res.status(400);
  }
  await agenda.doc(`${userId}#${when}`).set({
    userId,
    when,
    name: req.query.name,
    phone: req.query.phone,
  });
};
const getSchedule = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    /* const profileDoc = await profile
      .where("username", "==", "Venturadev")
      .get();
    console.log(profileDoc.userId); */
    /*  const snapshot = await agenda
      .where("userId", "==", profileDoc)
      .where("when", "==", when)
      .get(); */
    res.status(200).json(timeBlocks);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  if (method === "POST") {
    return await setSchedule(req, res);
  }
  if (method === "GET") {
    return await getSchedule(req, res);
  }
  return res.status(405);
};
