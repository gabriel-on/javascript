import React, { useState, useEffect } from 'react';
import { api } from '../../axios/config';
import { Link } from 'react-router-dom';
import '../admin/Admin.css';

const Admin = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const deletePost = async (id) => {
    // Confirmar a exclusão com o usuário
    const shouldDelete = window.confirm("Tem certeza que deseja excluir este item?");

    if (!shouldDelete) {
      return; // Se o usuário cancelar, não exclua o item
    }

    await api.delete(`/posts/${id}`);
    alert("Excluído!");

    const filteredPosts = posts.filter((post) => post.id !== id);
    setPosts(filteredPosts);

    setSelectedItems((prevSelectedItems) => prevSelectedItems.filter((itemId) => itemId !== id));
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...prevSelectedItems, id]
    );
  };

  const deleteSelectedItems = async () => {
    // Confirmar a exclusão com o usuário
    const shouldDelete = window.confirm("Tem certeza que deseja excluir os itens selecionados?");

    if (!shouldDelete) {
      return; // Se o usuário cancelar, não exclua os itens
    }

    for (const id of selectedItems) {
      await api.delete(`/posts/${id}`);
    }

    alert("Itens selecionados excluídos!");

    const filteredPosts = posts.filter((post) => !selectedItems.includes(post.id));
    setPosts(filteredPosts);

    setSelectedItems([]);
  };

  useEffect(() => {
    api.get('/posts')
      .then((response) => {
        setPosts(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="admin">
      <h1 className="md-title">Gerenciar Games</h1>

      <div className="md-search-bar">
        <form>
          <label htmlFor="search-bar"></label>
          <input
            type="search"
            name="search-bar"
            id="search-bar"
            placeholder="Buscar..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {posts.length === 0 ? (
          <p className="loading-admin">Carregando...</p>
        ) : (
          <div className="md-search-results" key={posts}>
            {posts
              .filter((item) => {
                if (search === '') {
                  return item;
                } else if (item.title.toLowerCase().includes(search.toLowerCase())) {
                  return item;
                }
              })
              .map((item) => (
                <div key={item.id}>
                  <input className='checkbox'
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                  />
                  <div to={`/posts/${item.id}`}>
                    <h2>{item.title}</h2>
                    <img src={item.img} alt="" />
                    <div className="btn">
                      <Link className="md-btn" to={`/posts/edit/${item.id}`}>
                        Editar
                      </Link>
                      <button className="delete" onClick={() => deletePost(item.id)}>
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      <div className='delete-all'>
        {selectedItems.length > 0 && (
          <button onClick={deleteSelectedItems}>Excluir Itens Selecionados</button>
        )}
      </div>
    </div>
  );
};

export default Admin;