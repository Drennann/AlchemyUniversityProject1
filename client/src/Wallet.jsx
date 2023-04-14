import { useCallback, useEffect } from 'react'
import server from './server'

function Wallet({ address, setAddress, balance, setBalance }) {
  async function onChange(evt) {
    const toSet = evt.target.value
    setAddress(toSet)
  }

  const getBalance = useCallback(async () => {
    if (address) {
      const {
        data: { balance }
      } = await server.get(`balance/${address}`)
      setBalance(balance)
    } else {
      setBalance(0)
    }
  }, [address])

  useEffect(() => {
    getBalance()
  }, [getBalance])

  return (
    <div className='container wallet'>
      <h1>Your Address</h1>

      <label>
        Address
        <input
          placeholder='Type your Address'
          value={address}
          onChange={onChange}
        />
      </label>

      <div className='balance'>Balance: {balance}</div>
    </div>
  )
}

export default Wallet
