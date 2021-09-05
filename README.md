# Typescript Google Docs Clone

## Description
A Google Docs Clone project written in Typescript which allows many people to edit a document at the same time.

## Application structure
### Server side
Basic Socket.io server which uses MongoDB to save data, synchronizes data between multiple client opening the same document.

### Client side
React app with Quill text editor.

## Guide

To run the project, follow the instruction below:

### Run the server

    cd server
    yarn start:dev

### Run the client

    cd client
    yarn start



Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Info
This project is based on the tutorial of Web Dev Simplified.\
The tutorial: [How To Build A Google Docs Clone With React, Socket.io, and MongoDB](https://youtu.be/iRaelG7v0OU)

