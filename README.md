# Sample project

* Use this project as a template.
* Clone the project:
    * Using user/password: `git clone https://github.com/aviram26/sqe-workshop-2018-sample-project.git` 
    * Using SSH key: `git clone git@github.com:aviram26/sqe-workshop-2018-sample-project.git`
* Install all libraries run: `npm install`
* For code parsing, this project uses the [Esprima](http://esprima.org/) library.
    * See example usage in `src/js/code-analyzer.js`
* Run the project:
    * From the command-line run: `npm start`
    * After the bundler is done, execute the `index.html` from your IDE (preferably `WebStorm`)
    * Try the parser... 
* For testing, this project uses the [Mocha](https://mochajs.org/) library.
    * From the command-line run: `npm run test`
    * See example test in `test/code-analyzer.test.js`
* For coverage, this project uses the [nyc](https://github.com/istanbuljs/nyc) library.
    * From the command-line run: `npm run coverage`
    * See the report file `coverage/coverage-summary.json`
* For linting, this project uses the [ESLint](https://eslint.org/) library.
    * From the command-line run: `npm run lint`
    * See the report file `lint/eslint-report.json`

#### I/O Example

The input:

```javascript
function foo(x, y, z){
    let a = x + 1;
    let b = a + y;
    let c = 0;
    
    if (b < z) {
        c = c + 5;
        return x + y + z + c;
    } else if (b < z * 2) {
        c = c + x + 5;
        return x + y + z + c;
    } else {
        c = c + z + 5;
        return x + y + z + c;
    }
}
```

Should produce:

```javascript
function foo(x, y, z){
    if (x + 1 + y < z) {                //this line is red
        return x + y + z + 5;
    } else if (x + 1 + y < z * 2) {     //this line is green
        return x + y + z + x + 5; 
    } else {                            //this line is red
        return x + y + z + z + 5;
    }
}
```
