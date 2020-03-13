export default class State {
	constructor(app) {
		this.app = app;
		this.state = 0;
	}

	getState() {
		return this.state;
	}

	setState(state) {
		this.state = state;
	}
}
