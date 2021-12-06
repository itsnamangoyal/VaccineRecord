import styles from './FormSelect.module.scss'
import { useFormikContext } from 'formik'

export default function FormSelect({ name, label, children, ...rest }) {
  const { setFieldValue, values, errors, touched } = useFormikContext()

  const handleChange = (e) => {
    setFieldValue(name, e.target.value)
  }

  return (
    <div className={styles.formField}>
      <label htmlFor={name}>{label || name}</label>
      <select
        className={styles.input}
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
      >
        {children}
      </select>
      {touched[name] && errors[name] && (
        <div className={styles.error}>{errors[name]}</div>
      )}
    </div>
  )
}
