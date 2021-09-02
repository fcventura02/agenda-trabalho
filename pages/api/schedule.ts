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
  const time = req.body.time;
  const date = req.body.date;
  const username = req.body.username;
  const userId = await getUserId(username);
  const doc = await agenda.doc(`${userId}#${date}#${time}`).get();
  if (doc.exists) {
    return res.status(400).json({error: 'Horário já cadastrado'});
  }
  await agenda.doc(`${userId}#${date}#${time}`).set({
    userId,
    time,
    date,
    name: req.body.name,
    phone: req.body.phone,
  });
  return res.status(201).json({Succes: 'Horário cadastrado com sucesso'});
};
const getSchedule = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    /* const profileDoc = await profile
      .where("username", "==", "Venturadev")
      .get();
    console.log(profileDoc.userId); */
    /*  const snapshot = await agenda
      .where("userId", "==", profileDoc)
      .where("time", "==", time)
      .get(); */
    return res.status(200).json(timeBlocks);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const method = req.method;
    if (method === "POST") {
      return await setSchedule(req, res);
    }
    if (method === "GET") {
      return await getSchedule(req, res);
    }
    return res.status(405);
  } catch (error) {
    return res.status(405);
  }
};
