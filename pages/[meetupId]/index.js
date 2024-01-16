import MeetupDetail from '../../components/meetups/MeetupDetail'
import Head from 'next/head'
import { MongoClient, ObjectId } from 'mongodb'

function MeetupDetails(props) {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name='description' content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  )
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    'mongodb+srv://silent:Patrick1@cluster0.obsdg.mongodb.net/meetups?retryWrites=true&w=majority'
  )

  const db = client.db()
  const meetupsCollection = db.collection('meetups')

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray()

  client.close()
  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  }
}

export async function getStaticProps(context) {
  //fetch dat for a single meetup

  const meetupId = context.params.meetupId
  const client = await MongoClient.connect(
    'mongodb+srv://silent:Patrick1@cluster0.obsdg.mongodb.net/meetups?retryWrites=true&w=majority'
  )

  const db = client.db()
  const meetupsCollection = db.collection('meetups')

  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  })

  client.close()

  //console.log(meetupId)

  return {
    props: {
      meetupData: {
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
        id: selectedMeetup._id.toString(),
      },
    },
  }
}

export default MeetupDetails
