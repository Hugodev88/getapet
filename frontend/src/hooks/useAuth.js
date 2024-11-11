import { useEffect, useState } from 'react'
import api from '../utils/api'
import { useNavigate } from 'react-router-dom'
import useFlashMessage from './useFlashMessage'

export default function useAuth() {

    const [authenticated, setAuthenticated] = useState(false)
    const { setFlashMessage } = useFlashMessage()
    const history = useNavigate()

    useEffect(()=> {

        const token = localStorage.getItem('token')

        if(token) {
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
            setAuthenticated(true)
        }

    }, [])

    async function register(user) {

        let msgText = "Cadastro realizado com sucesso."
        let msgType = 'success'

        try {
            
            const response = await api.post('/users/register', user)
            
            if (response && response.data) {
                const data = response.data
                await authUser(data)
            } else {
                throw new Error('Resposta da API inválida')
            }

        } catch (error) {
            
            if (error.response && error.response.data && error.response.data.message) {
                msgText = error.response.data.message
            } else {
                msgText = 'Ocorreu um erro no cadastro.'
            }
            msgType = 'error'
            console.log(error)
        }

        setFlashMessage(msgText, msgType)
    }

    

    async function login(user) {
        let msgText = "Login realizado com sucesso."
        let msgType = "success"

        try {
            
            const data = await api.post('/users/login', user).then((response) => {
                return response.data
            })

            await authUser(data)

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                msgText = error.response.data.message
            } else {
                msgText = 'Ocorreu um erro no login.'
            }
            msgType = 'error'
            console.log(error)
        }

        setFlashMessage(msgText, msgType)

    }

    async function authUser(data) {
        setAuthenticated(true)
        localStorage.setItem('token', JSON.stringify(data.token))
        history('/')
    }

    function logout(){
        const msgText = "Logout realizado com sucesso."
        const msgType = "success"

        setAuthenticated(false)
        localStorage.removeItem('token')
        api.defaults.headers.Authorization = undefined
        history('/')

        setFlashMessage(msgText, msgType)
    }

    return { authenticated, register, logout, login }
}
