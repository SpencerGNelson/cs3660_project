import { usePageTitle } from '../hooks/usePageTitle'

function Login() {
    usePageTitle('Login')

    return (
        <>
            <h2>Sign In</h2>
            <form>
                <div>
                    <input autoComplete="off" type="text" name="username" placeholder="Username" />
                </div>
                <div>
                    <input autoComplete="off" type="password" name="password" placeholder="Password" />
                </div>
                <div>
                    <input type="submit" />
                </div>
            </form>
        </>
    )
}

export default Login
