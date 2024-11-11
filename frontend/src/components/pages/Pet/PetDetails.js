import { useEffect, useState } from 'react'
import api from '../../../utils/api'
import styles from './PetDetails.module.css'
import { Link, useParams } from 'react-router-dom'
import useFlashMessage from '../../../hooks/useFlashMessage'

function PetDetails () {

    const [pet, setPet] = useState({})
    const {id} = useParams()
    const {setFlashMessage} = useFlashMessage()
    const [token] = useState(localStorage.getItem('token') || '')

    useEffect(() => {
        api.get(`/pets/${id}`).then((response) => {
            setPet(response.data.pet)
        })
    }, [id])

    async function schedule() {
        
        let msgType = 'success'
        
        const data = await api.patch(`pets/schedule/${pet._id}`, {
            Authorization: `Bearer ${JSON.parse(token)}`
        }).then((response) => {
            return response.data
        })
        .catch((err) => {
            msgType = 'error'
            return err.response.data
        })

        setFlashMessage(data.message, msgType)

    }

    return (
        <>
            {pet.name && (
                <section className={styles.petdetailscontainer}>
                    <div className={styles.petdetailsheader}>
                        <h1>Conhecendo o Pet: {pet.name}</h1>
                        <p>Se tiver interesse, marque uma visita para conhecê-lo</p>
                    </div>

                    <div className={styles.petimages}>
                        {pet.images.map((image, index) => (
                            <img 
                            src={`${process.env.REACT_APP_API}/images/pets/${image}`} 
                            alt={pet.name}
                            key={index}
                            />
                        ))}
                    </div>

                    <p>
                        <span className='bold'>Peso:</span>{pet.weight}kg
                    </p>
                    <p>
                        <span className='bold'>Idade:</span>{pet.age} anos
                    </p>
                    {token ? (
                        <button onClick={schedule}>Solicitar uma visita</button>
                    ) : (
                        <p>Você precisa <Link to='/register'>criar uma conta</Link> para solicitar a visita</p>
                    )}
                </section>
            )}
        </>
    )
}

export default PetDetails

