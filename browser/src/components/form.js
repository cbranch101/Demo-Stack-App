import React from "react"
import PropTypes from "prop-types"
import BaseForm from "react-formal"

import State from "./state"
const { Field, Message } = BaseForm

const Form = ({ render, schema, onSubmit }) => {
    return (
        <State
            initialState={schema.default()}
            render={({ setState, model }) => {
                const handleChange = newModel => setState({ model: newModel })
                return (
                    <BaseForm
                        schema={schema}
                        value={model}
                        onChange={handleChange}
                        onSubmit={onSubmit}
                    >
                        {render({ model, Field, Message })}
                    </BaseForm>
                )
            }}
        />
    )
}

Form.propTypes = {
    render: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export default Form
