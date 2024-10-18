#!/bin/sh

host="$1"
port=$2
shift 2
cmd="$@"

test="nc -zv $host $port"

$test

while [ $? -ne 0 ]
do
  >&2 echo "$host:$port is unavailable - initializing"
  sleep 1

  $test
done

>&2 echo "$host:$port is up - executing command"
