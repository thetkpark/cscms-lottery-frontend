import './popup.css'

const Popup = ({ content }) => {
	return (
		<div className="popup">
			<div className="popup_inner">
				<h1>{content}</h1>
				{/* <button onClick={this.props.closePopup}>close me</button> */}
			</div>
		</div>
	)
}

export default Popup
