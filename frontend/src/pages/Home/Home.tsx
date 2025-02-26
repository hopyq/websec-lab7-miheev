import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import useStore from "../../entities/app/app.store"

const Home: React.FC = () => {
    const user = useStore((state) => state.user)
    const fetchUsers = useStore((state) => state.fetchUsers)
    const users = useStore((state) => state.users)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) navigate("/login")
        else fetchUsers()
    }, [user, fetchUsers, navigate])

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Welcome, {user?.username}!</h1>
            <nav className="mt-4 flex gap-4">
                <Link to="/messages" className="text-blue-500 underline">
                    Go to Messages
                </Link>
            </nav>
            <h2 className="mt-4 text-lg">
                Users List (SQL Injection vulnerable)
            </h2>
            <ul className="mt-2 border p-2 rounded">
                {users.map((u) => (
                    <li key={u.id} className="p-1 border-b last:border-none">
                        {u.username}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Home
