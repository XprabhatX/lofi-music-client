import { useState, useRef, useEffect } from "react";
import axios from 'axios'
//Styles
import "./styles/app.scss";
//Components
import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
import Nav from "./components/Nav";
//Data
// import data from "./data";
import { library } from "@fortawesome/fontawesome-svg-core";

let currentFlag = true;

function Home() {

  //State
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    aniamtionPercentage: 0,
  });

  //useEffect
  useEffect ( () => {
      const fetchAll = async() => {
        const songsData = await axios.get('http://localhost:3001/getSongs')
        const filteredData = songsData.data.map(({ _id, ...rest }) => rest);
        setSongs(filteredData);
      }
    fetchAll();
  }, [])

  useEffect(() => {
    if (currentFlag && songs.length > 0) {
      setCurrentSong(songs[0]);
      currentFlag = false;
    }
  }, [songs]);

  const [libraryStatus, setLibraryStatus] = useState(false);

  const timeUpdateHandler = (e) => {
    
    const current = e.target.currentTime;
    const duration = e.target.duration;
    
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const aniamtionPercentage = Math.round(
      (roundedCurrent / roundedDuration) * 100
    );
    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration: duration,
      aniamtionPercentage: aniamtionPercentage,
    });
  };

  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);

    setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    if (isPlaying) audioRef.current.play();
  };

  const audioRef = useRef(null);

  return (
    <>
    <div className={`bg-image ${libraryStatus ? "library-active-bg" : ""}`}></div>
    <div className={`App ${libraryStatus ? "library-active" : ""}`}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} isPlaylist={false} />
      <Song currentSong={currentSong} libraryStatus={libraryStatus} />
      <Player
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        audioRef={audioRef}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
        songs={songs}
        setSongs={setSongs}
      />
      <Library
        setCurrentSong={setCurrentSong}
        currentSong={currentSong}
        songs={songs}
        audioRef={audioRef}
        isPlaying={isPlaying}
        setSongs={setSongs}
        libraryStatus={libraryStatus}
        playlists={playlists}
        isPlaylist={false}
      />
      <audio
        onTimeUpdate={timeUpdateHandler}
        onLoadedMetadata={timeUpdateHandler}
        ref={audioRef}
        src={currentSong?.audio}
        onEnded={songEndHandler}
      ></audio>
    </div>
    </>
  );
}

export default Home;