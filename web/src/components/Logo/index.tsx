import styles from './styles.css'

type Props = {
  size?: number
}

export const Logo = ({ size = 26 }: Props) => (
  <img className={styles.mark} src={`${import.meta.env.BASE_URL}logo.png`} width={size} alt="Funcio" />
)
