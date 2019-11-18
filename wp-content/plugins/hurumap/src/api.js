export async function getCharts() {
  return fetch('/wp-json/hurumap-data/charts');
}

export async function updateOrCreateHurumapChart(data) {
  return fetch(`/wp-json/hurumap-data/charts`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

export async function updateOrCreateChartsSection(data) {
  return fetch(`/wp-json/hurumap-data/sections`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

export async function updateOrCreateFlourishChart(data) {
  return fetch(`/wp-json/hurumap-data/flourish`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

export async function saveFlourishChartInMedia(data) {
  return fetch(`/wp-json/hurumap-data/store/flourish`, {
    method: 'POST',
    body: data
  });
}

export async function deleteFlourishChart(data) {
  return fetch(`/wp-json/hurumap-data/flourish`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: data })
  });
}

export async function deleteChartSection(data) {
  return fetch(`/wp-json/hurumap-data/sections`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}
