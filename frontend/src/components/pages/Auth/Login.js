import { useContext, useState } from "react"
import Input from "../../form/input"
import styles from '../../form/form.module.css'
import { Context } from "../../../context/UserContext"
import { Link } from "react-router-dom"

function Login() {

    const [user, setUser] = useState({})
    const { login } = useContext(Context)

    function handleChange(e) {
        setUser({...user, [e.target.name]:e.target.value})
    }

    function handleSubmit(e){
        e.preventDefault()
        login(user)
    }   

    return (
        <section className={styles.formcontainer}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <Input text="E-mail" type="email" name="email" placeholder="Digite seu e-mail" handleOnChange={handleChange}/>
                <Input text="Senha" type="password" name="password" placeholder="Digite sua senha" handleOnChange={handleChange}/>
                <input type="submit" value="Entrar"/>
            </form>
            <p>Não tem conta? <Link to="/register">Clique Aqui</Link></p>
        </section>
    )
}

export default Login


