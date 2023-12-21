# Use a base image with Node.js
FROM node:14-alpine

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the server code to the container
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to start the Node.js server
CMD ["npm", "start"]