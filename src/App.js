import { Fragment, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Web3 from 'web3'
import lottery from './contracts/lottery'
import relativeTime from 'dayjs/plugin/relativeTime'
import Popup from './components/popup'
import { Button, TextField, Typography } from '@material-ui/core'

dayjs.extend(relativeTime)
let web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545')
function App() {
	const [prevPrize, setprevPrize] = useState(0)
	const [balance, setbalance] = useState('')
	const [endTime, setendTime] = useState(0)
	const [players, setplayers] = useState([])
	const [amount, setamount] = useState(0)
	const [isConfirmed, setisConfirmed] = useState(undefined)
	const [isWeb3Connected, setIsWeb3Connected] = useState(false)

	useEffect(() => {
		const getInitData = async () => {
			try {
				await window.ethereum.request({ method: 'eth_requestAccounts' })
				setIsWeb3Connected(true)
			} catch (error) {
				setIsWeb3Connected(false)
			}
			web3 = new Web3(window.ethereum)
			const data = await Promise.all([
				lottery.methods.prevPrize().call(),
				web3.eth.getBalance(lottery.options.address),
				lottery.methods.endTime().call(),
				lottery.methods.getPlayers().call()
			])
			setprevPrize(data[0])
			setbalance(web3.utils.fromWei(data[1].toString(), 'ether'))
			setendTime(data[2])
			setplayers(data[3])
		}
		getInitData()
		console.log(window.ethereum)
	}, [isConfirmed])

	const enterLottery = async () => {
		try {
			await window.ethereum.request({ method: 'eth_requestAccounts' })
			const accounts = await web3.eth.getAccounts()
			setisConfirmed(true)
			await lottery.methods.enter().send({
				from: accounts[0],
				value: web3.utils.toWei(amount, 'ether')
			})
			setisConfirmed(false)
		} catch (err) {
			setisConfirmed(false)
		}
	}

	const connectMetamask = async () => {
		try {
			await window.ethereum.request({ method: 'eth_requestAccounts' })
			setIsWeb3Connected(true)
		} catch (error) {}
	}

	return (
		<div>
			<Typography variant="h2"> CSCMS Lottery </Typography>
			<p>The Minimum amount to enter is 0.1 Ether</p>
			<p>Plase make sure that your network setting is on Rinkeby Test Network</p>
			<p>Last Winner just won {prevPrize} Ether</p>
			<p>This round will end in {dayjs.unix(endTime).fromNow(false)}</p>
			<h4>
				There are {players.length} players in this round with total prize of
				{' ' + balance} Ether!
			</h4>

			<TextField
				value={amount}
				onChange={e => setamount(e.target.value)}
				type="number"
				label="Amount to enter"
				variant="outlined"
			/>
			{isWeb3Connected ? (
				<Button onClick={enterLottery} variant="contained" color="primary">
					Enter!
				</Button>
			) : (
				<Button onClick={connectMetamask} variant="contained" color="primary">
					Connect with Metamask
				</Button>
			)}

			{isConfirmed ? (
				<Popup content="waiting for confirmation" />
			) : (
				<Fragment></Fragment>
			)}
		</div>
	)
}

export default App
