# Raspberry Pi KittyCam

![RPi KittyCam](https://lh3.googleusercontent.com/o-XG7ZijXM_UXQHuYrDxC6mlTofyUzUCmHqNmr6oRYZk=w1346-h757-no "Rapsberry Pi KittyCam")

![RPi KittyCam](https://lh3.googleusercontent.com/UuKlrNQWs5wFciRqI8qiZKTVoh4XrTBa40LD5mUa5MIn=w1346-h757-no "Rapsberry Pi KittyCam")

Raspberry Pi app using a camera and PIR motion sensor, written in Node.js using Johnny-Five and KittyDar for  with cat facial detection.

**I will write up the step-by-step tutorial (hopefully) soon!** But unti then, here is the instruction how to run this code locally with your own Raspberry Pi.


## Building the Circuit

### What you need

- Raspberry Pi 2 (with Raspbian. Also with WiFi adapter)
- 5MP Camera Board Module ([buy](http://www.amazon.com/gp/product/B00E1GGE40/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00E1GGE40&linkCode=as2&tag=girliemac-20&linkId=2OCOQHE3JOB5U7OF))
- Pyroelectric Infrared (PIR) motion sensor ([buy](http://www.amazon.com/gp/product/B00IYE7X9A/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00IYE7X9A&linkCode=as2&tag=girliemac-20&linkId=BSNV7DTMA2BMRDDQ))
- 3 F-to-F wires ([buy](http://www.amazon.com/gp/product/B007MRQC1K/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B007MRQC1K&linkCode=as2&tag=girliemac-20&linkId=HRFGKRZW6NAVPVOS))

If you are a Raspberry Pi newbie, I recommend to buy your first Pi from [CanaKit](http://www.amazon.com/gp/product/B008XVAVAW/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B008XVAVAW&linkCode=as2&tag=girliemac-20&linkId=DU2AO5J5GTPAQMPO).

### Wiring

- 1 red wire: PIR-VCC to Pi's 3V
- 1 black wire: PIR-GND to Pi's ground
- 1 whatever color wire: PIR-OUT to Pi's Pin 7 (GPIO 4)

![RPi PIR](https://lh3.googleusercontent.com/vInXgXGKPueI2J4zq88BgUJOkcXgJCvReVT4kA2K1A16=w1424-h801-no "Rapsberry Pi 2, camera, and PIR wired")




## Software Setup

### 1. Install node.js in your Raspberry Pi

#### Make sure your Pi is up-to-date

`$ sudo apt-get update`

then

```
$ sudo apt-get upgrade
```

#### Download node

```
$ wget http://node-arm.herokuapp.com/node_latest_armhf.deb
```

once downloaded, install

```
$ sudo dpkg -i node_latest_armhf.deb
```

Check if node is successfully installed

```
$ node -v
```

### 2. Enable Camera access

Go to Pi Software Config Tool to enable camera

```
$ sudo raspi-config
```

Test if your camera is working by try typing this command on terminal:

```
$ raspistill -o photo.jpg
```


## Running this Code

I would like to say, `$ npm install` to install all the dependencies, and voilà! but it is not!

### 1. Prerequisite: Install Cairo to the System

for cat facial detection, I am using **kittydar**, which dependencies including **node-canvas**, which requires **Cairo**.

So let's get Cairo on your Raspbian first.

```
$ sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
```

See more info on how to install Cairo for Node [Canvas](https://github.com/Automattic/node-canvas), see this [*Installation Ubuntu and other Debian based systems*](https://github.com/Automattic/node-canvas/wiki/Installation---Ubuntu-and-other-Debian-based-systems)

If you download and use the whole `node_modules` contents off this repo, skip the step 2, and proceed to step 3.
Otherwise, go to the next step to fresh-install the next several modules.


### 2. Install Dependency Modules

#### Install KittyDar

![Jamie detected](http://res.cloudinary.com/girliemac/image/upload/v1440530252/jrfqcdul46c84qlqlks9.png "Jamie detected by KittyDar")
*This is an actual photo taken by my Raspberry Pi, while Jamie was eating, and detected by KittyDar cat facial detection!*


Once your environment is set up, in this RPi-KittyCam dir, install node dependency modules.

Ideally install from `npm install kittydar —save`

However, node-canvas 1.0.1 (the version specified in package.json for KittyDar) failed to build with the current Node.js (v0.12.6).

So what I did was download the zip from github repo into *node_modules*, alter the `package.json`, where canvas: ~1.0.1 to ^1.0.1 so that the latest canvas is installed as I `npm install` from the kittydar directory.

Get the zip from [my forked repo](https://github.com/girliemac/kittydar).

*Note: I am sending a pull request (https://github.com/harthur/kittydar/pull/27)*

#### Install Johnny-Five

```
$ npm install johnny-five
```

#### Install PubNub

For realtime live-updating the web interface, use PubNub.

```
$ npm install pubnub
```

You need to [sign up and get you own publish and subscribe keys!](http://pubnub.com)

#### Install Cloudinary

For storing photos, use Cloudinary.

```
$ npm install cloudinary
```

You need to [sign up and get you own API keys!](http://cloudinary.com)

### 3. Set up your config.js with Credentials

Create a `config.js` in the root dir of the app.
The file should include your API keys:

```
module.exports = {

  cloudinary: {
    cloud_name: 'your_name',
    api_key: 'your_API_key',
    api_secret: 'your_API_secret',
  },

  pubnub: {
    subscribe_key: 'your_sub_key',
    publish_key: 'your_pub_key'
  }

};
```

### 4. Run the Code

You must run with sudo:

```
$ sudo node kittyCam.js
```

The camera will take a photo when a motion is detected by the PIR sensor.
Then the child_process runs to detect if there is any cats in the photo.
When there are any cat, it sends the photo to Cloudinary.

Analized photos are deleted from the filesystem to clear up Pi.

### 5. View the Live Photo Update on Web

- Get the web interface source code from `gh-pages` branch.
- Run the `index.html` on browser


## Known Issue

### Raspistill (Camera Software)
- Raspistll continuously takes a bunch of photos when I set `t = 0` (and crashes Pi while so many child process is running) so I have set `t = 1`, which causes delay. It seems to take only integer. Cats are too fast to wait for a second. 
- The camera can't capture recognizable pics after the sun is set. My room light is too dark.

### KittyDar (Cat Facial Recognition)

- During mealtime. When a cat is eating food (head-down position), the facial detection doesn't recognize the cat at all.
- When my cat moves, eats from the side of the dish, or put his butt on the camera, it fails to tell me my cat was eating.

#### The cat photos failed to be recognized

![Jamie undetected](photo/image_14.jpg "Jamie undetected")
![Jamie undetected](photo/image_24.jpg "Jamie undetected")
![Jamie undetected](photo/image_150.jpg "Jamie undetected")
![Jamie undetected](photo/image_166.jpg "Jamie undetected")
