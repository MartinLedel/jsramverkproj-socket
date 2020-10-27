# Setup

## Clone repo
`git clone https://github.com/MartinLedel/jsramverkproj-socket.git`
## Install dependencies
`npm install`
## Start socket server
`node app.js`

## Access socket at:
`localhost:8300`

## Technologies
This socket server runs on socket.io and uses MongoDB for access a database for retrieving and uploading
data related to stocks.

A common connection is started were it listens to "stock name". Here it retrieves the relevant stock
from MongoDB and saves it on a global variable. From this variable a function set on an interval can
use its data for emitting the stock price to the client and updates the relevant stock with its new
price.

I thought this way worked fine. Don't know if its the way socket.io should work. Can be that using
database calls inside socket.io could cause delays in the transmissions.
