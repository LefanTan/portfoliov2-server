# What is this "Portfolio API"?

This NodeJS server is both an API that you can use yourself to **store** some of your portfolio data, and **query** it to your own Portfolio website. This server is also a **manager** in which you can log in, and edit your Portfolio data without needing to clone or redeploy your portfolio website. 

I came into this idea by a suggestion of a friend, Adrian. I was pretty annoyed by the need of editing jsx code and then deploying my website everytime I have any small changes.

Even though this website serves as a practice in Docker, Express, SQL, Semantic HTML and accessiblity, it also solves a real problem of mine as mentioned above.

# How the service works

I'm explaining how I implemented some of the features for documenting reasons as well as wanting to receive **constructive** criticism.

If you have a suggestion on how to do things better, definitely let me know (by creating an issue etc)

## Authentication

There's two ways to authenticate when using the `/api/` endpoints.

# Setup

1. Download the service account file for Google Storage client and place it in ./api
   - name the json file `service-account.json`

2. Make sure Docker CLI and Docker-Compose is installed
   - Tested for Docker v20.10.7 and Docker-Compose v1.29.2

3. Run `docker-compose up --build` to spin up the containers


# Run tests
Test will always run once during `docker-compose up` in the `test_api` container

To run it again:
`docker start -i test_api`
 - NOTE: `docker-compose up` must be running