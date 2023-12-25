import api from '../../axios/config';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import '../home/Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const [visiblePages] = useState(3); // Número de páginas visíveis
  const location = useLocation();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts?_sort=title&_order=asc');
        setPosts(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get('page')) || 1;
    setCurrentPage(page);
  }, [location]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);

    const searchParams = new URLSearchParams({ page: pageNumber });
    window.history.pushState(null, null, `?${searchParams.toString()}`);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(posts.length / postsPerPage)) {
      paginate(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  const renderPageNumbers = () => {
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const halfVisiblePages = Math.floor(visiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisiblePages);
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (totalPages > visiblePages && currentPage + halfVisiblePages > totalPages) {
      startPage = totalPages - visiblePages + 1;
      endPage = totalPages;
    }

    // Adicionando uma verificação para evitar o erro "Uncaught RangeError"
    if (startPage > endPage) {
      return [];
    }

    return [...Array(endPage - startPage + 1).keys()].map((number) => (
      <button
        key={startPage + number}
        onClick={() => paginate(startPage + number)}
        className={currentPage === startPage + number ? 'active' : ''}
      >
        {startPage + number}
      </button>
    ));
  };

  return (
    <div className="home">
      {posts.length === 0 ? (
        <p>Carregando...</p>
      ) : (
        <div className='games-lists'>
          {currentPosts.map((post) => (
            <div key={post.id}>
              <Link to={`/posts/${post.id}`}>
                <h2>{post.title}</h2>
                <img src={post.img} alt="" />
                <p>{post.description}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
      <div className="pagination">
        <button className='btn-prev-next' onClick={prevPage} disabled={currentPage === 1}>
          Anterior
        </button>
        {renderPageNumbers()}
        <button className='btn-prev-next' onClick={nextPage} disabled={currentPage === Math.ceil(posts.length / postsPerPage)}>
          Próximo
        </button>
        <span className="total-pages">Página {currentPage} de {Math.ceil(posts.length / postsPerPage)}</span>
      </div>
    </div>
  );
};

export default Home;