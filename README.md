# serverless-chatbase-dialogflow-bot-skeleton

**WORK IN PROGRESS**

## Description

A multi-platform, serverless chatbot skeleton, featuring Chatbase (analytics) and Dialogflow (Natural Language Processing) integration.

## Features

 * Runs on `AWS Lambda`, based on `claudia-bot-builder`
 * Supports multiple messaging platforms: Facebook, Skype, Slack, Telegram, Viber
 * Supports Amazon Echo (Alexa)
 * Built-in Chatbase integration for usage analytics
 * Built-in Dialogflow integration for Natural Language Processing

## Requirements

 * Node.js 6.10 (depends on available `AWS Lambda` runtimes)

## Deploying

### Prerequisites

* An Amazon Web Services account

### Configuring Dialogflow

 1. Create a new `agent`
 2. Zip the `/config/dialogflow` directory (zip the whole directory from "outside")
 3. Open the `agent` settings
 4. Go to `Export and Import`
 5. Choose `Restore from zip`
 6. Select the `.zip` file created at step #2

### Deploying the bot on AWS Lambda

Being based on `Claudia.JS` tools and bot framework, deploying the bot is a simple and straightforward operation. Please refer to the [official `claudia-bot-builder` tutorial](https://claudiajs.com/tutorials/hello-world-chatbot.html), paragraph: **Deploying the bot**.

It's also worth reading the [tutorial on managing multiple environments in Lambda](https://claudiajs.com/tutorials/versions.html).

Please note that `claudia` commands *MUST* be ran from the `/src` directory.

### Setting the environment variables

Set the following environment variables in the AWS Lambda function created with `claudia`:

| VARIABLE NAME                  | DESCRIPTION                    |
|--------------------------------|--------------------------------|
| `DIALOGFLOW_CLIENT_ACCESS_KEY` | Dialogflow Client Access Token |
| `CHATBASE_API_KEY`             | Chatbase API Key               |

Environment variables can also be set with `claudia`, using the `--set-env` and `--set-env-from-json` option switches.

Run: `$ ./node_modules/.bin/claudia create --help` from the `/src` directory for info.

`claudia` also supports `AWS KMS` to encrypt environment variables values, see the "help" for the `--env-kms-key-arn` option switch.
