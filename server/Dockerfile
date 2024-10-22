# Use the official Node.js image as the base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy .env file
COPY .env .

# Set environment variables
ENV $(cat .env | xargs)

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "start"]