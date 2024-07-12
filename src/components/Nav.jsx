import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Nav({ libraryStatus, setLibraryStatus, isPlaylist, selectedPlaylist }) {
  return (
    <nav>
      <h1><span>アニメ</span> {`${isPlaylist? selectedPlaylist.name : 'Music Player'}`} </h1>
      <div>
        <button onClick={() => setLibraryStatus(!libraryStatus)}>
          Library
          <FontAwesomeIcon icon={faMusic} />
        </button>
        <Link to={`${isPlaylist? '/' : '/playlists'}`}>
          <button>
            {`${isPlaylist? 'All Songs' : 'Playlists'}`}
            <FontAwesomeIcon icon={faMusic} />
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Nav;