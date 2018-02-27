import React from "react"
import PropTypes from "prop-types"
import R from "ramda"
// import styled from "styled-components"
// import theme from "../../theme"

export const RESULTS_PER_PAGE = 10

const PageButtonLabel = ({ text }) => {
    if (text === "Next" || text === "Previous") {
        return (
            <span>
                {text} <span className="aural">page</span>
            </span>
        )
    }
    return (
        <span>
            <span className="aural">Page </span>
            {text}
        </span>
    )
}

PageButtonLabel.propTypes = {
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

const PageButton = ({ style, text, page, handlePageClick }) => {
    if (!page) return null
    return (
        <li>
            <button className={style} onClick={() => handlePageClick(page)}>
                <PageButtonLabel text={text} />
            </button>
        </li>
    )
}

PageButton.propTypes = {
    style: PropTypes.string.isRequired,
    text: PropTypes.any,
    page: PropTypes.number,
    handlePageClick: PropTypes.func.isRequired
}

const Ellipsis = () => {
    return (
        <li>
            <span>...</span>
        </li>
    )
}

const buildPageButtonProps = handlePageClick => (page, text, buttonStyle = "button") => ({
    page,
    text: text || page,
    style: buttonStyle,
    handlePageClick
})

export const buildCurrentPages = (page, resultsPerPage, resultCount) => {
    if (resultCount === 0) return {}
    const lastPageResults = resultCount % resultsPerPage
    const evenPageCount = (resultCount - lastPageResults) / resultsPerPage
    const pageCount = lastPageResults > 0 ? evenPageCount + 1 : evenPageCount
    const range = R.range(1, pageCount + 1)
    const lastPage = R.last(range)
    const firstPage = range[0]
    const pageIndex = R.findIndex(R.equals(page), range)
    const previous = page === firstPage ? undefined : range[pageIndex - 1]
    const next = page === lastPage ? undefined : range[pageIndex + 1]
    const lowIndex = page === lastPage ? page - 3 : page - 2
    const startingIndex = R.clamp(0, range.length - 1, lowIndex)
    const middleValues = R.compose(R.take(3), R.slice(startingIndex, Infinity))(range)

    const isInMiddle = value => R.contains(value, middleValues)
    const undefinedIfInMiddle = value => {
        return isInMiddle(value) ? undefined : value
    }

    return {
        first: undefinedIfInMiddle(range[0]),
        previous,
        middle: middleValues.length > 1 ? middleValues : [],
        current: page,
        next,
        last: undefinedIfInMiddle(lastPage)
    }
}

const Pagination = ({ page, resultCount, handlePageClick }) => {
    const pages = buildCurrentPages(page, RESULTS_PER_PAGE, resultCount)
    const pageButtonProps = buildPageButtonProps(handlePageClick)
    const { first, next, previous, middle, current, last } = pages

    if (!pages.middle) return null

    const firstProps = pageButtonProps(first)
    const previousProps = pageButtonProps(previous, "Previous")
    const nextProps = pageButtonProps(next, "Next")
    const lastProps = pageButtonProps(last)

    return (
        <div className="pagination-container columns">
            <h2 className="aural">Paginate</h2>
            <div className="pagination-wrapper is-three-quarters column">
                <nav className="pagination" aria-label="Page navigation">
                    <ul className="pagination-list">
                        <PageButton {...previousProps} />
                        <PageButton {...firstProps} />
                        {first && middle[0] - first > 1 ? <Ellipsis /> : null}
                        {middle.map(page => {
                            const buttonStyle =
                                page === current ? "button primary-button" : "button"

                            const middleProps = pageButtonProps(page, page, buttonStyle)
                            return <PageButton key={page} {...middleProps} />
                        })}
                        {last && last - middle[middle.length - 1] > 1 ? <Ellipsis /> : null}
                        <PageButton {...lastProps} />
                        <PageButton {...nextProps} />
                    </ul>
                </nav>
            </div>
        </div>
    )
}

Pagination.propTypes = {
    page: PropTypes.number.isRequired,
    resultCount: PropTypes.number.isRequired,
    handlePageClick: PropTypes.func.isRequired
}

// const StyledDiv = styled.div`
//     margin-top: ${theme.spacing.small};
//
//     div {
//         display: flex;
//         align-items: center;
//     }
//
//     .container {
//         padding-top: ${theme.spacing.large};
//     }
//
//     .button {
//         background: ${theme.colors.lightGrey};
//         border-color: ${theme.colors.lightGrey};
//
//         span {
//             color: ${theme.colors.darkGrey};
//         }
//     }
//
//     .primary-button {
//         background-color: ${theme.colors.darkGrey};
//         border-radius: ${theme.borderRadius.medium};
//         border-color: ${theme.colors.darkGrey};
//
//         span {
//             color: white;
//         }
//
//         &:hover {
//             color: white;
//         }
//     }
//
//     @media screen and (max-width: ${theme.breakpoints.mobile}) {
//         .pagination-container div {
//             display: inline-block;
//         }
//     }
//
// `

export default Pagination
