import { Outlet } from 'react-router-dom'
import AdminNav from './AdminNav'
import Footer from './Footer'
import { adminLinks } from '../../setup'

function AdminLayout() {
    return (
        <div id="adminLayoutDiv">
            <AdminNav links={adminLinks} />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default AdminLayout
