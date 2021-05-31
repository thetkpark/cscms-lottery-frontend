import { Fragment, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Web3 from 'web3'
import web3 from './web3'
import lottery from './contracts/lottery'
import relativeTime from 'dayjs/plugin/relativeTime'
import Popup from './components/popup'
import './App.css'

dayjs.extend(relativeTime)

function App() {
	const [prevPrize, setprevPrize] = useState(0)
	const [balance, setbalance] = useState('')
	const [endTime, setendTime] = useState(0)
	const [players, setplayers] = useState([])
	const [amount, setamount] = useState(0)
	const [isConfirmed, setisConfirmed] = useState(undefined)

	useEffect(() => {
		const getInitData = async () => {
			const data = await Promise.all([
				lottery.methods.prevPrize().call(),
				web3.eth.getBalance(lottery.options.address),
				lottery.methods.endTime().call(),
				lottery.methods.getPlayers().call()
			])
			setprevPrize(data[0])
			setbalance(data[1].toString())
			setendTime(data[2])
			setplayers(data[3])
		}
		getInitData()
	}, [])

	const enterLottery = async () => {
		try {
			const accounts = await web3.eth.getAccounts()
			setisConfirmed(true)
			await lottery.methods.enter().send({
				from: accounts[0],
				value: web3.utils.toWei(amount, 'ether')
			})
			setisConfirmed(false)
		} catch (err) {
			// Do something
		}
	}

	const connectMetamask = () => {
		window.ethereum.request({ method: 'eth_requestAccounts' })
	}

	return (
		<div>
			<h1>CSCMS Lottery</h1>
			<p>The Minimum amount to ether is 1 Ether</p>
			<p>Plase make sure that your network setting is on Rinkeby Test Network</p>
			<p>Last Winner just won {prevPrize} Ether</p>
			<p>This round will end in {dayjs.unix(endTime).fromNow(false)}</p>
			<p>
				There are {players.length} players in this round with total prize of
				{web3.utils.fromWei(balance, 'ether')} Ether!
			</p>
			<button onClick={connectMetamask}>Connect with Metamask</button>
			<input
				value={amount}
				onChange={e => setamount(e.target.value)}
				type="number"
			/>
			<button onClick={enterLottery}>Enter!</button>
			{isConfirmed ? (
				<Popup content="waiting for confirmation" />
			) : (
				<Fragment></Fragment>
			)}
		</div>
	)
}

export default App
