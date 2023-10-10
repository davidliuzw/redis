# redis example
A simple node js app to show the power of redis cache.
To see for yourself
Run node server_with_redis.js in the terminal, open the postman and use a GET request to http://localhost:3000/photos.
<img width="790" alt="image" src="https://github.com/davidliuzw/redis/assets/79090372/fc1b6323-d878-44f4-b7eb-185780758124">

You can see the first time it took 129ms to retrive the data. 

Run for the second time, and you can see it only took 22ms, which is way much faster.
<img width="790" alt="image" src="https://github.com/davidliuzw/redis/assets/79090372/2f1e5c77-2cdb-4835-b556-6eb8414ae248">

You can also see this log in the console and check for the keys in redis-cli.
<img width="1008" alt="image" src="https://github.com/davidliuzw/redis/assets/79090372/0c5bc8d3-c5a5-495b-84f5-7b230847b533">


