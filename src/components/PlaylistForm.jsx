import React, { useState } from 'react';
import axios from 'axios';

const PlaylistForm = ({ onAddPlaylist }) => {
  const [playlistName, setPlaylistName] = useState('');

  const handleInputChange = (event) => {
    setPlaylistName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (playlistName.trim()) {
      try {
        
        const response = await axios.post('http://localhost:3001/playlists', {
          name: playlistName,
          songs: []
        });

        if (response.status === 200) {
          onAddPlaylist(playlistName);
        }
      } catch (error) {
        console.error('Error adding playlist:', error);
      }
      setPlaylistName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="horizontal-form">
      <input
        type="text"
        value={playlistName}
        onChange={handleInputChange}
        placeholder="Playlist Name"
        className="form-input"
      />
      <button type="submit" className="add-button">
        Add Playlist
      </button>
    </form>
  );
};

export default PlaylistForm;
