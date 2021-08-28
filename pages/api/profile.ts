// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import app from "../../config/firebase/server"

const db  = app.firestore()
const profile = db.collection('profiles')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const  token = req.headers.authorization?.split(" ")[1]
  const {user_id} = await app.auth().verifyIdToken(token)

  profile.doc(req.body.username).set({
    userId: user_id,
    username: req.body.username
  })

  res.status(200).json({ name: 'John Doe' })
}
