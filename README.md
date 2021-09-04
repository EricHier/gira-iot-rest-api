# Gira IoT REST API Node.JS wrapper

> This Node.js API wrapper makes it easier to work with the Gira IoT REST API. This documentation of the underlying API can be found [here](https://download.gira.de/data3/Gira_IoT_REST_API_v2_DE.pdf).

The wrapper is class-based. Currently, there is no documentation - feel free to add one in a pull request. 

This example illustrates the functionality: 

```JS
import GiraSmartHomeClient from "./index.js";

async function setup() {
    
    // create client
    const client = await new GiraSmartHomeClient("<Host>", { username: "<Username>", password: "<Password>" });

    // get all functions
    const functions = await client.getAllFunctions();
    
    // get a value
    const value = await client.getValue("<Datapoint ID>");
    
    // set a value
    await client.setValue("<Datapoint ID>", "<Value>")
}

setup()
```