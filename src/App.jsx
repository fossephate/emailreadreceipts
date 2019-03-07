// react:
import React, { Component, Suspense, lazy } from "react";
import ReactDOM from "react-dom";

// react-router:
import {
	Router,
	Route,
	Switch,
	withRouter,
} from "react-router";

// redux:
import { connect } from "react-redux";

// main components:


// modals:

// material ui:
// import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";

// components:
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
// import MenuItem from "@material-ui/core/MenuItem";

// recompose:
import { compose } from "recompose";

// device sizes:
import { device } from "src/constants/DeviceSizes.js";

// libs:
// jquery:
let $ = require("jquery");window.$ = $;

import localforage from "localforage";window.localforage = localforage;
import swal from "sweetalert2";window.swal = swal;
import io from "socket.io-client";

// jss:
const styles = (theme) => ({
	root: {
		display: "flex",
		justifyContent: "center",
		padding: "3%",
		width: "100%",
	},
	[device.tablet]: {
		root: {},
	},
	[device.laptop]: {
		root: {},
	},
	container: {
		width: "85%",
		padding: "3%",
	},
	form: {
		display: "flex",
		justifyContent: "space-between",
		width: "80%",
		marginLeft: "auto",
		marginRight: "auto",
	},
	myButton: {
		marginTop: "auto",
		marginBottom: "auto",
	},
	text: {
		color: "#FFF",
	},
});


class App extends Component {

	constructor(props) {
		super(props);

		this.createReadReceipt = this.createReadReceipt.bind(this);
		this.handleText = this.handleText.bind(this);

		this.state = {
			imageSrc: null,
			email: "",
		};
	}

	createReadReceipt() {
		window.socket.emit("createReadReceipt", {email: this.state.email});
	}


	// static getDerivedStateFromProps(props, state) {
	// // ...
	// }

	handleText(event) {
		this.setState({
			email: event.target.value,
		});
	}


	componentDidMount() {

		window.socket = this.props.socket;

		socket.on("messageRead", () => {
			swal("message read!");
		});

		socket.on("readReceipt", (data) => {
			// console.log(data);
			// this.setState({imageSrc: data});

			var img = document.createElement("img");
			img.src = data;
			img.width = 2;
			img.height = 2;
			document.body.appendChild(img);
			var selection = window.getSelection();
			var range = document.createRange();
			if (selection.rangeCount > 0) {
				selection.removeAllRanges();
			}
			range.selectNode(img);
			selection.addRange(range);
			document.execCommand("copy");

			window.swal("Image copied to clipboard! paste it into an email to get notified when it gets read!");
		});

	}

	shouldComponentUpdate(nextProps, nextState) {

		if (this.state != nextState) {
			return true;
		}
		return false;
	}


	render() {

		console.log("re-rendering app.");

		const { classes } = this.props;

		return (
			<div className={classes.root}>

				<Paper className={classes.container} elevation={8}>

					<h2 className={classes.text}>Read Receipts for Emails</h2>

					<p className={classes.text}>Put in your email and click 'create read receipt',
					paste the image into an email, and you'll get an email
					notifying you when it gets read.</p>

					<div className={classes.form}>
						<TextField
							id="outlined-email"
							label="Email"
							className={null}
							type="email"
				            name="email2"
				            autoComplete="email"
							value={this.state.email}
							onChange={this.handleText}
							margin="normal"
							variant="outlined"/>

						<Button
							className={classes.myButton}
							size="large"
							variant="contained"
							onClick={this.createReadReceipt}>Create Read Receipt</Button>

					</div>

				</Paper>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
	};
};

export default compose(
	withRouter,
	withStyles(styles),
	connect(mapStateToProps, mapDispatchToProps),
)(App);

/* FORCE HTTPS */
// if (window.location.protocol != "https:") {
// 	window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
// }
