# AlpenX


![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=flat&logo=GitHub%20Pages&logoColor=white)
![CesiumJS](https://img.shields.io/badge/CesiumJS-blue.svg)
![Chart.js](https://img.shields.io/badge/Chart.js-pink.svg)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E)
![GitHub license](https://img.shields.io/badge/license-GPL--3.0-blue.svg)

A static web application featuring an interactive 3-dimensional map with geocoded images connected to a lightbox gallery.

The gh-pages branch is currently deployed at [grn-x.github.io/AlpenX](https://grn-x.github.io/AlpenX/),
the gh-pages-sub branch is on track to get officially hosted over the school's servers.

## 📖 About The Project

This project began as a way to preserve and consolidate memories from our Alpine Crossing in July '24. The website features a 3D interactive map with geocoded images that can be viewed in a lightbox like gallery when clicking on map markers.

From the [popup](https://github.com/grn-x/AlpenX/blob/main/public/intro.html) on the landing page:
> Um die Erlebnisse unserer Alpencross-Tour zu sammeln und noch einmal nacherleben zu können, habe ich über die letzten Monate diese Website geschrieben.
> <br>
> Einige Aufnahmen habe ich selber geschossen, aber ohne die vielen Zusendungen von euch, hätte ich die Route niemals so schön vervollständigen können.
> <br>
> Vielen Dank an Alexander, Finn, Helena, Jaro, Lukas, Toni, Vijolind und Vincent für das Bereitstellen der Bilder!

<details>
<summary><a href="https://www.youtube.com/watch?v=6i8zwVIFxQg&list=OLAK5uy_ntyTKmPtSuVGCKd7FPfc7ep68vIobe9VE&index=3"> The Downward Spiral</a> </summary>
Another motivation for the project was the upcoming reunion a few months after the tour. I not only received plenty of great images
and materials to fill the site with but also a ton of help from my friends, especially Finn, with whom I was able to reconstruct the route.

I naively thought all that was left to do was geocode the images to their respective locations.

Literally hundreds of hours later -- lost in an endless cycle of bug discovery -> hotfix -> trust-issue-induced bug hunting -- and after stressing out about missing countless self-imposed deadlines, I somehow got the project running in a presentable state, in the very last night before the reunion of course.

After sacrificing two nights of sleep, I made a desperate last-ditch attempt to call in sick, hoping to catch up on rest before the presentation. But my parents were having none of it. This resulted in an still ongoing war with them, much to the amusement of my friends and teachers.
</details>



### ✨ Features

- Interactive 3D map of the Alpine Crossing route
- Geocoded images connected to map markers
- Lightbox gallery for viewing images from each location
- Elevation profile using Chart.js

### 🎬 Demo

<video src="https://github.com/user-attachments/assets/b18dd9e4-dd89-4b64-87fd-5ccb087d3997" loop autoplay muted controls>
Short installation and usage demo 
</video>

## 🚀 Getting Started



### Installation

The repository features three branches:

1. `main` - The original development branch
  - The `public` folder contains files to be served
  - Other directories contain documentation and development utilities
  - Following the push to GitHub, `gh-pages` was created to resolve the need for a dedicated deployment branch, replacing main as the development environment in the process.
  - No longer used for direct development (currently based on the same commit as `gh-pages`)

2. `gh-pages` - The production branch for GitHub Pages hosting
  - Contents of the `public` folder were moved here
  - Current default development branch

3. `gh-pages-sub` - Development version with security measures
  - Implements password protection to prevent unrestricted route access
  - Identical code to `gh-pages` except for security mechanisms
  - Client-side security implemented as a deterrent for average users

Due to image optimizations done throughout development, the version history is bloated. A shallow clone is recommended:

```bash
# Example for the production branch (gh-pages)
git clone --depth 1 --branch gh-pages https://github.com/grn-x/AlpenX.git Foldername
```

To switch branches after a shallow clone:

```bash
git remote set-branches origin '*'
git fetch -v --depth 1 
git checkout gh-pages-sub
```


### Prerequisites

This project is a static web application that can be hosted on any web server supporting HTML, CSS, and JavaScript.

To serve the files locally, I used, depending on the environment either:

#### Node.js `http-server`

```bash
# Global installation because this is a CLI tool
npm install http-server -g

# When in either pages-branch
http-server ./ ;cls

# When in main branch
http-server ./public ;cls
```

#### Python's `http.server`

```bash
# When in either pages-branch
python -m http.server

# When in main branch
python -m http.server --directory public
```

Use `Ctrl + C` to stop the server.

### Dependencies

The project uses the following libraries:

- **Chart.js** - For the elevation profile
- **CesiumJS** - For the interactive dynamic 3D map
- **Lightgallery** - For the lightbox gallery
- **model-viewer** - For the 3D model viewer (fallback if CesiumJS fails)

All dependencies have local copies in the `dist` folder and are automatically loaded if CDN fails (except for model-viewer (find out why in the rage-filled comments i left behind)).

## 🔍 Technical Details

### Entry Point

The `index.html`'s `main.js` script is the invocation source for the application. All functions are documented using JSDoc comments to facilitate easy navigation through the code.

### Note on Security Implementation

Following the concerns of our teacher who was worried about the free availability and therefore possible overcrowding in the years to come of the carefully chosen route, it was decided that security measures should be implemented to prevent the route from being viewed without a password.

Client-Sided Security is nonsensical of course, but it will deter the average user from copying the route. If you are among the 3 people that found their way here and are knowledgeable enough to reproduce the development environment, given these resources, you would've also been able to bypass the lock; this defeats the purpose.

Retrospectively I realize that I could've solved all of this much more securely by encrypting the location coded lookup table and the geojson files, only storing the password hash in code, and on a correct entry, reverse the plaintext password to obtain a different hash which I could've used as a private key.
But then again, everythings already on GitHub, soo...


## ❓ Help

If you have any questions, feel free to [open an issue](https://github.com/grn-x/AlpenX/issues) or don't hesitate to contact me directly at <grnx-git@gmail.com>.

## 📄 License

This project is licensed under the [GNU General Public License v3.0 (GPLv3)](https://www.gnu.org/licenses/gpl-3.0.html), as required not by the use of CesiumJS, but rather Cesium Ion, and underlying datasets.

### Summary
- You are free to use, modify, and distribute this project under GPLv3
- Any modifications or derivatives must also be licensed under GPLv3

For full license details, refer to the `LICENSE` file in this repository.