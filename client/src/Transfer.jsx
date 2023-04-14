import { useState } from 'react'
import server from './server'
import { secp256k1 } from 'ethereum-cryptography/secp256k1'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { toHex, utf8ToBytes, hexToBytes } from 'ethereum-cryptography/utils'
import Swal from 'sweetalert2'

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
          sender: address,
          amount: parseInt(sendAmount),
          recipient
        }
        const hashedMessage = toHex(
          keccak256(utf8ToBytes(JSON.stringify(message)))
        )

        console.log('hashedMessage:', hashedMessage)

        const signature = secp256k1
          .sign(hashedMessage, hexToBytes(PrivateKey))
          .toCompactHex()

        /*         console.log('Signature:', signature)
        console.log('Address:', address.slice(2))
        console.log('HexPrivate Key', hexToBytes(PrivateKey))

        console.log(
          'Recovered PublicKey',
          signature.recoverPublicKey(hashedMessage).toHex()
        ) */

        const postData = JSON.stringify({ message, signature, hashedMessage })

        console.log(postData)

        const {
          data: { balance }
        } = await server.post('send', { message, signature, hashedMessage })
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
      Swal.fire({
        title: 'Error!',
        text: ex,
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
