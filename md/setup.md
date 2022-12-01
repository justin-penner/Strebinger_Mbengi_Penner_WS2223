# Setup

1. Clone the repository:

    ```terminal
        git clone https://github.com/justin-penner/Strebinger_Mbengi_Penner_WS2223.git
    ```

2. Setup the database

- Open the terminal and run:

    ```terminal
    docker-compose up
    ```
- Open a new terminal and run:

    ```console
    docker exec -ti -u postgres travel psql
    ```

- Now open a new terminal and run:

    ```terminal
        cd js
        node app.js
    ```