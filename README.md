<p align="center">
  <img src="https://i.imgur.com/5vut1a3.png" />
  <h1 align="center">Todo Manager Website</h1>
</p>

## Table of Contents
* [Introduction](#introduction)
* [Features](#features)
* [Technologies](#technologies)
* [Setup](#setup)
* [Team](#team)
* [Contributing](#contributing)
* [Others](#others)

### Introduction
Todo Manager website is one of three small projects that form up the Todo Manager project that can be found here:
```
https://github.com/tjtanjin/CVWO-Assignment
```
This repository contains work concerning the website for Todo Manager, which serves to communicate with our backend API server while providing users with a nice and convenient interface to use our application.

Application link:
```
https://todo-manager.tjtanjin.com
```

### Features
In order to improve user experience, Todo Manager website comes equipped with features such as sorting and searching of tasks as well as a dashboard that provides an overview and statistics for users. Messages are also personalized as much as possible to add a bit of personal touch to our application.

If you are interested in the full list of our application features, please refer to our user guide:
```
https://github.com/tjtanjin/todo_website/wiki/User-Guide
```

### Technologies
Technologies used by Todo Manager website is as below:
##### Done with:

<p align="center">
  <img height="150" width="150" src="https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png" />
</p>
<p align="center">
React
</p>
<p align="center">
  <img height="150" width="150" src="https://img.icons8.com/color/240/000000/bootstrap.png" />
</p>
<p align="center">
Bootstrap
</p>

##### Deployed on:
<p align="center">
  <img height="150" width="150" src="https://www.netlify.com/img/press/logos/logomark.png" />
</p>
<p align="center">
Netlify
</p>

##### Project Repository
```
https://github.com/tjtanjin/todo_website
```

### Setup
The following section will guide you through setting up your own Todo Manager Website!
* As this project is hosted on netlify, it would be easier to fork this repository instead of cloning it locally so as to facilitate easier automatic deploys later on in the guide. However, if you wish to clone this repository, go ahead and cd to where you wish to store the project and clone it as shown in the example below:
```
$ cd /home/user/exampleuser/projects/
$ git clone https://github.com/tjtanjin/todo_website.git
```
* Within the netlify dashboard, configure github for automatic deploys (hence my suggestion to fork instead of cloning the repository) or manually upload the project files.
* You will also need to add an environment variable with the API endpoint as value to the key REACT_APP_API_LINK and you are good to go!
* Note that the website is highly reliant on the [Todo API](https://github.com/tjtanjin/todo_api) to work properly. Hence, you might be interested to checkout this [guide](https://github.com/tjtanjin/todo_api#setup) as well.
* Netlify also comes equipped with support for SSL but you will first have to obtain your own certificate through letsencrypt which will not be covered in this setup guide.

### Team
* [Tan Jin](https://github.com/tjtanjin)

### Contributing
If you have code to contribute to the project, open a pull request and describe clearly the changes and what they are intended to do (enhancement, bug fixes etc). Alternatively, you may simply raise bugs or suggestions by opening an issue.
### Others
If there are any questions pertaining to the application itself, kindly use the chatbot found at the bottom right corner of our application (https://todo-manager.tjtanjin.com).

For any questions regarding the implementation of the project, please drop me an email at: cjtanjin@gmail.com.
