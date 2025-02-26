import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom"
import useStore from "../../entities/app/app.store"
import Login from "../../pages/Login/Login"
import Home from "../../pages/Home/Home"
import Messages from "../../pages/Messages/Messages"

const AppRoutes: React.FC = () => {
    const user = useStore((state) => state.user)

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/home"
                    element={user ? <Home /> : <Navigate to="/login" />}
                />
                <Route
                    path="/messages"
                    element={user ? <Messages /> : <Navigate to="/login" />}
                />
                <Route
                    path="*"
                    element={<Navigate to={user ? "/home" : "/login"} />}
                />
            </Routes>
        </Router>
    )
}

export default AppRoutes
