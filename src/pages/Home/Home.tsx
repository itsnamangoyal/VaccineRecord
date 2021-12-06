import { FC } from "react"
import styles from "./Home.module.scss"
import { Link } from "react-router-dom"

const Home: FC = () => {
	return (
		<div className={styles.container}>
			<h1>Welcome to Vaccine Record</h1>
			<h2>Securely record and access administered COVID-19 vaccinations</h2>

			<div className={styles.buttonsContainer}>
				<Link to="/search">
					<button id={styles.patient}>Proceed</button>
				</Link>
			</div>
		</div>
	)
}

export default Home
