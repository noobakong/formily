import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { createForm } from '@formily/core'
import { FormProvider, ExpressionScope, createSchemaField, useField } from '..'

test('expression scope', async () => {
  const Container = (props) => {
    return (
      <ExpressionScope value={{ $innerScope: 'this is inner scope value' }}>
        {props.children}
      </ExpressionScope>
    )
  }
  const Input = (props) => <div data-testid="test-input">{props.value}</div>
  const SchemaField = createSchemaField({
    components: {
      Container,
      Input,
    },
  })
  const form = createForm()
  const { getByTestId } = render(
    <FormProvider form={form}>
      <SchemaField scope={{ $outerScope: 'this is outer scope value' }}>
        <SchemaField.Void x-component="Container">
          <SchemaField.String
            name="input"
            x-component="Input"
            x-value="{{$innerScope + ' ' + $outerScope}}"
          />
        </SchemaField.Void>
      </SchemaField>
    </FormProvider>
  )

  expect(getByTestId('test-input').textContent).toBe(
    'this is inner scope value this is outer scope value'
  )
})

test('x-compile-omitted', async () => {
  const form = createForm()
  const SchemaField = createSchemaField({
    components: {
      Input: (props) => (
        <div data-testid="input">
          {props.aa}
          {useField().title}
          {props.extra}
        </div>
      ),
    },
  })

  const { queryByTestId } = render(
    <FormProvider form={form}>
      <SchemaField>
        <SchemaField.String
          name="target"
          x-compile-omitted={['x-component-props']}
          title="{{123 + '321'}}"
          x-component-props={{
            aa: '{{fake}}',
            extra: 'extra',
          }}
          x-component="Input"
        />
        <SchemaField.String name="btn" x-component="Button" />
      </SchemaField>
    </FormProvider>
  )
  await waitFor(() => {
    expect(queryByTestId('input').textContent).toBe('{{fake}}123321extra')
  })
})
