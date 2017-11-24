[![codebeat badge](https://codebeat.co/badges/ecc2ce3e-4d42-428d-be61-296daad8c38f)](https://codebeat.co/projects/github-com-edonosotti-serverless-chatbase-dialogflow-bot-skeleton-master)

# serverless-chatbase-dialogflow-bot-skeleton

## Description

A multi-platform, serverless chatbot skeleton, featuring **Chatbase** (analytics) and **Dialogflow** (Natural Language Processing) integration.

## Features

 * Runs on `AWS Lambda`, based on `claudia-bot-builder`
 * Supports multiple messaging platforms: **Facebook**, **Skype**, **Slack**, **Telegram**, **Viber**
 * Supports **Amazon Echo** (Alexa)
 * Built-in **Chatbase** integration for usage analytics
 * Built-in **Dialogflow** integration for Natural Language Processing

## Requirements

 * `Node.js 6.10` (depends on available `AWS Lambda` runtimes)

## Deploying

### Prerequisites

* An `Amazon Web Services` account

### Configuring Dialogflow

 1. Create a new `agent`
 2. Zip the `/config/dialogflow` directory (zip the whole directory from "outside")
 3. Open the `agent` settings
 4. Go to `Export and Import`
 5. Choose `Restore from zip`
 6. Select the `.zip` file created at step #2

### Deploying the bot to AWS Lambda

Being based on `Claudia.JS` tools and bot framework, deploying the bot is a simple and straightforward operation. Please refer to the [official `claudia-bot-builder` tutorial](https://claudiajs.com/tutorials/hello-world-chatbot.html), paragraph: **Deploying the bot**.

It's also worth reading the [tutorial on managing multiple environments in Lambda](https://claudiajs.com/tutorials/versions.html).

Please note that `claudia` commands *MUST* be ran from the `/src` directory. If  is not installed "globally", you can use the local copy packaged with the sources: `$ ./node_modules/.bin/claudia`.

### Setting the environment variables

Set the following environment variables in the AWS Lambda function created with `claudia`:

| VARIABLE NAME                  | DESCRIPTION                    |
|--------------------------------|--------------------------------|
| `DIALOGFLOW_CLIENT_ACCESS_KEY` | Dialogflow Client Access Token |
| `CHATBASE_API_KEY`             | Chatbase API Key               |

Environment variables can also be set with `claudia`, using the `--set-env` and `--set-env-from-json` option switches.

Run: `$ ./node_modules/.bin/claudia create --help` from the `/src` directory for info.

`claudia` also supports `AWS KMS` to encrypt environment variables values, see the "help" for the `--env-kms-key-arn` option switch.

## A note on vendorized dependencies

This project includes a local copy of its dependencies, stored in the `/src/node_modules` directory. This practice is known as _"vendoring"_ and is not generally considered a best practice, but an annoying and dangerous incident happened not even long ago in the `Node.JS` community made me re-evaluate it. You can find good coverage of the incident searching for: _"node.js broke the internet"_, such as:

 * http://www.businessinsider.com/npm-left-pad-controversy-explained-2016-3
 * http://www.zdnet.com/article/disgruntled-developer-breaks-thousands-of-javascript-node-js-apps/
 * https://medium.com/@Rich_Harris/how-to-not-break-the-internet-with-this-one-weird-trick-e3e2d57fee28

To perform a fresh installation of all the dependencies, just remove all files from the `/src/node_modules` directory and run: `$ npm install` from the `/src` directory.
