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