const pull = require('./index');
const test = require('tape');

test('it acts as noop when given 0', t => {
    let upData = [];
    let downData = [];
    let talkback;
    let terminationData;
    
    const inputSource = (start, sink) => {
        if (start !== 0) return;
        sink(0, (t, d) => {
            if (t === 0) d(0, inputSource);
            if (t === 1) {
                upData.push(d);
                if (typeof d === 'number') sink(1, -d);
                else                       sink(2, 'not a number')
            }
            if (t === 2) terminationData = d;
        });
    };
    
    pull(0)(inputSource)(0, (t, d) => {
        if (t === 0) {
            talkback = d;
            for (let i = 0; i < 3; i++) talkback(1, i);
            talkback(1, 'stop');
        }
        if (t === 1) downData.push(d);
        if (t === 2) terminationData = d;
    });
    t.deepEqual(upData, [0, 1, 2, 'stop'], 'forwards all pulls');
    t.deepEqual(downData, [0, -1, -2], 'forwards all data items');
    t.equal(terminationData, 'not a number', 'forwards downward termination');

    upData = [];
    downData = [];
    terminationData = null;

    pull(0)(inputSource)(0, (t, d) => {
        if (t === 0) {
            talkback = d;
            for (let i = 0; i < 3; i++) talkback(1, i);
            talkback(2, 'stop');
        }
        if (t === 1) downData.push(d);
        if (t === 2) terminationData = d;
    });
    t.deepEqual(upData, [0, 1, 2], 'forwards all pulls');
    t.deepEqual(downData, [0, -1, -2], 'forwards all data items');
    t.equal(terminationData, 'stop', 'forwards upward termination');

    t.end();
});

test('it sinds the given number of additional pulls', t => {
    let pullsReceived = 0;
    let downData = [];
    let talkback = (t, d) => {};
    let terminated;
    
    const inputSource = (start, sink) => {
        if (start !== 0) return;
        sink(0, (t, d) => {
            if (t === 0) d(0, inputSource);
            if (t === 1) {
                if (++pullsReceived < 6) sink(1, pullsReceived);
                else                     sink(2)
            }
        });
    };
    
    pull(3)(inputSource)(0, (t, d) => {
        if (t === 0) {
            talkback = d;
            for (let i = 0; i < 3; i++) talkback(1);
        }
        if (t === 1) downData.push(d);
        if (t === 2) terminated = true;
    });
    t.deepEqual(pullsReceived, 6, 'forwards all pulls and adds own');
    t.deepEqual(downData, [1, 2, 3, 4, 5], 'forwards all data items');
    t.ok(terminated, 'forwards downward termination');

    t.end();
});
