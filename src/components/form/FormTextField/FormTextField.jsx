import styles from './FormTextField.module.scss'
import { useFormikContext } from 'formik'

export default function FormTextField({
  name,
  type = 'text',
  label,
  showLabel = true,
  ...rest
}) {
  const { setFieldValue, values, errors, touched } = useFormikContext()

  const handleChange = (e) => {
    setFieldValue(name, e.target.value)
  }

  return (
    <div className={styles.formField}>
      {showLabel && <label htmlFor={name}>{label || name}</label>}
      <input
        className={styles.input}
        type={type}
        name={name}
        value={values[name]}
        onChange={handleChange}
        style={
          touched[name] && errors[name]
            ? {
                border: '1px solid #f008',
              }
            : null
        }
        {...rest}
      />
      {touched[name] && errors[name] && (
        <div className={styles.error}>{errors[name]}</div>
      )}
    </div>
  )
}
