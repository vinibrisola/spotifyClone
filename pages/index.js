
import { getSession } from 'next-auth/react';
import Head from 'next/head'
import Image from 'next/image'
import Player from '../components/Player'
import Center from '../components/Center';
import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">

      <main className="flex">
        <Sidebar />
        <Center />
      </main>
      <div className="sticky bottom-0">
        <Player/>
      </div>
    </div>
  )
}

export default Home


