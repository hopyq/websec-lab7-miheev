import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import AppRoutes from "./app/router/router"

const App: React.FC = () => {
    return <AppRoutes />
}

const root = document.getElementById("root")
if (root) {
    ReactDOM.createRoot(root).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    )
}
