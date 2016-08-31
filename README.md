# React Native Katas: Prototype

`HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK`

Only use this if you know what you're doing.

`HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK`

This project was the prototype for React Native Katas. It was done using
Facebook's internal UI testing framework.


## Quick Start

Unfortunately it wouldn't be quick. but:

1. Clone this project
2. cd
3. npm i
4. open xcode and build the project, make sure packager starts up
5. cd ios
6. node runner.js

Now, make edits to `IntegrationTests/DefaultLayoutTest.js` to change its visuals

FBK will pickup the file change and run:

1. Vanilla xcode tests, which uses FB's own native test snapshotting
2. It will parse results and look for the images as well as test result
3. Compare images
4. Generate an animated gif, showing the differences

If there wasn't any difference (i.e. tests succeed) there isn't anything happening.


## Notes

This should be expanded on but:

1. FB UI tests rely on pre-recorded 'master screens'
2. Recording mode is done via the objc-c file lining out all of the tests
3. A first run need to be made for that to happen, which will save ref images to disk
4. turn off recording

In addition:

1. Tests must live in a special directory called IntegrationTests and have the boilerplate files
residing in it, this is in order for tests to live outside of the fb-universe
2. Image snapshot in record mode are saved in an internal magic folder (get that out of the testing infra), can be configurable
but hard to find.

(key: referenceImagesDirectory)

