import { addHours, differenceInHours, format } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import app from "../../config/firebase/server";

const db = app.firestore();
const profile = db.collection("profiles");
const agenda = db.collection("agenda");
const startAt = new Date(2021, 1, 1, 8, 0);
const endtAt = new Date(2021, 1, 1, 17, 0);
const totalHours = differenceInHours(endtAt, startAt);

const timeBlocksList: string[] = [];

for (let i = 0; i <= totalHours; i++) {
  const hours = format(addHours(startAt, i), "HH:mm");
  timeBlocksList.push(hours);
}

const getUserId = async (
  username: string | string[]
): Promise<string | boolean> => {
  const blocks = await profile.where("username", "==", username).get();
  if (!blocks.docs.length) {
    return false;
  }
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
    return res.status(400).json({ error: "Horário já cadastrado" });
  }
  const nowDate = new Date();
  const requestDate = new Date(`${date} ${time}`);
  if (requestDate < nowDate) {
    return res.status(400).json({ error: "Horário indisponível" });
  }
  await agenda.doc(`${userId}#${date}#${time}`).set({
    userId,
    time,
    date,
    name: req.body.name,
    phone: req.body.phone,
  });
  return res.status(201).json({ Succes: "Horário cadastrado com sucesso" });
};
const getSchedule = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const username = req.query.username;
    const userId = await getUserId(username);
    if (!userId) {
      return res.status(404).json({ error: "User not found" });
    }
    const date = req.query.date;
    const { docs } = await agenda
      .where("userId", "==", userId)
      .where("date", "==", date)
      .get();
    const timeBlockeds = docs?.map((doc: any) => doc.data());
    const result = timeBlocksList.map((time) => ({
      time,
      isBlocked: verifyHours(date, time, timeBlockeds),
    }));
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

const verifyHours = (date: any, time: any, timeBlockeds: any[]) => {
  const nowDate = new Date();
  const requestDate = new Date(`${date} ${time}`);
  if (requestDate < nowDate) {
    return true;
  }
  if (!!timeBlockeds.find((doc: any) => doc.time === time)) return true;
  return false;
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
    return res.status(405).json({ message: "Method not found" });
  } catch (error) {
    return res.status(405).json({ error: error.message });
  }
};
