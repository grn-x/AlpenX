# AlpenX

## About
See popup text on hosted site

<video width="320" height="180" src="docs/Demo-AlpenX.mp4" type="video/mp4" loop autoplay muted controls>
short installation and usage demo 
</video>

   <video src="docs/Demo-AlpenX.mp4" placeholder="docs/Demo-AlpenX_low-Res" autoplay loop controls muted title="test-title">
    Sorry, your browser doesn't support HTML 5 video.
   </video> 

<!-- https://github.com/microsoft/vscode/issues/177816 -->

### Installation:
because of image optimizations i did along the way and not before the inital pre git commit, the version history is a bit bloated. i eagerly recommend a shallow clone should someone try to work with it

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



This project is licensed under the [GNU General Public License v3.0 (GPLv3)](https://www.gnu.org/licenses/gpl-3.0.html).

## License Summary
- You are free to use, modify, and distribute this project under GPLv3.
- Any modifications or derivatives of this project must also be licensed under GPLv3.

For full license details, refer to the `LICENSE` file in this repository.
