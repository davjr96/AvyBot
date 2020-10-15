workflow "Deploy to cloud function" {
  on = "push"
  resolves = ["Deploy to Google Cloud"]
}

# install with yarn
action "Install" {
  uses = "actions/npm@1.0.0"
  runs = "npm"
  args = "install -g eslint"
}

# build with yarn
action "Lint" {
  needs = "Install"
  uses = "actions/npm@1.0.0"
  runs = "eslint"
  args = "index.js"
}

action "Setup Google Cloud" {
  uses = "actions/gcloud/auth@master"
  secrets = ["GCLOUD_AUTH"]
}

# Deploy Filter, only deploy on master branch
action "Deploy branch filter" {
  needs = ["Build", "Setup Google Cloud"]
  uses = "actions/bin/filter@master"
  args = "branch master"
}

# Deploy
action "Deploy to Google Cloud" {
  uses = "actions/gcloud/cli@master"
  needs = ["Deploy branch filter"]
  runs = "sh -c"
  args = ["gcloud --project $PROJECT_ID functions deploy reply --runtime nodejs12 --trigger-http"]
  secrets = ["GCLOUD_AUTH", "PROJECT_ID"]
}
