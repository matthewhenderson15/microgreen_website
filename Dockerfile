# Pull the latest node image
FROM node:latest

# Expose ports
EXPOSE 3000
EXPOSE 35729

# Set working directory
WORKDIR /microgreen_website

# Add /app/node_modules/.bin to environment variables
ENV PATH /microgreen_website/node_modules/.bin:$PATH

# Copy package files and install app dependencies
COPY package.json /microgreen_website/package.json
COPY package-lock.json /microgreen_website/package-lock.json
RUN npm install
RUN npm install react-scripts -g

# Add React app to the working directory
ADD . /microgreen_website

# Start the React app
CMD ["yarn", "start"]
CMD ["yarn", "start-api"]