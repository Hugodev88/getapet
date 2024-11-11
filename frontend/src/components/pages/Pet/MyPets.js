import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import RoundedImage from '../../layout/RoundedImage'
import useFlashMessage from '../../../hooks/useFlashMessage'
import api from "../../../utils/api"
import styles from './Dashboard.module.css'

function MyPets() {

    const [pets, setPets] = useState([])
    const [token] = useState(localStorage.getItem('token') || '')
    const {setFlashMessage} = useFlashMessage()
    
    useEffect(()=> {
        api.get('/pets/mypets', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            setPets(response.data.pets)
        })
        .catch((err) => {

        })
    }, [token])

    async function removePet(id) {
        
        let msgType = 'success'

        const data = await api
        .delete(`/pets/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            const updatedPets = pets.filter((pet) => pet._id !== id)
            setPets(updatedPets)
            return response.data
        })
        .catch((err) => {
            msgType = 'error'
            return err.response.data
        })

        setFlashMessage(data.message, msgType)
    }

    async function concludeAdoption(id) {
        
        let msgType = 'success'

        const data = await api.patch(`/pets/conclude/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            return response.data
        }).catch((err) => {
            msgType = 'error'
            return err.response.data
        })

        setFlashMessage(data.message, msgType)
    }

    return (
        <section>

            <div className={styles.petlistheader}>
                <h1>Meus Pets</h1>
                <Link to="/pet/add">Cadastrar PET</Link>
            </div>


            <div className={styles.petlistcontainer}>
                {pets.length > 0 && (
                    pets.map((pet) => (
                        <div className={styles.petlistrow} key={pet._id}>
                            <RoundedImage 
                                src={`${process.env.REACT_APP_API}/images/pets/${pet.images[0]}`} 
                                alt={pet.name}
                                width="px75"
                            />
                            <span className="bold">{pet.name}</span>
                            <div className={styles.actions}>
                                {pet.available ? (
                                    <>
                                        {pet.adopter && (
                                            <button className={styles.concludebtn} onClick={() => {
                                                concludeAdoption(pet._id)
                                            }}>Concluir adocao</button>
                                        )}
                                        <Link to={`/pet/edit/${pet._id}`}>Editar</Link>
                                        <button onClick={() => {
                                            removePet(pet._id)
                                        }}>Excluir</button>
                                    </>
                                ) : (
                                    <p>Pet ja adotado</p>
                                )}
                            </div>
                        </div>
                    ))
                )}

                {pets.length === 0 && (
                    <p>Nao ha Pets Cadastrados</p>
                )}  
            </div>
        </section>
    )
}

export default MyPets

