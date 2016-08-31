/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const findXcodeProject = require('./findXcodeProject');
const parseIOSSimulatorsList = require('./parseIOSSimulatorsList');
const Promise = require('promise');
const JSONStream = require('JSONStream')
const open = require('open')

//TODO identify redbox errors?
//
const animationVisualizer = (files, cb)=>{
  const ref = files[0]
  const target = ref.replace('reference_', 'anim_').replace('.png', '.gif')
  //TODO promisify / async this
  fs.unlink(target, ()=>{
    const gm = require('gm')
    gm()
      .loop(-1)
      .delay(150)
      .out(files[0])
      .delay(150)
      .out(files[1])
      .write(target, (err)=>{
             console.log("error", err)
             cb(err, target)
      })
  })
}

const diffVisualizer = (files, cb)=>{
  cb(null, files[0].replace("reference_", "diff_"))
}

const visualize = animationVisualizer


function matchingSimulator(simulators, simulatorName) {
  for (let i = simulators.length - 1; i >= 0; i--) {
    if (simulators[i].name === simulatorName) {
      return simulators[i];
    }
  }
}
const argv = process.argv

  const xcodeProject = findXcodeProject(fs.readdirSync('.'));
  if (!xcodeProject) {
    throw new Error(`Could not find Xcode project files in ios folder`);
  }
  const scheme = path.basename(xcodeProject.name, path.extname(xcodeProject.name));
  console.log(`Found Xcode ${xcodeProject.isWorkspace ? 'workspace' : 'project'} ${xcodeProject.name}`);

  const simulators = parseIOSSimulatorsList(
    child_process.execFileSync('xcrun', ['simctl', 'list', 'devices'], {encoding: 'utf8'})
  );
  const selectedSimulator = matchingSimulator(simulators, 'iPhone 6');
  if (!selectedSimulator) {
    throw new Error(`Cound't find ${args.simulator} simulator`);
  }

  const simulatorFullName = `${selectedSimulator.name} (${selectedSimulator.version})`;


  //TODO debounce FS events
  //TODO use ava spinner for build
  //TODO test when build fails?
  fs.watch('FlexBoxKatasTests', (event, filename) => {
    //TODO filter on real filename patterns that we use
    console.log(`event is: ${event}`);
    if (filename) {
      console.log(`filename provided: ${filename}`);
    } else {
      console.log('filename not provided');
    }
    if(/.*\.m/.test(filename)){
      //TODO cancel or don't run builds that come from additional events while a build is running
      runXctool('build-tests')
    }
  });

  //TODO debounce FS
  fs.watch('../IntegrationTests', (event, filename) => {
    //TODO filter on real filename patterns that we use
    filename = filename + ""
    console.log(`event is: ${event}`);
    if (filename) {
      console.log(`filename provided: ${filename}`);
    } else {
      console.log('filename not provided');
    }
    if(/.*\.js/.test(filename)){
      //TODO cancel or don't run builds that come from additional events while a build is running
      runXctool('run-tests')
    }
  });
  console.log("Awaiting orders...")

  //TODO images are not getting recorded in record mode - supply images dir for recordmode?
  function runXctool(mode){
    const xcodebuildArgs = [
      mode,
      xcodeProject.isWorkspace ? '-workspace' : '-project', xcodeProject.name,
      '-scheme', scheme,
      '-sdk', 'iphonesimulator',
      '-destination', `id=${selectedSimulator.udid}`,
      '-reporter', 'json-stream',
    ];

    console.log(`Building using "xctool ${xcodebuildArgs.join(' ')}"`);
    //TODO detect when process is done and print
    const xctool = child_process.spawn('xctool', xcodebuildArgs);
    if(mode == 'run-tests'){
      const ksdiff = /ksdiff "(.*)" "(.*)"/
      const diffs = []
      const xcpipe = xctool.stdout.pipe(JSONStream.parse())
      xcpipe.on('data', (data)=>{
        switch(data.event){
          case 'end-test':{
            console.log(`${data.methodName} ${data.succeeded ? 'V' : 'X'}`)
          }
          case 'test-output':{
            const match = ksdiff.exec(data.output)
            console.log(data)
            //TODO pass the match tuple to a visualizer. that visualizer
            //can display a diff (picking the existing one) or
            //an animation we build with GraphicsMagick
            /*
              2016-06-01 09:45:16.450 FlexBoxKatas[65308:6322073] If you have Kaleidoscope
              installed you can run this command to see an image diff:

              ksdiff
              "/Users/dotan.nahum/Library/Developer/CoreSimulator/Devices/36CCCDC8-5EA5-44D1-B5BF-4E20A93A7F9D/data/Containers/Data/Application/538D22A4-CB4A-463E-85BD-75509DFBB756/tmp/IntegrationTests-IntegrationTestsApp/reference_testSecondLayoutTest_1@2x.png"
              "/Users/dotan.nahum/Library/Developer/CoreSimulator/Devices/36CCCDC8-5EA5-44D1-B5BF-4E20A93A7F9D/data/Containers/Data/Application/538D22A4-CB4A-463E-85BD-75509DFBB756/tmp/IntegrationTests-IntegrationTestsApp/failed_testSecondLayoutTest_1@2x.png"
            */
            if(match){
              diffs.push([match[1], match[2]])
            }
          }
        }
      })
      xcpipe.on('end', ()=>{
         console.log("diffs:", diffs)
         //TODO take the first failing thing. more elegantly
         if(diffs.length > 0){
           visualize(diffs[0], (err, target)=>{
            console.log('---> opening', target)
            //TODO opening the same files repeatedly is bad.
            //consider stitching _all_ results and showing thumbs of
            //everything at once (this means we don't do streaming at all)
            //OR, only show failing visuals for first test that failed

            child_process.execFileSync('qlmanage', ['-p', target], {encoding: 'utf8'})
            //open(target)
           })
         }
      })
    }
  }

