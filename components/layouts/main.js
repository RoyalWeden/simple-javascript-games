import Head from 'next/head'
import { Box, Container } from '@chakra-ui/react'

const Main = ({ children, router }) => {
    return (
        <Box as="main" pb={10}>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Container maxW="container.lg" pt={10}>
                {children}
            </Container>
        </Box>
    )
}

export default Main