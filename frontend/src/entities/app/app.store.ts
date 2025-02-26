import { create } from "zustand"
import axios from "axios"

interface User {
    id: number
    username: string
}

interface Store {
    user: User | null
    users: User[]
    messages: { user_id: number; content: string }[]
    login: (username: string, password: string) => Promise<void>
    register: (username: string, password: string) => Promise<boolean>
    fetchUsers: (search?: string) => Promise<void>
    sendMessage: (content: string) => Promise<void>
    logout: () => void
}

const useStore = create<Store>((set) => ({
    user: null,
    users: [],
    messages: [],

    login: async (username, password) => {
        try {
            const response = await axios.post<{ user: User }>(
                "http://localhost:3001/auth/login",
                { username, password }
            )
            set({ user: response.data.user })
        } catch (error) {
            console.error("Ошибка входа:", error)
        }
    },

    register: async (username, password) => {
        try {
            const response = await axios.post(
                "http://localhost:3001/auth/register",
                {
                    username,
                    password,
                }
            )
            return response.data.success
        } catch (error) {
            console.error("Ошибка регистрации:", error)
            return false
        }
    },

    fetchUsers: async (search = "") => {
        try {
            const response = await axios.get<User[]>(
                `http://localhost:3001/users?search=${search}`
            )
            set({ users: response.data })
        } catch (error) {
            console.error("Ошибка получения пользователей:", error)
        }
    },

    sendMessage: async (content) => {
        try {
            const { user } = useStore.getState()
            if (!user) return
            await axios.post("http://localhost:3001/messages", {
                user_id: user.id,
                content,
            })
            set((state) => ({
                messages: [...state.messages, { user_id: user.id, content }],
            }))
        } catch (error) {
            console.error("Ошибка отправки сообщения:", error)
        }
    },

    logout: () => {
        set({ user: null })
    },
}))

export default useStore
