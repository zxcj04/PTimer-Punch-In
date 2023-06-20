import axios from 'axios'


const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

export default service