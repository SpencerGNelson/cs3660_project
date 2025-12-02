import Nav from "./Nav"
import Footer from "./Footer"

function Layout({ children }) {
    return (
        <>
            <Nav />
            <main>
                { children }
            </main>
            <Footer />
        </>
    )
}

export default Layout