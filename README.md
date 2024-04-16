PDF Upload and Display Backend Server

Steps to run the code locally:-
- Git clone the repository using github desktop or using the `git clone` command.
- Create an /uploads directory inside the project
- Open a terminal in the project directory
- Do `npm install` to install all the node_modules
- Do `npm install -g ts-node` to install globally ts-node for running typescript index file.
- Run `ts-node index.ts` on the project directory and the port should be running in 3000

Steps to run the tests using jest:- In package.json check if the script object has {"test": "jest"} as its framework
(Can use ngentest to generate the tests as well from a .ts file)

- Run `npm test` to run the spec.ts files.