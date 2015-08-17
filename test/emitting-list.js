var EmittingList = require('../');

var assert = require('assert');


describe('EmittingList', function() {
	it('is creatable', function() {
		var el = new EmittingList();

		assert(el instanceof EmittingList);
	});

	it('has a get method', function() {
		var el = new EmittingList();

		assert(el.get);
	});

	it('has an onChange method', function() {
		var el = new EmittingList();

		assert(el.onChange);
	});

	it('has a push method', function() {
		var el = new EmittingList();

		assert(el.push);
	});

	it('has a pop method', function() {
		var el = new EmittingList();

		assert(el.pop);
	});

	it('has a unshift method', function() {
		var el = new EmittingList();

		assert(el.unshift);
	});

	it('has a shift method', function() {
		var el = new EmittingList();

		assert(el.shift);
	});

	it('has a splice method', function() {
		var el = new EmittingList();

		assert(el.splice);
	});

	it('can initialize with a list', function() {
		var el = new EmittingList([4, 5, 1]);

		assert.equal(el.get(0), 4);
		assert.equal(el.get(1), 5);
		assert.equal(el.get(2), 1);
	});

	it('has a length property', function() {
		var el = new EmittingList([4, 5, 1]);

		assert.equal(el.length, 3);
	});

	it('can append items', function() {
		var el = new EmittingList();

		el.push('test');

		assert.equal(el.get(0), 'test');
	});

	it('can remove items from end', function() {
		var el = new EmittingList([false, true]);

		assert.equal(el.pop(), true);

		assert(!el.get(1));
	});

	it('can prepend items', function() {
		var el = new EmittingList([5, 6]);

		el.unshift(8);

		assert.equal(el.get(0), 8);
	});

	it('can remove items from start', function() {
		var el = new EmittingList([5, 6]);

		assert.equal(el.shift(), 5);

		assert.equal(el.get(0), 6);
	});

	it('can splice items out', function() {
		var el = new EmittingList([5, 6, 2, 't']);

		assert.deepEqual(el.splice(1, 2), [6, 2]);

		assert.equal(el.get(0), 5);
		assert.equal(el.get(1), 't');
		assert(!el.get(2));
	});

	it('can splice items in', function() {
		var el = new EmittingList([5, 6]);

		assert.deepEqual(el.splice(1, 0, true, 'grow'), []);

		assert.equal(el.get(0), 5);
		assert.equal(el.get(1), true);
		assert.equal(el.get(2), 'grow');
		assert.equal(el.get(3), 6);
		assert(!el.get(4));
	});

	it('emits events when listened to', function(done) {
		var el = new EmittingList([1, 4]);

		var total = 0;
		el.onChange(function(type, index, item) {
			assert.equal(type, 'add');

			total += item;

			if(total === 5) {
				done();
			}
		});
	});

	it('emits an event when pushed', function(done) {
		var el = new EmittingList();

		el.onChange(function(type, index, item) {
			assert.equal(type, 'add');
			assert.equal(index, 0);
			assert.equal(item, 3);

			done();
		});

		setTimeout(function() {
			el.push(3);
		}, 10);
	});

	it('emits an event when popped', function(done) {
		var el = new EmittingList([4]);

		el.onChange(function(type, index, item) {
			if(type === 'add') return;

			assert.equal(type, 'remove');
			assert.equal(index, 0);
			assert.equal(item, 4);

			done();
		});

		el.pop();
	});

	it('emits an event when unshifted', function(done) {
		var el = new EmittingList();

		el.onChange(function(type, index, item) {
			assert.equal(type, 'add');
			assert.equal(index, 0);
			assert.equal(item, 3);

			done();
		});

		el.unshift(3);
	});

	it('emits an event when shifted', function(done) {
		var el = new EmittingList([4]);

		el.onChange(function(type, index, item) {
			if(type === 'add') return;

			assert.equal(type, 'remove');
			assert.equal(index, 0);
			assert.equal(item, 4);

			done();
		});

		el.shift();
	});

	it('emits events when spliced', function(done) {
		var el = new EmittingList([4, 2, 8, 3]);

		var addTotal = 0;
		var removeTotal = 0;
		el.onChange(function(type, index, item) {
			if(type === 'add') {
				addTotal += item;
			} else {
				removeTotal += item;
			}

			if(addTotal === 29 && removeTotal === 10) {
				done();
			}
		});

		el.splice(1, 2, 5, 7);
	});
});
