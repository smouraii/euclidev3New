import { FieldArray, FieldArrayRenderProps } from 'formik'
import * as React from 'react'
import Button, { ButtonProps } from 'antd/lib/button'

export function ArrayButton({
  name,
  onClick,
  ...restProps
}) {
  return (
    <FieldArray name={name}>
      {(array) => <Button {...restProps} onClick={() => onClick(array)} />}
    </FieldArray>
  )
}

export default ArrayButton
