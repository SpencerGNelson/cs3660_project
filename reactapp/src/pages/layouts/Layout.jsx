import Nav from "./Nav"
import Footer from "./Footer"

function Layout({ children }) {
    return (
        <div id="layoutdiv">
            <Nav />
            <main>
                { children }
            </main>
            <Footer />
        </div>
        
    )
}

export default Layout