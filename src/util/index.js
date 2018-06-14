export const retrieveCustomers = function (key, customers) {
  let items = [];
  for (let key in customers) {
    items.push({
      uid: key,
      name: customers[key].name,
      description: customers[key].description,
    });
  }
  return items
}

export const retrieveLots = function (key, models) {
  let items = [];
  for (let key in models) {
    items.push({
      uid: key,
      name: models[key].name,
      description: models[key].description,
      contractor: models[key].contractor,
      dateInit: models[key].dateInit,
      dateEnd: models[key].dateEnd,
      createAt: models[key].createAt,
      amount: models[key].amount,
    });
  }
  return items
}

export const retrieveStore = function (key, models) {
  let items = [];
  for (let key in models) {
    items.push({
      uid: key,
      nroSerie: models[key].nroSerie,
      model: models[key].model,
      nroInventario: key,
      createAt: models[key].createAt,
    });
  }
  return items
}