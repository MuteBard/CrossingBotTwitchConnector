# Crossing Bot Twitch Connector (CBTC)

[Link to CrossingBot website](https://www.crossingbot.com/)

![](https://cdn.discordapp.com/attachments/685583064885100568/719665723986804793/crossingbotv1.png)

## General Commands

- **!bug** Catch a bug

- **!fish** Catch a fish

- **!sell *[creature name]*** Removes a bug or fish from your pocket and you get its value in bells stored to your own bells

- **!sell all** Removes everything from your pocket and you get the total value in bells added to your own bells

- **!rare bugs** List rare bugs available this month

- **!rare fishes** List rare fishes available this month

- **!pocket** Displays all bugs and fish in your pocket

- **!bells** Displays current bells owned

- **!turnips** Displays how many turnips you own and how they are faring in the market

- **!market** Displays the prices of turnips on the ever changing Stalk Market

- **!buy *[quantity]* turnips** Allows you to buy turnips

- **!sell *[quantity]* turnips** Allows you to sell turnips

- **!confirm** Allows for execution of a turnip transaction

- **!cancel** Allows for termination of a turnip transaction

## How It Works

### Main.js

The application and server is started up here by calling CollectData.js

### CollectData.js

User commands are received and filtered in CollectData.js and some commands have additional validation to ensure that users are not entering bad data. Data from
Option.js and Bank.js are supplied to CollectData.js to populate key collections.
Once a command is successfully filtered, it goes to its corresponding function A in
ProcessData.js

### ProcessData.js

General function A sends an object of parameter values and callback function C to a corresponding function B in Route.js. Once it receives data from function B in Route.js, callback function C is responsible for formatting that data for a response on the user's twitch channel. ProcessData.js is also responsible for updating Bank.js periodically.

### Route.js

General function B's parameters provide data for GraphQL Queries and mutations and callback way to send data back to ProcessData.js function C. It imports connection data from Option.js and Query.js and Mutation.js string schemas. Here CBTC communicates with CBAS through GraphQL and performs several operations that valid data is returned back to function C.
It also makes several unique calls to Twitch to get id and avatar data and responds to a single REST route call from CBRC to verify that users are who they say they are upon sign up on CBRC