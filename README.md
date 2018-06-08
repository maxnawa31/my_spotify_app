Welcome to my Spotify application. This application's sole purpose is to demonstrate just a little bit
of what the Spotify API is capable of.

Some boiler plate code that I used to make the accessibility of the API a little easier:

Use this repo as a boiler plate backend:
1) https://github.com/spotify/web-api-auth-examples


Use this repo in order to make API calls easier:
2) https://github.com/JMPerez/spotify-web-api-js

Once you have both of these repos, it is really up to you as to what front-end
framework you would like to use.

It is also necessary to register your project on Spotify in order to gain access to
unique client_id, client_secret and to authorize your redirect_uri.

1) User goes to localHost: 3000
2) User clicks "login with Spotify"
3) User is then taken to localHost:8888 which will prompt the user to login with their spotify credentials.
4) User gets token and is redirected back to localHost:3000
5) Now user can view their playlists and songs.

