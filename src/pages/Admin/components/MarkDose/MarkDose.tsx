import { FC, useRef } from "react"
import { Formik } from "formik"
import { markDose } from "../../../../services/api"
import * as yup from "yup"
import { FormSelect, FormTextField } from "../../../../components/form"

const MarkDose: FC = () => {
	const formRef = useRef(null)

	function onSubmit(data: { adhaar: string; dose: number }) {
		let { adhaar, dose } = data
		adhaar = adhaar.replaceAll(" ", "")
		const _adhaar = parseInt(adhaar)
    markDose(_adhaar, dose)
  }

	return (
		<section>
			<h2>Mark Dose</h2>
			<Formik
				innerRef={formRef}
				initialValues={{ adhaar: "", dose: 1 }}
				onSubmit={onSubmit}
				validationSchema={markDoseValidationSchema}>
				{({ handleSubmit }) => {
					return (
						<form ref={formRef} onSubmit={handleSubmit}>
							<FormTextField name="adhaar" label="Adhaar" />
							<FormSelect name="dose" label="Dose">
								<option value={1}>1</option>
								<option value={2}>2</option>
							</FormSelect>
							<button type="submit">Mark</button>
						</form>
					)
				}}
			</Formik>
		</section>
	)
}

export default MarkDose

const markDoseValidationSchema = yup.object({
	adhaar: yup
		.string()
		.required("Adhaar is required")
		.matches(new RegExp("^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$"), {
			message: "Adhaar should look like xxxx xxxx xxxx",
		}),
	dose: yup
		.number()
		.required("Dose is required")
		.oneOf([1, 2], "Dose can either be 1 or 2"),
})
