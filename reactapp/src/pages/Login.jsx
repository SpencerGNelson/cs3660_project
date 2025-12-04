import { usePageTitle } from '../hooks/usePageTitle'
import { Form, TextInput, Submit } from '../widgets'

function Login() {
    usePageTitle('Login')

    return (
        <>
            <h2>Sign In</h2>
            <Form>
                <div>
                    <TextInput name="username" placeholder="Username" />
                </div>
                <div>
                    <TextInput name="password" placeholder="Password" password />
                </div>
                <div>
                    <Submit />
                </div>
            </Form>
        </>
    )
}

export default Login
