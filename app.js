const mailchimp = require("@mailchimp/mailchimp_marketing");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Using body-parser
app.use(express.urlencoded({extended:true}));

// The public folder which holds the CSS
app.use(express.static("public"));

// Listening on port 3000 and if it goes well then logging a message saying that the server is running
app.listen(3000, function () {
console.log("Server is running at port 3000");
});

// Sending the signup.html file to the browser as soon as a request is made on localhost:3000
app.get("/", function (req, res) {
res.sendFile(__dirname + "/signup.html");
});

// Setting up MailChimp
mailchimp.setConfig({
apiKey: "a596ee89b2f2a9585a0fbf0fa7837dce8-us1",
server: "us1"
});

// As soon as the sign in button is pressed execute the following
app.post("/", function (req,res) {
const firstName = req.body.fName;
const lastName = req.body.lName;
const email = req.body.email;

// Add a contact to an audience
const listId = "64ccadbcfd";
const subscribingUser = {
  firstName: firstName,
  lastName: lastName,
  email: email
};

// Uploading the data to the server
async function run() {
  const response = await mailchimp.lists.addListMember(listId, {
  email_address: subscribingUser.email,
  status: "subscribed",
  merge_fields: {
  FNAME: subscribingUser.fName,
  LNAME: subscribingUser.lName
  }
});

// If all goes well logging the contact's id
res.sendFile(__dirname + "/success.html")
console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
}

// Running the function and catching the errors (if any)
run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

// PLACED OUTSIDE OF THE POST, on failure.html redirect to the home route when clicking the try again btn
app.post("/failure", function(req, res) {
  res.redirect("/");
});