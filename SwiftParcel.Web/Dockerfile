# # Use the official Node.js 18 image as a base image
# FROM node:18

# # Set the working directory in the container
# WORKDIR /usr/src/app

# # Navigate to the frontend directory and copy package.json files
# COPY ./frontend/package*.json ./

# # Install the project dependencies
# RUN npm install --legacy-peer-deps

# # Copy the rest of the frontend directory into the container
# COPY ./frontend/ .

# # Make port 3001 available to the world outside this container
# EXPOSE 3001

# # Define the command to run your app using CMD which defines your runtime
# CMD ["npm", "start"]


# Build stage
FROM node:18 as build-stage
WORKDIR /usr/src/app
COPY ./frontend/package*.json ./
COPY ./frontend/ .
RUN npm install  --legacy-peer-deps
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html

# If you have a custom Nginx config, uncomment the next line and add your nginx.conf file
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]

