- [1. What is this "Portfolio API"?](#1-what-is-this-portfolio-api)
- [2. How to use](#2-how-to-use)
- [3. How the service works](#3-how-the-service-works)
  - [3.1. Authentication](#31-authentication)
  - [3.2. Nginx and Docker](#32-nginx-and-docker)
  - [3.3. Error handling and Testing](#33-error-handling-and-testing)
  - [3.4. Accessiblity](#34-accessiblity)
- [4. Setup the project](#4-setup-the-project)
- [5. Run tests](#5-run-tests)

# 1. What is this "Portfolio API"?

Manager Link -> https://[2605:fd00:4:1001:f816:3eff:fe10:f249]  
API Link -> https://[2605:fd00:4:1001:f816:3eff:fe10:f249]/api    

PS: Yeah the link is a funky ipv6 address, Im kinda broke for a domain name
  
    
This NodeJS server is both an API that you can use yourself to **store** some of your portfolio data, and **query** it to your own Portfolio website. This server is also a **manager** in which you can log in, and edit your Portfolio data without needing to clone or redeploy your portfolio website. 

I came into this idea by a suggestion of a friend, Adrian. I was pretty annoyed by the need of editing jsx code and then deploying my website everytime I have any small changes.

Even though this website serves as a practice in Docker, Express, SQL, Semantic HTML and accessiblity, it also solves a real problem of mine as mentioned above.

# 2. How to use 

API Docs -> https://[2605:fd00:4:1001:f816:3eff:fe10:f249]/api-docs/

To authorize your API requests, send your requests with the `Authorization` header containing your generated API key, which can be done through the manager.

Note that you can only request for projects/profile that belongs to you, if you try to request for information that doesn't belong to you, you'll get a `401 error`

# 3. How the service works

I'm explaining how I implemented some of the features for documenting reasons as well as wanting to receive **constructive** criticism. Keep in mind that this project is done in 3.5 weeks with little experience, kinda rushed.

If you have a suggestion on how to do things better, definitely let me know (by creating an issue etc)

## 3.1. Authentication

There's two ways to authenticate when using the `/api/` endpoints.

1. When using the portfolio manager, the react client will receive a JWT token from server with the setting `{ httpOnly: true, sameSite: true}`. The client (axios) when used with `{ withCredientials: true }` will automatically send the jwt token in the request's cookie, authenticating the request. 
   - Takeway: I should store a refresh token in the cookie instead, the access token could then be store in memory. [Reason](https://stackoverflow.com/a/36280559). [Implementation](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/)

2. To authenticate the API, client have to attach a generated API key (it's basically a JWT token with no expiration date) in the Authorization header. This generated API key is stored in the database, when user generate a new one, the old stops working
   - I used JWT to create the API cause I need to encode/decode some data in the key securely. I'm sure there's a better way to generate API keys

## 3.2. Nginx and Docker
Nginx acts a reverse proxy here to redirect api endpoints to the server and anything else to the client. I've also dockerized the SQL server, NGINX server, as well as the API server and react client. 

## 3.3. Error handling and Testing
Not much to be said, they're not done much or well

## 3.4. Accessiblity
I tried my best to use as much semantics html as possible, but there are cases where I couldn't and I didn't use aria attributes, I would like to keep working on this (definitely should have used lighthouse more)

However, I did try following some good practices, such as having *strong contrast*, making sure *every interactive element is focusable*, *responsive design* etc.

# 4. Setup the project

1. Download the service account file for Google Storage client and place it in ./api
   - name the json file `service-account.json`

2. make a copy of `.env.example` in `/api` as `.env` and fill in appropriate info

3. Make sure Docker CLI and Docker-Compose is installed
   - Tested for Docker v20.10.7 and Docker-Compose v1.29.2

4. Run `docker-compose up --build` to spin up the containers
   - For production, do `docker-compose -f docker-compose.dev.yml up --build`

5. Create a SSL certificate `openssl req -new -newkey rsa:4096 -x509 -sha256 -days 770 -nodes -out nginx-certificate.crt -keyout nginx.key`

# 5. Run tests
Test will always run once during `docker-compose up` in the `test_api` container

To run it again:
`docker start -i test_api`
 - NOTE: `docker-compose up` must be running
