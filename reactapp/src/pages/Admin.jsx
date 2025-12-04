import { usePageTitle } from '../hooks/usePageTitle'
import { LinkComponent } from '../widgets'

function Admin() {
    usePageTitle('Admin')

    return (
        <>
            <h2>Admin</h2>
            <p><LinkComponent to="/admin/add_professional">Add Service Provider</LinkComponent></p>
            <p><LinkComponent to="/admin/add_category">Add Service Category</LinkComponent></p>
            <p><LinkComponent to="/admin/add_service">Add Service</LinkComponent></p>
            <hr />
            <p><LinkComponent to="/">Back to Main Site</LinkComponent></p>
        </>
    )
}

export default Admin
