const SearchResults = ({ data }) => {
    if (!data || !data.length) return null

    const resultList = data.map(({id, title}) => {
        return (
            <li key={id}>
                <span>{title}</span>
            </li>
        )
    })

    return (
        <div className="games-list">
            <ul>{resultList}</ul>
        </div>
    )
}

export default SearchResults