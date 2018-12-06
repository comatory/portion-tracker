
# Development

Server / backend app is stored in the root directory. This app is served on port `3000`.

Frontend app is stored in `frontend/` directory and is served on port `3001`

## Requirements

- Node.js 8.10.0
- PostgreSQL 10.4
- screen (optional)

## Installation

Set permissions for `install.sh`, `run.sh` and `kill.sh` like this:

```
chmod +x install.sh
chmod +x run.sh
chmod +x kill.sh
```

__Never__ run these commands in production, they're intended only for development purposes.

You must install both apps to launch them locally. For this run shell script `install.sh`.
After this you can start up both development servers (backend & frontend) by running `. ./run.sh`. 

## Env file

You should create your own `.env` file in the root directory. Check `.env.example` for the variables
that you'll need. 

## Running development servers

Recommended way to run the servers is to launch `./run.sh screen`. You can attach to sessions that were created within the run script.
These sessions have all the output available to them. Using `screen` has the advantage of those screen sessions being available in any terminal session.

_NOTE_: You can attach by using command: `screen -x SCREEN_SESSION_ID`. If you _CTRL+C_ there, it will also terminate the server. Type `screen -ls` to list all screens.

If you don't have `screen` installed or you prefer looking at logs directly, just run `. ./run.sh`.

__NOTICE__: Don't forget the dot `.` before the name of the script, otherwise the kill script will not work.

The terminal session that you used to launch this command is still attached to the process so do not terminate it. You can get the logs from the `logs/` directory.
For example, you could probably run `tail -f ./logs/frontend.log` to get output from frontend server.

## Stopping development servers

If you've used `./run.sh screen` you should terminate the servers from within the screen session.
If you've used jut `. ./run.sh`, then press ^C in the terminal session. This should get you to prompt, terminate the processes by launching `kill.sh`.
To see the PIDs directly, they will be stored in environment variables: `PT_BACKEND_PROCESS` and `PT_FRONTEND_PROCESS`.

### Install & run manually

Alternatively, you can just install & launch apps from within their respective directories. Run `npm install` in root and then cd to `frontend/` and run `npm install` there as well.

For backend, run the app in dev mode: `npm run start:dev`. For frontend, go to `frontend/` and launch `npm run start`.

### Debugging development server

There is a script to run back end server with `--inspect` option. It'll run `nodemon` on port `12345`. You can attach to this port in _Visual Studio Code_ using the configuration `.vscode/launch.json`.

# Deployment

The `package.json` file is set up to work with Heroku service. Feel free to modify this to your needs.
If you want to preview the production frontend app in development backend server, run `npm run heroku-postbuild`.
This will build the frontend app and place it into `public/` directory, the backend server then reads it from there.

## Heroku

This app was designed to work with Heroku service and their PostgreSQL add-on. Do not forget to set up
env variable `SESSION_SECRET` on your Heroku instance (see also `.env.example` file).
This variable will set up password on the session store.

## Staging

To deploy to staging server, run `npm run deploy:staging`.

## Production

To deploy to staging server, run `npm run deploy:production`.

## Required data / Seeds

After the first deployment of the app, you should most likely run `heroku run db:seed` which will
run all seeds located in `./seeders`. This sets up default roles and other data required for the
proper functioning of the app (including the admin user).
Feel free to modify this for your needs.

## Email

App uses Sendgrid service to implement emails. There is only single email that gets delivered to user and that is to verify signed up user. You need to have Sendgrid account and provide variables `SENDGRID_API_KEY` with your API key and `SENDGRID_APP_EMAIL` for the app email (sender). 