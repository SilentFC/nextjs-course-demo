//our-domain.com
import Head from 'next/head'
import MeetupList from '../components/meetups/MeetupList'
import { MongoClient } from 'mongodb'

function HomePage(props) {
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name='description'
          content='Browse a huge list of highly active React meetups!'
        ></meta>
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  )
}

//runs during build process
export async function getStaticProps() {
  // fetch data from an API/DB
  const client = await MongoClient.connect(
    'mongodb+srv://silent:Patrick1@cluster0.obsdg.mongodb.net/meetups?retryWrites=true&w=majority'
  )

  const db = client.db()

  const meetupsCollection = db.collection('meetups')
  const meetups = await meetupsCollection.find().toArray()

  console.log(meetups)

  client.close()
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1, // how long the server waits before making another request for data, as long as there are requests for the page
  }
}

//doesn't run on build but instead on deployment and runs on the server for every incoming request
// export async function getServerSideProps(context) {
//   const req = context.req
//   const res = context.res

//   // fetch data from an API/DB
//   return {
//     props: { meetups: DUMMY_MEETUPS },
//   }
// }

export default HomePage
