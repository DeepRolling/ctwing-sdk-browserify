import axios from 'axios'
const requester = axios.create({
    withCredentials: true
})

export default requester