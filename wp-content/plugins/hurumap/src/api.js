export async function getCharts() {
  return fetch('/wp-json/hurumap-data/charts');
}

export async function saveFlourishChartInMedia(data) {
  return fetch(`/wp-json/hurumap-data/store/flourish`, {
    method: 'POST',
    body: data
  });
}
