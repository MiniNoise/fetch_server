# fetch_server

## End point

POST /api/v1/minitel
Params {"id":"minitel-1"}
Return { message: 'Minitel created!', minitel_id: minitel._id }

GET /api/v1/:minitel_id
Return all information about this Minitel

POST /api/v1/:minitel_id/flux
Params {"type":"Twitter", "params":"#google, #fire, #lucifer"}'
Return { message: 'Flux created!' }

GET /api/v1/minitel
Return all information about each minitel

GET /api/v1/minitel/flux
Return all flux listen
