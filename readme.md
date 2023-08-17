# openSenseMap Mailer

This project is the mailer used by the [openSenseMap-API](https://github.com/sensebox/openSenseMap-API) and other services in the openSenseMap stack. The mailer is a queue based system powered by Redis.

## Getting Started

First, install the dependencies:

```sh
npm install
# or
yarn
```

Copy the `.env.exmaple` file and adjust the environment variables:

```sh
cp .env.example .env
```

This repository also includes a [Redis Stack](https://redis.io/docs/stack/about/) and can be fired up with Docker:

```sh
docker compose up -d
```

> To configure Redis use the included `local-redis-stack.conf`.

Open [localhost:8001](http://localhost:8001) with your browser and connect to Redis Insight.

## Development

### Adding or changing mail templates

Templates are located within this repository under the `emails` folder. We use [react email](https://react.email/) to create our email templates. Please read the [react email docs](https://react.email/docs/introduction) before adding new templates.

What´s really cool about _react email_ is you get a live preview for the templates and you don´t need to keep sending real emails during development.

To start the live preview run:

```sh
npm run studio
# or
yarn studio
```

Open [localhost:3000](http://localhost:3000) with your browser to see the template previews.

### Mailer service

The source code for the actual mailer service is located within the `src` folder. The mailer uses the following technologies:

- [BullMQ](https://bullmq.io/) (robust queue system built on top of Redis)
- [Nodemailer](https://nodemailer.com/about/) (email sending package)

## License

[MIT License](./LICENSE)
