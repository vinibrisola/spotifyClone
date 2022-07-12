import { useSession } from "next-auth/react"
import { debounce } from "lodash"
import {useCallback, useEffect, useState } from "react";
import { useRecoilState} from "recoil";
import {currentTrackIdState, isPlayingState} from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import useSonginfo from "../hooks/useSonginfo";
import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
 } from "@heroicons/react/outline";
import { SwitchHorizontalIcon, RewindIcon,FastForwardIcon, PauseIcon,PlayIcon,ReplyIcon,VolumeUpIcon } from "@heroicons/react/solid";
function Player(){
  const spotifyApi= useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentIdTrack] = useRecoilState(currentTrackIdState);
  const [isPlaying,setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);


  const songInfo = useSonginfo();

  const fetchCurrentSong = () => {
    if(!songInfo){
      spotifyApi.getMyCurrentPlayingTrack().then((data) =>{
        console.log("Now playing:",data.body?.item);
        setCurrentIdTrack(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data)=>{
          setIsPlaying(data.body?.is_playing);
        })
      })
    }
  }


  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) =>{
      if(data.body.is_playing){
        spotifyApi.pause();
        setIsPlaying(false);
      }else{
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  }



  useEffect(() => {
    if(spotifyApi.getAccessToken() && !currentTrackId){
      fetchCurrentSong();
      setVolume(50);
    }
  },[currentTrackIdState, spotifyApi, session])



  useEffect(() => {
    if(volume > 0 && volume < 100){
      debouncedAdjustVolume(volume);
    }
  },[volume]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume)=>{
      spotifyApi.setVolume(volume).catch((err)=>{});
    },500),[]
  );

  return(
    <div className="h-24 bg-gradient-to-b from-black 
    to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      <div className="flex items-center space-x-4">
        <img className="hidden md:inline h-10 w-10"
         src={songInfo?.album.images?.[0]?.url} alt="" />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>
        <RewindIcon className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause}
          className="h-10 w-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>
        ): (
          <PlayIcon onClick={handlePlayPause}
          className="h-10 w-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>
        )}
        <FastForwardIcon className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>
        <ReplyIcon class="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>
      </div>
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon onClick={()=> volume > 0 && setVolume(volume -10)}
        className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>
          <ipunt className="w-14 md:w-28" type="range" value={volume} onChange={(e)=> setVolume(Number(e.target.value))} min={0} max={100}/>
        <VolumeUpIcon onClick={()=> volume > 100 && setVolume(volume + 10)}
        className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>
      </div>
    </div>
  )
}

export default Player;