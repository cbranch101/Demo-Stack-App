import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider } from "react-redux"
import { Provider as RequestClientProvider, Client } from "scrimshaw-react"

import App from "./containers/app.js"
import configureStore from "./configure-store"
import "./index.css"

const client = new Client("http://localhost:3000/graphql")

const store = configureStore()

ReactDOM.render(
    <Router>
        <RequestClientProvider client={client}>
            <Provider store={store}>
                <App />
            </Provider>
        </RequestClientProvider>
    </Router>,
    document.getElementById("root")
)
