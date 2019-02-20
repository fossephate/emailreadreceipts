// react:
import React, { PureComponent } from "react";

// material ui:
import { withStyles } from "@material-ui/core/styles";

import VirtualProController from "libs/InputHandler/VirtualProController.js";
import { clamp, normalizeVector} from "libs/tools.js";
let classNames = require("classnames");

// jss:
const styles = (theme) => ({
	root: {
		background: "transparent",
		position: "relative",
		width: "13.4%",
	},
	stick1: {
		position: "absolute",
		width: "37%",
		height: "12%",
		left: "28%",
		top: "47.2%",
		borderRadius: "50%",
	},
	stick2: {
		position: "absolute",
		background: "#0AB9E6",
		width: "50%",
		height: "50%",
		left: "25%",
		top: "25%",
		pointerEvents: "none",
		borderRadius: "50%",
	},
	image: {
		width: "100%",
	},
	abxy: {
		position: "absolute",
		background: "transparent",
		width: "85.25%",
		height: "27.75%",
		left: "3%",
		top: "12%",
		"& .a": {
			position: "absolute",
			left: "63.2%",
			top: "34.5%",
		},
		"& .b": {
			position: "absolute",
			left: "35.2%",
			top: "61%",
		},
		"& .x": {
			position: "absolute",
			left: "35.2%",
			top: "8%",
		},
		"& .y": {
			position: "absolute",
			left: "7.2%",
			top: "34.5%",
		},
	},
	button: {
		background: "rgba(50, 50, 50, 0.2)",
		width: "32%",
		height: "32%",
		border: "2px solid #333",
		borderRadius: "50%",
		display: "flex",
		justifyContent: "space-evenly",
		flexDirection: "column",
	},
	otherButtons: {
		color: "#FFFFFF",
		textShadow: "2px 2px 4px #000000",
		/* less round */
		borderRadius: "10px !important",
		"& .plus": {
			position: "absolute",
			left: "1%",
			top: "6%",
			width: "32%",
			height: "9%",
		},
		"& .home": {
			position: "absolute",
			left: "14%",
			top: "67.5%",
			width: "32%",
			height: "9%",
		},
		"& .r": {
			position: "absolute",
			left: "40%",
			top: "6%",
			width: "60%",
			height: "6%",
		},
		"& .zr": {
			position: "absolute",
			left: "40%",
			top: "0%",
			width: "60%",
			height: "6%",
		},
	},
	highlighted: {
		background: "rgba(80, 187, 80, 0.7)",
	},
	trigger1: {
		height: "50%",
		borderRadius: "10px",
		borderBottomLeftRadius: "0",
		borderBottomRightRadius: "0",
		zIndex: "100",
	},
	trigger2: {
		height: "50%",
		background: "rgba(80, 187, 80, 0.7)",
		borderRadius: "10px",
		borderTopLeftRadius: "0",
		borderTopRightRadius: "0",
	},
});

class RightJoyCon extends PureComponent {

	constructor(props) {
		super(props);

		this.controller = new VirtualProController();

		this.state = {};
	}

	render() {

		const { classes } = this.props;

		let restPos = 128;

		this.controller.setState(this.props.controllerState);

		let RX = (this.controller.axes[2] - restPos);
		let RY = (this.controller.axes[3] - restPos);

		RY *= -1;

		// normalize:
		let scale = 0.25;
		let RMagnitude = Math.sqrt((RX * RX) + (RY * RY));
		let max = 120;
		RMagnitude = clamp(RMagnitude, -max, max);
		let RStick = normalizeVector({
			x: RX,
			y: RY,
		}, RMagnitude);
		RX = parseInt(RStick.x * scale);
		RY = parseInt(RStick.y * scale);
		let rightTransform = RX + "px" + "," + RY + "px";

		return (
			<div className={classes.root}>
				<img className={classes.image} src={window.location.origin + "/images/rightJoyCon2.png"}/>
				<div className={classNames(classes.stick1, {[classes.highlighted]: (this.controller.buttons.rstick)})}>
					<div className={classes.stick2} style={{transform: "translate(" + rightTransform + ")"}}></div>
				</div>

				<div className={classes.abxy}>
					<div className={classNames(classes.button, "a", {[classes.highlighted]: (this.controller.buttons.a)})}></div>
					<div className={classNames(classes.button, "b", {[classes.highlighted]: (this.controller.buttons.b)})}></div>
					<div className={classNames(classes.button, "x", {[classes.highlighted]: (this.controller.buttons.x)})}></div>
					<div className={classNames(classes.button, "y", {[classes.highlighted]: (this.controller.buttons.y)})}></div>
				</div>
				<div className={classes.otherButtons}>
					<div className={classNames(classes.button, classes.otherButtons, "plus", {[classes.highlighted]: (this.controller.buttons.plus)})}></div>
					<div className={classNames(classes.button, classes.otherButtons, "home", {[classes.highlighted]: (this.controller.buttons.home)})}></div>
					<div className={classNames(classes.button, classes.otherButtons, "r", {[classes.highlighted]: (this.controller.buttons.r)})}>
						<div className="click-passthrough">R</div>
					</div>
					<div className={classNames(classes.button, classes.otherButtons, "zr")}>
						<div className={classNames(classes.trigger1, {[classes.highlighted]: (this.controller.buttons.zr)})}>ZR</div>
						<div className={classes.trigger2} style={{width: (this.controller.axes[5] * 100) + "%"}}></div>
					</div>
				</div>
			</div>
		);
	}

}

export default withStyles(styles)(RightJoyCon);