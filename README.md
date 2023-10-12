# Init

# Deploy

gcloud functions deploy quoteOfTheDay --env-vars-file .env.yaml --runtime nodejs18 --trigger-http --allow-unauthenticated
