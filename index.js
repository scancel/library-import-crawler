const Nightmare = require('nightmare');
const nightmare = Nightmare({
    show: false
});

const veritoneCredentials = {
    email: process.env.VERITONE_USERNAME,
    password: process.env.VERITONE_PASSWORD
};
const personsToMock = process.env.PERSONS_TO_MOCK || 50 * 1000;
const libraryId = process.env.LIBRARY_ID || "00998993-dfb4-42b9-b03a-50421bdc55e3";

function createNewPerson(){
    if(counter < personsToMock){
        let currentTime = Date.now();
        console.log("Counter: " + (counter + 1) + ", current time: " + currentTime + ", iteration time: " + (currentTime - lastTime)/1000 + "s");
        lastTime = currentTime;
        nightmare.goto('https://library.aws-dev.veritone.com/libraries/' + libraryId + '/entity/add')
            .wait('input[name="entityName"]')
            .type('input[name="entityName"]', 'john doe ' + ++counter + '_' + currentTime.toString().substring(7))
            .click('.bottom-button-row button.md-accent')
            .wait('a[href="/libraries/' + libraryId + '/entity/add"]')
            .then(createNewPerson)
    }
    else{
        nightmare.end().then(() => console.log('Finished creating ' + personsToMock + ' mocked persons successfully.'));
    }
}

let counter = 0, lastTime = Date.now();
nightmare
    .goto('https://www.aws-dev.veritone.com/login/#/')
    .wait('input[name="email"]')
    .type('input[name="email"]', veritoneCredentials.email)
    .type('input[name="password"]', veritoneCredentials.password)
    .click('button[type=submit]')
    .wait('.icon-veritone-discovery')
    .then(()=>{
        console.log("Login finished successfully, starting to create persons...");
        createNewPerson();
    });
console.log("Started login process...");
