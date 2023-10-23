# Quote of the Day

[![Demo](https://img.shields.io/badge/Click-Me)](https://youtube.com/shorts/HnoNWAL02rs) VIDEO

Quote of the Day project is a simple but inspirational application that fetches a daily quote from a website. It sends the daily quote in parallel to a Telegram bot and your personal email, so you wake up to a motivating message every day through these communication channels.

## Features

- **Daily Motivation:** Receive a new motivational or thought-provoking quote every day to start your day on a positive note.

- **Parallel Delivery:** The quote is sent simultaneously to your Telegram bot and personal email, ensuring you never miss your daily dose of inspiration.

- **Website Scraping:** The project scrapes a website to obtain the daily quote, keeping the content fresh and relevant.

## Technologies Used

The Quote of the Day project leverages the following technologies:

- **Node.js:** The project is built on Node.js, allowing for efficient website scraping and email delivery.

- **Google Cloud Services:**
  - **Cloud Scheduler:** Google Cloud Scheduler is used to trigger the daily scraping and delivery of the quote from the website.
  - **Cloud Functions:** Google Cloud Functions handle the execution of the scraping and delivery processes in response to Cloud Scheduler triggers.

These technologies work together to provide a seamless and automated delivery of daily quotes to your email and Telegram bot.

## Installation

```bash
$ npm install
```

## Deploy

```bash
$ gcloud functions deploy quoteOfTheDay --env-vars-file .env.yaml --runtime nodejs18 --trigger-http --allow-unauthenticated
```
