// react:
import React, {
	Component
} from "react";
import ReactDOM from "react-dom";
// react-router:
import {
	Router,
	Route,
	Switch
} from "react-router";
import { BrowserRouter } from "react-router-dom";

// material ui:
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

// components:
import App from "src/App.jsx";
// redux:
import {
	Provider,
	connect,
} from "react-redux";
import {
	combineReducers,
	createStore,
	applyMiddleware,
	compose,
} from "redux";

import rootReducer from "./reducers";

// actions:

// redux-saga:
import createSagaMiddleware from "redux-saga";
import handleActions from "src/sagas";
import handleEvents from "src/sockets";

// libs:
import io from "socket.io-client";
import localforage from "localforage";
import merge from "deepmerge";

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let preloadedState = {
};

const store = createStore(
	rootReducer, preloadedState,
	composeEnhancers(
		applyMiddleware(sagaMiddleware),
	)
);

let socket = io("https://emailreadreceipts.com", {
	path: "/8100/socket.io",
	transports: ["websocket"],
});

// listen to events and dispatch actions:
handleEvents(socket, store.dispatch);

// handle outgoing events & listen to actions:
// and maybe dispatch more actions:
sagaMiddleware.run(handleActions, {
	socket,
});


class Index extends Component {

	constructor(props) {
		super(props);

		this.theme = createMuiTheme({
			typography: {
				useNextVariants: true,
			},
			palette: {
				type: "dark",
				primary: {
					main: "#2181ff", // #2181ff
				},
				secondary: {
					main: "#ff3b3b",
				}
			}
		});

		this.getTheme = this.getTheme.bind(this);
		this.switchTheme = this.switchTheme.bind(this);

		let currentValue = null;
		const unsubscribe = store.subscribe(() => {
			let previousValue = currentValue;
			currentValue = store.getState().settings.theme;
			if (previousValue !== currentValue) {
				console.log("theme changed");
				// this.switchTheme(currentValue);
				this.setState({});
			}
		});
	}

	switchTheme(themeName) {
		switch (themeName) {
			case "light":
				this.theme = merge(this.theme, {
					palette: {
						type: "light",
					}
				});
				break;
			case "dark":
				this.theme = merge(this.theme, {
					palette: {
						type: "dark",
					}
				});
				break;
			case "mint":
				this.theme = merge(this.theme, {
					palette: {
						type: "light",
						primary: {
							main: "#16d0f4",
						},
						secondary: {
							main: "#24d2ac",
						},
						background: {
							paper: "#5ae097",
						},
					}
				});
				break;
		}
		this.theme = createMuiTheme(this.theme);
	}

	getTheme() {
	}

	render() {

		console.log("re-rendering index");

		return (
			<Provider store={store}>
				<MuiThemeProvider theme={this.theme}>
					<CssBaseline/>
					<BrowserRouter>
						<Switch>

							// order matters here, can't do exact path or /login and /register break:
							<Route path="/" render={(props) => {
								return <App {...props} socket={socket}/>;
							}}/>

						</Switch>
					</BrowserRouter>
				</MuiThemeProvider>
			</Provider>
		);
	}
}

ReactDOM.render(<Index/>, document.getElementById("root"));
