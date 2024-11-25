import axios from "axios"

export const apiClient = axios.create({
  baseURL: "https://f373-111-88-217-31.ngrok-free.app/api/",
})
