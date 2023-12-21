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
EXPOSE 5000

ENV  NODE_ENV "development"
ENV PORT "5000"
ENV MONGO_URL "mongodb+srv://flavia:flavia@workflowcluster.zwjd3.mongodb.net/workflowapp?retryWrites=true&w=majority"
ENV JWT_PASS "worflowapp"
ENV EMAIL_SERVICE "SendGrid"
ENV EMAIL_USERNAME "apikey"
ENV EMAIL_PASSWORD "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"
ENV EMAIL_FROM "zahariaflavia@gmail.com"

# Command to start the Node.js server
CMD ["npm", "start"]