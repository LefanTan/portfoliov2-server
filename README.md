# 1. What is this "Portfolio API"?

[Manager Link](http://[2605:fd00:4:1001:f816:3eff:fe10:f249]/)  
[API Link](http://[2605:fd00:4:1001:f816:3eff:fe10:f249]/api)  
PS: The site are not using the best security practices and https, so I don't recommend storing important information.  
PS: Yeah the link is a funky ipv6 address, Im kinda broke for a domain name
  
    
This NodeJS server is both an API that you can use yourself to **store** some of your portfolio data, and **query** it to your own Portfolio website. This server is also a **manager** in which you can log in, and edit your Portfolio data without needing to clone or redeploy your portfolio website. 

I came into this idea by a suggestion of a friend, Adrian. I was pretty annoyed by the need of editing jsx code and then deploying my website everytime I have any small changes.

Even though this website serves as a practice in Docker, Express, SQL, Semantic HTML and accessiblity, it also solves a real problem of mine as mentioned above.

# 2. How to use 

[API Docs](http://[2605:fd00:4:1001:f816:3eff:fe10:f249]/api-docs/)

To authorize your API requests,


# 3. How the service works

I'm explaining how I implemented some of the features for documenting reasons as well as wanting to receive **constructive** criticism. Keep in mind that this project is done in 3.5 weeks with little experience, kinda rushed.

If you have a suggestion on how to do things better, definitely let me know (by creating an issue etc)

## 3.1. Authentication

There's two ways to authenticate when using the `/api/` endpoints.

1. When using the [portfolio manager](http://[2605:fd00:4:1001:f816:3eff:fe10:f249]/), the react client will receive a JWT token from server with the setting `{ httpOnly: true, sameSite: true}`. The client (axios) when used with `{ withCredientials: true }` will automatically send the jwt token in the request's cookie, authenticating the request. 
   - Takeway: I should store a refresh token in the cookie instead, the access token could then be store in memory. [Reason](https://stackoverflow.com/a/36280559). [Implementation](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/)

2. To authenticate the API, client have to attach a generated API key (it's basically a JWT token with no expiration date) in the Authorization header. This generated API key is stored in the database, when user generate a new one, the old stops working
   - I used JWT to create the API cause I need to encode/decode some data in the key securely. I'm sure there's a better way to generate API keys

## 3.2. Nginx and Docker
Nginx acts a reverse proxy here to redirect api endpoints to the server and anything else to the client. I've also dockerized the SQL server, NGINX server, as well as the API server and react client. 

## 3.3. Error handling and Testing
Not much to be said, they're not done much or well

# 4. Setup the project

1. Download the service account file for Google Storage client and place it in ./api
   - name the json file `service-account.json`

2. Make sure Docker CLI and Docker-Compose is installed
   - Tested for Docker v20.10.7 and Docker-Compose v1.29.2

3. Run `docker-compose up --build` to spin up the containers
   - For production, do `docker-compose -f docker-compose.dev.yml up --build`


# 5. Run tests
Test will always run once during `docker-compose up` in the `test_api` container

To run it again:
`docker start -i test_api`
 - NOTE: `docker-compose up` must be running