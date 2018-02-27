import yup from "yup"
import React from "react"
import PropTypes from "prop-types"
import { gql } from "scrimshaw-react"

import Form from "./form"

const defaultString = yup.string().default("")

const schema = yup.object({
    name: defaultString.required("Please name your widget"),
    cost: yup.number().required("Please set a cost")
})

export const createMutation = gql`
    mutation($input: AddWidgetInput!) {
        addWidget(input: $input) {
            id
            name
            cost
        }
    }
`

const CreateWidget = ({ onSubmit }) => {
    return (
        <Form
            schema={schema}
            onSubmit={onSubmit}
            render={({ Field, Message }) => {
                return (
                    <div>
                        <div>
                            <label>Name</label>

                            <Field name="name" placeholder="First name" />
                            <Message for="name" />
                            <label>Cost</label>

                            <Field name="cost" placeholder="Cost" />
                            <Message for="cost" />
                        </div>
                        <button type="submit">Submit</button>
                    </div>
                )
            }}
        />
    )
}

CreateWidget.propTypes = {
    onSubmit: PropTypes.func.isRequired
}

export default CreateWidget
