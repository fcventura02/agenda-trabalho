import { addHours, differenceInHours, format } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import app from "../../config/firebase/server";

const db = app.firestore();
const agenda = db.collection("agenda");
const startAt = new Date(2021, 1, 1, 8, 0);
const endtAt = new Date(2021, 1, 1, 17, 0);
const totalHours = differenceInHours(endtAt, startAt);

const timeBlocksList: string[] = [];

for (let i = 0; i <= totalHours; i++) {
  const hours = format(addHours(startAt, i), "HH:mm");
  timeBlocksList.push(hours);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const when = req.query.date;
  if (token === "undefined")
    return res.status(401).json({ error: "invalid token" });
  try {
    const { user_id } = await app.auth().verifyIdToken(token);
    const { docs } = await agenda
      .where("userId", "==", user_id)
      .where("date", "==", when)
      .get();

    const timeBlockeds = docs?.map((doc: any) => doc.data());
    const result = timeBlocksList.map((time) => {
      const client = timeBlockeds.find((doc: any) => {
        const { time: hours } = doc;
        return hours === time;
      });
      return {
        time,
        client: client ? { name: client.name, phone: client.phone } : {},
      };
    });
    res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};
