export default class EmittingList {
	constructor(list) {
		this._handlers = new Set();

		this._state = [];

		if(list !== undefined) {
			this._state = this._state.concat(list);
		}
	}

	onChange(fn) {
		if(typeof fn !== 'function') {
			throw new Error('Argument to onChange must be a function');
		}

		this._handlers.add(fn);

		// Initialize
		this._state.forEach((item, i) => {
			fn('add', i, item);
		});

		return () => {
			this._handlers.delete(fn);
		};
	}

	push(item) {
		this._state.push(item);

		this._emit('add', this._state.length - 1, item);
	}

	pop() {
		var removedItem = this._state.pop();

		this._emit('remove', this._state.length, removedItem);

		return removedItem;
	}

	unshift(item) {
		this._state.unshift(item);

		this._emit('add', 0, item);
	}

	shift() {
		var removedItem = this._state.shift();

		this._emit('remove', 0, removedItem);

		return removedItem;
	}

	splice(startIndex, removeCount, ...addItems) {
		var removedItems = this._state.splice(startIndex, removeCount, ...addItems);

		removedItems.forEach((item, i) => {
			this._emit('remove', startIndex + i, item);
		});

		addItems.forEach((item, i) => {
			this._emit('add', startIndex + i, item);
		});

		return removedItems;
	}

	get(index) {
		return this._state[index];
	}

	get length() {
		return this._state.length;
	}

	_emit(type, index, item) {
		this._handlers.forEach(fn => {
			fn(type, index, item);
		});
	}
}
