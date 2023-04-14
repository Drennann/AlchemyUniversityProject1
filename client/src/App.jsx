import Wallet from './Wallet'
import Transfer from './Transfer'
import './App.scss'
import { useState } from 'react'

function App() {
  const [balance, setBalance] = useState(0)
  const [address, setAddress] = useState('')
  const [privateKey, setPrivateKey] = useState('')

  return (
    <>
      <h2>Demo PrivateKey : Address</h2>
      <p>
        d061867069356d97307edde05087800234530654e3a2543d9388e059b271dce7:
        0xd0cedca697c55730909e6074c8d9fdbe25402424
      </p>
      <p>
        486e83d02a07c2ba37c585f2d2e892c3c5ace0c2a2a1fe45b44034dddfc04416:
        0x7c7a457bd3f4a29af0659d3c119fb5aaf5e66104
      </p>
      <p>
        76027000018eef8463a88bb3cb50a915684d25e1a7d99573195e6923dfe217c1:
        0x20db074dbe3cf186cb47abb27c3724989f112d12
      </p>
      <div className='app'>
        <Wallet
          balance={balance}
          setBalance={setBalance}
          address={address}
          setAddress={setAddress}
          privateKey={privateKey}
          setPrivateKey={setPrivateKey}
        />
        <Transfer
          setBalance={setBalance}
          address={address}
          privateKey={privateKey}
        />
      </div>
    </>
  )
}

export default App
