import { extendTheme } from '@chakra-ui/react'

const styles = {
    global: props => ({
        body: {
            fontFamily: 'Fredoka:wght@300',
            fontSize: 20,
            bg: '#FFFFFF'
        }
    })
}

const components = {
    Heading : {
        baseStyle: props => ({
            fontFamily: 'Fredoka'
        }),
        variants: {
            'section-title': {
                fontSize: 40,
                textDecoration: 'underline',
                textUnderlineOffset: 6,
                textDecorationColor: '#525252',
                textDecorationThickness: 4,
                marginTop: 3,
                marginBottom: 4
            }
        }
    },
    Link: {
        baseStyle: props => ({
            color: '#434343',
            lineHeight: 0.3,
            textUnderlineOffset: 3
        })
    },
    Button: {
        baseStyle: props => ({
            marginTop: 3,
            marginBottom: 4
        })
    },
    Text: {
        baseStyle: props => ({
            color: '#434343',
            lineHeight: 0.3
        })
    }
}

const fonts = {
    heading: "'Fredoka'",
}

const colors = {

}

const theme = extendTheme({
    styles,
    components,
    fonts,
    colors
})

export default theme