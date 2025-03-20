# MoonR_Task1

📋 Prerequisites

Node.js (v18 or later recommended)

MongoDB (Local instance)

Thunder Client (or Postman) for testing

📂 Project Setup

1️⃣ Clone the Repository

2️⃣ Install Dependencies

Install the required packages with:

Dependencies Used:

3️⃣ Set Up MongoDB

Start your MongoDB instance locally.


4️⃣ Run the Server


The server will run on http://localhost:3000 by default.

🔎 Testing the API

Endpoint: POST /identify

Open Thunder Client (or Postman).

Make a POST request to:  http://localhost:3000/identify

Sample Request Body:
 {
  "email" : "test1@gmail.com",
  "phoneNumber":"test22"
} 

Sample Response:

🔄 Back Transition Configuration

To see back transitions set the "matchedByIp" boolean to false. 