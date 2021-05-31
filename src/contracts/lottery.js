import web3 from '../web3'
import abi from './Lottery.json'

const address = '0x35c3667BB7c9013d0b6561a7d61634Ac3C441255'

export default new web3.eth.Contract(abi, address)
