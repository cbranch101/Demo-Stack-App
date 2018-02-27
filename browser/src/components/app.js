import React from "react"
import { Route, Switch } from "react-router-dom"
import PropTypes from "prop-types"
import { withFragments, gql } from "scrimshaw-react"

import Header from "../components/header"
import WidgetList from "./widget-list"
import SingleWidget from "../containers/single-widget"

const App = ({ company, widgetList, createWidget, updateWidget }) => {
    const renderWidgetList = () => (
        <WidgetList
            company={company}
            widgetList={widgetList}
            createWidget={createWidget}
            updateWidget={updateWidget}
        />
    )
    return (
        <div>
            <Header company={company} />
            <Switch>
                <Route exact path="/" component={renderWidgetList} />
                <Route path="/widgets/:widgetId" component={SingleWidget} />
                <Route path="/widgets" component={renderWidgetList} />
            </Switch>
        </div>
    )
}

App.propTypes = {
    company: PropTypes.object.isRequired,
    widgetList: PropTypes.object.isRequired,
    createWidget: PropTypes.func.isRequired,
    updateWidget: PropTypes.func.isRequired
}

const enhance = withFragments({
    company: gql`
            fragment on Company {
                ...${WidgetList.fragments.company}
                ...${Header.fragments.company}
            }
     `,
    widgetList: gql`
            fragment on WidgetConnection {
                ...${WidgetList.fragments.widgetList}
            }
        `
})

export default enhance(App)
