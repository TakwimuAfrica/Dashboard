export async function getCharts() {
  return fetch('/wp-json/hurumap-data/charts');
}

export async function createChart() {
  return fetch('/wp-json/hurumap-data/charts', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });
}

export async function updateChart(id, data) {
  return fetch(`/wp-json/hurumap-data/charts/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}
