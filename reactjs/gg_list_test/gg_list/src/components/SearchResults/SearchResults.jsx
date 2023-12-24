import { Link } from 'react-router-dom';

const SearchResults = ({ results }) => {
    return (
        <div className='search-results'>
            {results.map((result) => (
                <div key={result.id}>
                    <Link to={`/posts/${result.id}`}>
                        <img src={result.img} alt="FOTO" />
                        <div>
                            <h4>{result.title}</h4>
                            <p>{result.description}</p>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default SearchResults