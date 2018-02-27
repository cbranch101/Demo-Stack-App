import PropTypes from "prop-types"
import { connect } from "react-redux"

const ReduxDataHandler = ({ render, ...propsToPass }) => {
    return render(propsToPass)
}

ReduxDataHandler.propTypes = {
    render: PropTypes.func.isRequired
}

const withReduxData = (mapStateToProps, mapDispatchToProps) => {
    return connect(mapStateToProps, mapDispatchToProps)(ReduxDataHandler)
}

export default withReduxData
