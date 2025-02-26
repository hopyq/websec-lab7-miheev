import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useStore from "../../entities/app/app.store"

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const login = useStore((state) => state.login)
    const register = useStore((state) => state.register)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await login(username, password)
            navigate("/home")
        } catch (err) {
            console.error(err)
        }
    }

    const handleRegister = async () => {
        try {
            await register(username, password)
            alert("User registered! Now login.")
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2 p-4 border rounded-lg w-80"
            >
                <h2 className="text-xl font-bold">Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Login
                </button>
                <button
                    type="button"
                    onClick={handleRegister}
                    className="bg-green-500 text-white p-2 rounded mt-2"
                >
                    Register
                </button>
            </form>
        </div>
    )
}

export default LoginForm
