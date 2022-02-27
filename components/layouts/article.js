import { motion } from 'framer-motion'
import Head from 'next/head'
import { Spacer } from '@chakra-ui/layout'

const variants = {
    hidden: {opacity: 0, x: 0, y: 0},
    enter: {opacity: 1, x: 0, y: 0},
    exit: {opacity: 0, x: 0, y: 20}
}

const Layout = ({ children, title }) => (
    <motion.article
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{duration: 0.4, type:'eastInOut'}}
        style={{position: 'relative'}}
    >
        <>
            {title && (
                <Head>
                    <title>{title}</title>
                </Head>
            )}
            <Spacer mt='1rem' />
            {children}
        </>
    </motion.article>
)

export default Layout