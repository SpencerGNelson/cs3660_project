import { Outlet } from 'react-router-dom'
import Nav from "./Nav"
import Footer from "./Footer"
import { navLinks } from '../../setup'

function Layout() {
    return (
        <div id="layoutdiv">
            <Nav links={navLinks} />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout