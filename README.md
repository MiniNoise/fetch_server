# fetch_server

## END POINT

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

## Exemple

``` bash
curl -d '{"id":"minitel-1"}' -H "Content-Type: application/json" -X POST http://localhost:3000/api/minitel/new
curl -H "Content-Type: application/json" -X GET http://localhost:3000/api/minitel/info/5ced7af44837ab0105e9dcd1
curl -d '{"type":"Twitter", "params":"#google, #fire, #lucifer"}' -H "Content-Type: application/json" -X POST http://localhost:3000/api/5d077b55026d0200424711f2/flux
```
