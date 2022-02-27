import Head from 'next/head'
import {
  Heading,
  Link,
  Container,
  Button
} from '@chakra-ui/react'
import Layout from '../components/layouts/article'

export default function Home() {
  return (
    <Layout>
      <Container maxW='container.md'>
        <Head>
          <title>SimpleGames</title>
        </Head>
        <Heading pb={10}>
          SimpleGames
        </Heading>
        <Link href="/snake">
          <Button width={100} height={50} fontSize='15px' variant='outline'>
              <a>Snake</a>
          </Button>
        </Link>
      </Container>
    </Layout>
  )
}
