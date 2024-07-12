import React, { useState, useEffect } from "react";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import "../styles/app.scss";
import PlaylistForm from "./PlaylistForm";
import PlaylistPlayer from "./PlaylistPlayer";

function Playlists() {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [currentSong, setCurrentSong] = useState(songs[0]);

  const addPlaylist = (playlistName) => {
    setPlaylists([...playlists, { name: playlistName, songs: [] }]);
  };

  const deletePlaylist = async (playlistName) => {
    try {
      await axios.delete(`http://localhost:3001/playlists/${playlistName}`);
      setPlaylists(playlists.filter(playlist => playlist.name !== playlistName));
      setSelectedPlaylist(null);
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const addSongToPlaylist = async (song) => {
    if (selectedPlaylist) {
      try {
        const updatedPlaylist = { ...selectedPlaylist, songs: [...selectedPlaylist.songs, song] };
        await axios.put(`http://localhost:3001/playlists/${selectedPlaylist.name}`, updatedPlaylist);
        setSelectedPlaylist(updatedPlaylist);
      } catch (error) {
        console.error('Error adding song to playlist:', error);
      }
    }
  };

  const removeSongFromPlaylist = async (songName) => {
    if (selectedPlaylist) {
      try {
        const updatedPlaylist = {
          ...selectedPlaylist,
          songs: selectedPlaylist.songs.filter(song => song.name !== songName)
        };
        await axios.put(`http://localhost:3001/playlists/${selectedPlaylist.name}`, updatedPlaylist);
        setSelectedPlaylist(updatedPlaylist);
      } catch (error) {
        console.error('Error removing song from playlist:', error);
      }
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      const songsData = await axios.get('http://localhost:3001/getSongs');
      const filteredData = songsData.data.map(({ _id, ...rest }) => rest);
      setSongs(filteredData);
      
      const playlistData = await axios.get('http://localhost:3001/playlists');
      setPlaylists(playlistData.data);
    }
    fetchAll();
  }, [selectedPlaylist, playlists]);

  return (
    <>
      <h1>Playlists</h1>
      <div className="bg-image library-active-bg"></div>
      <div className="playlists-container">
      <PlaylistForm onAddPlaylist={addPlaylist} />
        <table className="playlists-table">
          <thead>
            <tr>
              <th>Playlists</th>
              <th>All Songs to Add</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <ul>
                  {playlists.map((playlist, index) => (
                    <li key={index} onClick={() => setSelectedPlaylist(playlist)} className={(playlist.name == selectedPlaylist?.name)? 'selected-pl': ''}>
                        {playlist.name}
                        <button onClick={() => deletePlaylist(playlist.name)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {songs.map((song, index) => (
                    <li key={index}>
                      {song.name}
                      {selectedPlaylist && !selectedPlaylist.songs.find(s => s.name === song.name) ? (
                        <button onClick={() => addSongToPlaylist(song)}>
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      ) : (
                        <button onClick={() => removeSongFromPlaylist(song.name)}>
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          </tbody>
        </table>

        <button className="pl-btn" onClick={ () => window.location.reload()}>Save Playlists</button>

        {selectedPlaylist? (
            <PlaylistPlayer selectedPlaylist={selectedPlaylist}/>
        ) : ''}
        
      </div>
    </>
  );
}

export default Playlists;
