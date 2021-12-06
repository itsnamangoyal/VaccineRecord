import styles from './FormCheckbox.module.scss'
import { useFormikContext } from 'formik'
import { BsCheck } from 'react-icons/bs'
import produce from 'immer'

export default function FormCheckbox({ name, label, index = 0, ...rest }) {
  const { setFieldValue, values, errors } = useFormikContext()

  const handleChange = (e) => {
    if (Array.isArray(values[name])) {
      if (e === false)
        setFieldValue(
          name,
          produce(values[name], (draft) => {
            draft[index] = !draft[index]
          })
        )
      else
        setFieldValue(
          name,
          produce(values[name], (draft) => {
            draft[index] = e.target.checked
          })
        )
    } else {
      if (e === false) setFieldValue(name, !values[name])
      else setFieldValue(name, e.target.checked)
    }
  }

  // PRE RENDER
  let checked
  if (Array.isArray(values[name])) {
    checked = values[name][index]
  } else {
    checked = values[name]
  }

  // RENDER
  return (
    <div className={styles.checkboxWrapper}>
      <div className={styles.row} onClick={() => handleChange(false)}>
        <input
          className={styles.input}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          style={
            errors[name]
              ? {
                  border: '1px solid #f008',
                }
              : null
          }
          {...rest}
        />
        <div className={styles.fakeBox}>{checked ? <BsCheck /> : null}</div>
        <label htmlFor={name}>{label || name}</label>
      </div>
      {errors[name] && <div className={styles.error}>{errors[name]}</div>}
    </div>
  )
}
