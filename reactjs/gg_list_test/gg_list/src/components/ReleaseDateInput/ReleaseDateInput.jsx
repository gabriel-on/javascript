import React from 'react';

function ReleaseDateInput({ register, errors, defaultValue, onChange }) {
  return (
    <div className="field">
      <label>Data de Lançamento:</label>
      <input
        type="date"
        {...register('releaseDate')}
        value={defaultValue || ''}  // Certifique-se de que defaultValue não é undefined ou null
        onChange={onChange}
      />
      {errors.releaseDate?.message}
    </div>
  );
}

export default ReleaseDateInput;