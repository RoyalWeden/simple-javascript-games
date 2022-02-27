import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Games</title>
      </Head>
      <h1>
        <Link href="/snake">
          <a>Snake Game (click me)</a>
        </Link>
      </h1>
    </div>
  )
}
