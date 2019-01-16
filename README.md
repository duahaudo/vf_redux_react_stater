# Before started
1. update link to static resource in local:
    * `webpack/webpack.config.prod.js` -> `output.path`
    * `package.json` -> `script.prod`
2. copy content from webpack/apex_template.html to real apex page (correct the static resource name)

# Command
1. Run in localhost `yarn start` 
2. Build to deploy `yarn build`
3. Run build file in local `yarn prod`
