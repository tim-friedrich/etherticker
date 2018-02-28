# etherticker

## start redis
redis-server

## Run server
rails s

## Run resque
QUEUE=* rake resque:work

## Run resque scheduler
QUEUE=* rake resque:scheduler
