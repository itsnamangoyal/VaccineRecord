import { FC, useRef, useState } from "react"
import Loader from "react-loader-spinner"
import styles from "./Search.module.scss"
import { Formik } from "formik"
import * as yup from "yup"
import { FormTextField } from "../../components/form"
import { RecordData } from "../../types"
import getRecord from "../../helpers/data/getRecord"
import { MdCancel, MdCheckCircle } from "react-icons/md"
import { toast } from "react-toastify"

const Search: FC = () => {
	const [record, setRecord] = useState<RecordData | false | null>(false)
	const formRef = useRef(null)

	async function onSubmit(data: { adhaar: string }) {
		let { adhaar: _adhaar } = data
		_adhaar = _adhaar.replaceAll(" ", "")
		const adhaar = parseInt(_adhaar)

		setRecord(null)
		const record = await getRecord(adhaar)
		setRecord(record)

		if (!record) {
			toast.error("Could not fetch data for this adhaar.", {
				position: "bottom-center",
			})
			return
		}
	}

	return (
		<div className={styles.container}>
			<Formik
				validationSchema={userSearchSchema}
				initialValues={{ adhaar: "" }}
				onSubmit={onSubmit}
				innerRef={formRef}>
				{({ handleSubmit }) => {
					return (
						<form className={styles.form} ref={formRef} onSubmit={handleSubmit}>
							<FormTextField
								name="adhaar"
								label="Adhaar"
								showLabel={false}
								placeholder="Enter the adhaar number to search"
							/>
							<button type="submit">Search</button>
						</form>
					)
				}}
			</Formik>
			{record && (
				<div className={styles.infoContainer}>
					<h2>Result</h2>
					<table>
						<tr>
							<th>Dose</th>
							<th>vaccinated</th>
							<th>Time</th>
						</tr>
						<tr>
							<td>Dose 1</td>
							<td>
								{record.dose1 ? (
									<MdCheckCircle className={styles.icon} />
								) : (
									<MdCancel className={styles.icon} />
								)}
							</td>
							<td>
								{record.dose1_timestamp
									? new Date(record.dose1_timestamp).toLocaleString(undefined, {
											hour12: true,
									  })
									: "N/A"}
							</td>
						</tr>
						<tr>
							<td>Dose 2</td>
							<td>
								{record.dose2 ? (
									<MdCheckCircle className={styles.icon} />
								) : (
									<MdCancel className={styles.icon} />
								)}
							</td>
							<td>
								{record.dose2_timestamp
									? new Date(record.dose2_timestamp).toLocaleString(undefined, {
											hour12: true,
									  })
									: "N/A"}
							</td>
						</tr>
					</table>
				</div>
			)}
			{record === null && (
				<div className={styles.infoContainer}>
					<Loader type="Puff" />
				</div>
			)}
		</div>
	)
}

export default Search

const userSearchSchema = yup.object({
	adhaar: yup
		.string()
		.required("adhaar is required")
		.matches(new RegExp("^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$"), {
			message: "Adhaar should look like xxxx xxxx xxxx",
		}),
})
