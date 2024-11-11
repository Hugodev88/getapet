import styles from './RoundedImage.module.css'

function RoundedImage({src, alt, width}) {
    return (
        <img
         className={`${styles.roundedimage} ${styles[width]}`}
         src={src}
         alt={alt}
        />
    )
}

export default RoundedImage