import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { NameRegistryState } from './NewFile';
import { resolve } from './resolve';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmRawTransaction } from '@solana/web3.js';

function App() {

  const [getData, SetGetData] = useState('');

  const submit = () => {

    const MAINNET_ENDPOINT = 'https://solana-mainnet.phantom.tech';
    // const cluster = 'devnet';
    // const endpoint = clusterApiUrl(cluster);
    const connection = new Connection(MAINNET_ENDPOINT, 'confirmed');
    const pKey = new PublicKey('6FGHjiCt9uoTrK84c1dDJmEqv9HyU1SKfKds8bVMWXgs');

    // const store = NameRegistryState.retrieve(connection, pKey);

    const store = resolve(connection, getData);

  }

  return (
    <div className="App">
      <input
        type='text'
        placeholder='Enter Domain Name'
        value={getData}
        style={{ marginTop: '20%', marginRight: '10px', width: '250px', height: '35px' }}
        onChange={(e) => SetGetData(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            submit()
          }
        }}
      />
      <button onClick={submit} disabled={!getData} style={{ width: '100px', height: '40px', backgroundColor: '#b1baf5', cursor: 'pointer' }}>Submit</button>
    </div>
  );
}

export default App;
