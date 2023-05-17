
import Head from 'next/head'
import Navbar from './components/Navbar';
import Hero from './components/Hero';


export default function Home() {

  return (
     <div>
      <Head> 
        <title>WhiteList-Dapp</title>  
        <meta name='description' content="WhiteList-Dapp"/>
        <link rel="icon" href='/favicon.ico'/>
      </Head>
      <Navbar />
      <Hero/>
     </div>
  )
}
