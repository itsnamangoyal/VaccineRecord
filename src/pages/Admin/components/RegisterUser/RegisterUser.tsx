import { FC, useRef } from "react"
import { Formik } from "formik"
import { registerUser } from "../../../../services/api"
import * as yup from "yup"
import { FormTextField } from "../../../../components/form"

const RegisterUser: FC = () => {
	const formRef = useRef(null)

	function onSubmit(data: { adhaar: string }) {
		let { adhaar } = data
		adhaar = adhaar.replaceAll(" ", "")
		const _adhaar = parseInt(adhaar)
		registerUser(_adhaar)
	}

	return (
		<section>
			<h2>Register User</h2>
			<Formik
				innerRef={formRef}
				initialValues={{ adhaar: "" }}
				onSubmit={onSubmit}
				validationSchema={registerUSerValidationSchema}>
				{({ handleSubmit }) => {
					return (
						<form ref={formRef} onSubmit={handleSubmit}>
							<FormTextField name="adhaar" label="Adhaar"></FormTextField>
							<button type="submit">Register</button>
						</form>
					)
				}}
			</Formik>
		</section>
	)
}

export default RegisterUser

const registerUSerValidationSchema = yup.object({
	adhaar: yup
		.string()
		.required("adhaar is required")
		.matches(new RegExp("^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$"), {
			message: "Adhaar should look like xxxx xxxx xxxx",
		}),
})
