const aggregateFunc = {
  sum: data => data.reduce((a, b) => a + b.y, 0),
  max: data => data.reduce((a, b) => (a > b.y ? a : b.y), 0),
  min: data => data.reduce((a, b) => (a < b.y ? a : b.y), 0),
  avg: data => data.reduce((a, b) => a + b.y, 0) / data.length,
  first: data => data[0].y,
  last: data => data[data.length - 1].y
};

export default function aggregateData(func, data, unique = true) {
  const reduced = {};
  if (unique) {
    const uniqueX = [...new Set(data.map(d => d.x))];
    uniqueX.forEach(x => {
      reduced[x] = {
        x,
        y: aggregateFunc[func](data.filter(d => d.x === x))
      };
    });
  } else {
    reduced[0] = {
      x: func,
      y: aggregateFunc[func](data)
    };
  }

  return Object.values(reduced);
}
