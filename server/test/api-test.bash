#!/bin/bash

if [ -f .env ]; then
  set -o allexport
  source .env
  set +o allexport
fi

echo "Route /api/users/login"
echo "Test case 1, expects: User could not be found with that email"

curl -X POST http://localhost:3005/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "jonas@jonas.jonas", "password": "jonas"}'

echo "Test case 2, expects: Login succsessful\n"

curl -X POST http://localhost:3005/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "albin@albin.se", "password": "albin"}'
