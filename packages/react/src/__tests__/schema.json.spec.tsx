import React from 'react'
import { FormProvider, createForm, createSchemaField } from '../index'
import { Schema } from '@formily/json-schema'
import { render } from '@testing-library/react'

const Input = ({ value, onChange }) => {
  return <input data-testid="input" value={value || ''} onChange={onChange} />
}

describe('json schema field', () => {
  test('string field', () => {
    const form = createForm()
    const SchemaField = createSchemaField({
      components: {
        Input,
      },
    })
    const { queryByTestId } = render(
      <FormProvider form={form}>
        <SchemaField
          name="string"
          schema={
            new Schema({
              type: 'string',
              default: '123',
              'x-component': 'Input',
            })
          }
        />
      </FormProvider>
    )
    expect(queryByTestId('input')).toBeVisible()
    expect(queryByTestId('input').getAttribute('value')).toEqual('123')
  })
  test('object field', () => {
    const form = createForm()
    const SchemaField = createSchemaField({
      components: {
        Input,
      },
    })
    const { queryByTestId } = render(
      <FormProvider form={form}>
        <SchemaField
          name="object"
          schema={{
            type: 'object',
            properties: {
              string: {
                type: 'string',
                'x-component': 'Input',
              },
            },
          }}
        />
      </FormProvider>
    )
    expect(queryByTestId('input')).toBeVisible()
  })
})
