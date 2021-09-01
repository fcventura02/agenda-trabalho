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

console.log(timeBlocks);

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const when = req.query.when;
  const username = req.query.username;
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
