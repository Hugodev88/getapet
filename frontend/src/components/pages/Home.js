import { Link } from "react-router-dom"
import api from "../../utils/api"
import { useEffect, useState } from "react"
import styles from './Home.module.css'

function Home() {

    const [pets, setPets] = useState([])

    useEffect(() => {

        api.get('/pets').then((response) => {
            setPets(response.data.pets)
        })

    }, [])

    return (
        <section>
            <div className={styles.pethomeheader}>
                <h1>Adote um Pet</h1>
                <p>Veja os detalhes de cada um e conheça o tutor deles</p>
            </div>
            <div className={styles.petcontainer}>
                {pets.length > 0 && 
                
                    pets.map((pet) => (
                        <div className={styles.petcard}>
                            <div style={{backgroundImage: `url(${process.env.REACT_APP_API}/images/pets/${pet.images[0]})`}} className={styles.petcardimage}></div>
                            <h3>{pet.name}</h3>
                            <p>
                            <span className="bold">Peso:</span> {pet.weight}kg
                            </p>
                            {pet.available ? (
                                <Link to={`pet/${pet._id}`}>Mais detalhes</Link>
                            ) : (
                                <p className={styles.adoptedtext}>Adotado</p>
                            )}
                        </div>               
                    ))
                }
                {pets.length === 0 && (
                    <p>Nao ha pets</p>
                )}
            </div>
        </section>
    )
}

export default Home

