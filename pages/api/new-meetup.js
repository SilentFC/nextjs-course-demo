// /api/new-meetup
// POST /api/new-meetup

import { MongoClient } from 'mongodb'

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body

    try {
      const client = await MongoClient.connect(
        'mongodb+srv://silent:Patrick1@cluster0.obsdg.mongodb.net/meetups?retryWrites=true&w=majority'
      )

      const db = client.db()

      const meetupsCollection = db.collection('meetups')
      const result = await meetupsCollection.insertOne(data)

      console.log(result)

      client.close()
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: err.message })
    }

    res.status(201).json({ message: 'Meetup inserted!' })
  }
}

export default handler
