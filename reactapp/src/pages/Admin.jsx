import { usePageTitle } from '../hooks/usePageTitle'

function Admin() {
    usePageTitle('Admin')

    return (
        <>
            <h2>Admin Page</h2>
            <p><a href="add_professional">Add Service Provider</a></p>
            <p><a href="add_category">Add Service Category</a></p>
            <p><a href="add_service">Add Service</a></p>
        </>
    )
}

export default Admin
