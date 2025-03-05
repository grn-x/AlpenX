# AlpenX

A static web application featuring an interactive 3-dimensional map with geocoded images connected to a lightbox like gallery 

## About The Project
From the [popup]() on the landing page:
> Um die Erlebnisse unserer Alpencross-Tour zu sammeln und noch einmal nacherleben zu können, habe ich über die letzten Monate diese Website geschrieben.
> <br>
> Einige Aufnahmen habe ich selber geschossen, aber ohne die vielen Zusendungen von euch, hätte ich die Route niemals so schön vervollständigen können.
> <br>
> Vielen Dank an Alexander, Finn, Helena, Jaro, Lukas, Toni, Vijolind und Vincent für das Bereitstellen der Bilder!

This website was created for the "reunion" meeting after our Alpine Crossing tour in Summer of 24.

I wanted to preserve and consolidate the memories of the tour and make them accessible to everyone who participated.
After recreating the route with Finn's help and manually geocoding each image to its respective location on the map, I was able t render the images in a lightbox gallery when a marker is clicked.

When a marker is clicked, a lightbox gallery opens with the images from that location.

<video src="https://github.com/user-attachments/assets/b18dd9e4-dd89-4b64-87fd-5ccb087d3997" loop autoplay muted controls>
short installation and usage demo 
</video>

## Getting Started

### Installing

The repository features three branches:
- `main` - the main branch on which the development started
  - the `public` folder contains the files to be served
  - the remaining directories and files are either documentation or utilities that where used during development, such as the multiple python scripts in`utils`
  - even though it is currently based on the same commit as `gh-pages`, this branch should no longer be used for direct development
- `gh-pages` - In order to host the website on GitHub Pages, the contents of the `public` folder were moved to this branch
  - this then replaced the `main` branch as the default development branch
- `gh-pages-sub` - the branch for the development version of the website
  - Following the concerns of our teacher who was worried about the free availability and resulting overcrowding in the years to come of the carefully chosen route, it was decided 
that security measures should be implemented to prevent the route from being viewed without a password 
  - This branch only differs in said mechanisms, the rest of the code is identical to the `gh-pages` branch
    - Client-Sided Security is nonsensical of course, but it will deter the average user from copying the route
      - Retrospectively I realize that I couldve done this even more efficiently by encrypting the location coded lookup table
and the geojson files, only storing the password hash in code, and on a correct enter, reverse the plaintext password to obtain a
different hash which I couldve used as a private key
      - This wouldve been much more elegant, but the fact that these files are already on my GitHub, means that if someone really wanted, it wouldnt matter if they were to attempt to bypass the lock or decrypt the files, the solution is only one link away anyways
        - To be allowed to host this website I needed to implement weak security measures, that avoid 
           - this branch features the pinnacle of client sided security, as it is not connected to the internet


because of image optimizations i did along the way and not before the inital pre git commit, the version history is a bit bloated. i eagerly recommend a shallow clone should someone try to work with it

That is also the reason why the images in the `public` folder of the main branch are heavily compressed


Example for the prod branch gh-pages:

```
git clone --depth 1 --branch gh-pages https://github.com/grn-x/AlpenX.git Foldername
```

Should a branch switch be desired, one would need to:
```
git remote set-branches origin '*'
git fetch -v --depth 1 
git checkout gh-pages-sub
```

### Prerequisites

This project is a static web application, so it can be hosted on any web server that supports HTML, CSS, and JavaScript.

To serve the files locally, I use, depending on the environment, either node js `http-server`

```
npm install http-server -g    # -g for global installation since this is a CLI tool

http-server ./ ;cls           # when in either pages-branch -> serve the current directory and clear the console on windows
http-server ./public ;cls     # when in main branch -> serve the public directory and clear the console on windows
```

Or python's `http.server`

```
python -m http.server                      # when in either pages-branch -> serve the current directory
python -m http.server --directory public   # when in main branch -> serve the public directory
```
crtl + c to stop the server on windows

### Dependencies

The project uses the following libraries:
- Chart.js - for the elevation profile
- CesiumJS - for the interactive dynamic 3D map
- Lightgallery - for the lightbox gallery
- model-viewer - for the 3D model viewer used as a static map fallback option in case the CesiumJS map fails to load 

All dependencies have local copies in the `dist` folder, that are, except for the model-viewer library, automatically loaded in case of cdn failures.


### Entry-Point

The index.html's main.js script is the invocation source for the application.
I left meaningful comments and every function is explained using JSDoc. (Which is a dumb thing to do, given that I dont minify the code before deployment)

Navigating through the code should be straight forward, as I tried to keep it as clean and readable as possible.


## Help

If you have any questions, feel absolutely free to open an issue or contact me directly at <grnx-git@gmail.com>

## License
As a direct consequence of the usage of not only CesiumJS but also Cesium Ion and underlying datasets, this project is required to published under the same license.
Therefore, this project is licensed under the [GNU General Public License v3.0 (GPLv3)](https://www.gnu.org/licenses/gpl-3.0.html).

###  Summary
- You are free to use, modify, and distribute this project under GPLv3.
- Any modifications or derivatives of this project must also be licensed under GPLv3.

For full license details, refer to the `LICENSE` file in this repository.
