This project was built using Next.js - a node.js framework. I have deceided to use a flat file JSON database (lowdb : https://github.com/typicode/lowdb) to make this application easier to run and to avoid overhead of setting up a database server.

## Getting Started

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


API routes can be accessed on [http://localhost:3000/api/publish/{topic}](http://localhost:3000/api/publish) and [http://localhost:3000/api/subscribe/{topic}](http://localhost:3000/api/subscribe) with the relevant parameters. This endpoint can be edited in `pages/api/publish.ts` and `pages/api/subscribe.ts` respectively.
