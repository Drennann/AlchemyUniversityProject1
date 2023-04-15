import { useState } from 'react'
import server from './server'
import { secp256k1 } from 'ethereum-cryptography/secp256k1'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { toHex, utf8ToBytes, hexToBytes } from 'ethereum-cryptography/utils'
import Swal from 'sweetalert2'

// 02f6b6cfa6d4f94d3f05d6ce31d0cedca697c55730909e6074c8d9fdbe25402424
// 02d05f04eeead5f8bad98236887c7a457bd3f4a29af0659d3c119fb5aaf5e66104
// 038aaf7c7c57a5e7da15e5c08120db074dbe3cf186cb47abb27c3724989f112d12

const publicKeys = {
  '0xd0cedca697c55730909e6074c8d9fdbe25402424':
    '02f6b6cfa6d4f94d3f05d6ce31d0cedca697c55730909e6074c8d9fdbe25402424',
  '0x7c7a457bd3f4a29af0659d3c119fb5aaf5e66104':
    '02d05f04eeead5f8bad98236887c7a457bd3f4a29af0659d3c119fb5aaf5e66104',
  '0x20db074dbe3cf186cb47abb27c3724989f112d12':
    '038aaf7c7c57a5e7da15e5c08120db074dbe3cf186cb47abb27c3724989f112d12'
}

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState('')
  const [recipient, setRecipient] = useState('')

  const setValue = (setter) => (evt) => setter(evt.target.value)

  async function transfer(evt) {
    evt.preventDefault()

    try {
      const { value: PrivateKey, isConfirmed } = await Swal.fire({
        title: 'Signature',
        text: 'Enter your Private Key and Sign',
        input: 'text',
        showDenyButton: true,
        icon: 'info',
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Cool'
      })
      if (isConfirmed) {
        const message = {
          sender: publicKeys[address],
          amount: parseInt(sendAmount),
          recipient
        }
        const hashedMessage = toHex(
          keccak256(utf8ToBytes(JSON.stringify(message)))
        )

        const signature = secp256k1
          .sign(hashedMessage, PrivateKey)
          .toCompactHex()

        const publicKey = toHex(secp256k1.getPublicKey(PrivateKey))

        const {
          data: { balance }
        } = await server.post('send', {
          message,
          signature,
          hashedMessage,
          publicKey
        })
        setBalance(balance)
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Transaction canceled.',
          icon: 'error',
          confirmButtonText: ':('
        })
      }
    } catch (ex) {
      console.log(ex)
      Swal.fire({
        title: 'Error!',
        text: ex?.response?.data?.msg || 'i should not be visible',
        icon: 'error',
        confirmButtonText: ':('
      })
    }
  }

  return (
    <form className='container transfer' onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder='1, 2, 3...'
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        />
      </label>

      <label>
        Recipient
        <input
          placeholder='Type an address, for example: 0x2'
          value={recipient}
          onChange={setValue(setRecipient)}
        />
      </label>

      <input type='submit' className='button' value='Transfer' />
    </form>
  )
}

export default Transfer
