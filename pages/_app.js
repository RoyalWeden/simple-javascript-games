import { ChakraProvider } from '@chakra-ui/react'
import Layout from '../components/layouts/main'
import Head from 'next/head'
import theme from '../libs/theme'

function MyApp({ Component, pageProps, router }) {
  return (
    <>
      <Head></Head>
      <ChakraProvider theme={theme}>
        <Layout router={router}>
          <Component {...pageProps} key={router.route} />
        </Layout>
      </ChakraProvider>
    </>
  )
}

export default MyApp