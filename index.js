const pull = n => source => (start, sink) => {
    if (start !== 0) return;
    let pullsLeft = n;
    source(0, (type, data) => {
        if (type === 0) {
            sink(0, (t, d) => {
                if (t === 2) pullsLeft = 0;
                data(t, d);
            });
            while (pullsLeft-- > 0) data(1);
        }
        if (type === 2) pullsLeft = 0;
        if (type === 1 || type === 2) sink(type, data);
    });
};

module.exports = pull;