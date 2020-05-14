# InfluxDB Transport
[![Documentation](./docs/badge.svg)](https://scriptinatorio.github.io/winston-influx/) 

This package is used by Scriptinator's services to aggregate logging and other measurements. We use InfluxDB as our
time-series database of choice.

## Collecting Metrics

You can use the global writer to collect your metrics
```javascript
const {connect, writePoint} = require('@honzamac/winston-influx');

// Connect to the database
connect({ 
    host: 'localhost',
    database: 'my_metrics_database',
    interval: 10 // Flush every 10 seconds
});


// Write metrics
writePoint(
    // measurement name
    'request',
    // tags
    {
        method: 'GET',
        service: 'api-gateway'
    },
    // fields
    {
        responseTime: 15
    }
);

```

Optionally, you can use a local `InfluxWriter` and not expose the connection to the entire application:

```javascript
const {InfluxWriter} = require('@honzamac/winston-influx');

let writer = new InfluxWriter({ 
  host: 'localhost',
  database: 'my_metrics_database',
  interval: 10
});

writer.writePoint(
    'request',
    {
        method: 'GET',
        service: 'api-gateway'
    },
    {
        responseTime: 15
    }   
);
```
