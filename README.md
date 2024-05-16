# How to start (deploy - [https://es-events-client.vercel.app/](https://es-events-client.vercel.app/))

```npm run dev```

server - [localhost:3000](http://localhost:3000)

client - [localhost:5173](http://localhost:5173)

## Environment variables
apps/api/.env:
```
DATABASE_URL="postgresql://<name>:<password>@<host>/<database>?schema=public"
```

apps/client/.env:
```
NODE_ENV=development
VITE_NODE_ENV=
VITE_PUBLIC_API_URL=
```
