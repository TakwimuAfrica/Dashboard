export async function getCharts() {
  return fetch('/wp-json/hurumap-data/charts');
}

export async function updateOrCreateChart(data) {
  return fetch(`/wp-json/hurumap-data/charts`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}
