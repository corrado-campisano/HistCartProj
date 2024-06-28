

export const vaiAllaHome = (navigate, token) => {
	navigate("/", { headers: { "Authorization": `Bearer ${token}` } });
};

export const vaiAllaMappa = (navigate, token) => {
	navigate("/mappa/", { headers: { "Authorization": `Bearer ${token}` } });
};

export const vaiEventiStorici = (navigate, token) => {
	navigate("/eventiStorici/", { headers: { "Authorization": `Bearer ${token}` } });
};
export const vaiEventoStorico = (navigate, token, id) => {
	navigate("/eventoStorico/" + id, { headers: { "Authorization": `Bearer ${token}` } });
};

export const vaiLeggendeCorrelate = (navigate, token) => {
	navigate("/leggendeCorrelate/", { headers: { "Authorization": `Bearer ${token}` } });
};
export const vaiLeggendaCorrelata = (navigate, token, id) => {
	navigate("/leggendaCorrelata/" + id, { headers: { "Authorization": `Bearer ${token}` } });
};

export const vaiGeoEntitiesPartenza = (navigate, token) => {
	navigate("/geoEntitiesPartenza/", { headers: { "Authorization": `Bearer ${token}` } });
};
export const vaiGeoEntityPartenza = (navigate, token, id) => {
	navigate("/geoEntityPartenza/" + id, { headers: { "Authorization": `Bearer ${token}` } });
};

export const vaiGeoEntitiesArrivo = (navigate, token) => {
	navigate("/geoEntitiesArrivo/", { headers: { "Authorization": `Bearer ${token}` } });
};
export const vaiGeoEntityArrivo = (navigate, token, id) => {
	navigate("/geoEntityArrivo/" + id, { headers: { "Authorization": `Bearer ${token}` } });
};