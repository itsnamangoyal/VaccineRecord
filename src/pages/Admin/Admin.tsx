import { FC } from "react"
import styles from "./Admin.module.scss"
import { RegisterUser, MarkDose } from "./components"
import { IoIosArrowRoundBack } from "react-icons/io"
import { Link } from "react-router-dom"

const Admin: FC = () => {
	return (
		<div className={styles.container}>
			<h1>
				<Link to="/" className={styles.backIcon}>
					<IoIosArrowRoundBack />
				</Link>
				STAFF PANEL
			</h1>
			<RegisterUser />
			<MarkDose />
		</div>
	)
}

export default Admin
