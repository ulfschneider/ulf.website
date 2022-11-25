---
title: Unblock longrunning JavaScript on the server
tags: code
---
I´m maintaining a Meteor JavaScript server application that collects data from Jira and SAP each night and provides reports about the data to web browser users. The application is managed with the PM2 cluster manager and is split into 4 frontend processes and 4 backend processes. The frontend processes have shortrunning actions and ensure the application responds quickly to user requests. The backend processes do the data collection. Unfortunately, collecting the data and calculating the reports can sometimes take quite long. So long, that every now and then I get exceptions like the one below in the log:

``` {.bleed-right}
Exception in setInterval callback: MongoServerSelectionError: connection <monitor> to 127.0.0.1:27017 timed out
    at Timeout._onTimeout (/home/strael/bundle/programs/server/npm/node_modules/meteor/npm-mongo/node_modules/mongodb/lib/core/sdam/topology.js:437:30)
    at listOnTimeout (internal/timers.js:557:17)
    at processTimers (internal/timers.js:500:7)
=> awaited here:
    at Function.Promise.await (/home/strael/bundle/programs/server/npm/node_modules/meteor/promise/node_modules/meteor-promise/promise_server.js:56:12)
    at packages/mongo/mongo_driver.js:1072:14
    at /home/strael/bundle/programs/server/npm/node_modules/meteor/promise/node_modules/meteor-promise/fiber_pool.js:43:40
=> awaited here:
    at Promise.await (/home/strael/bundle/programs/server/npm/node_modules/meteor/promise/node_modules/meteor-promise/promise_server.js:60:12)
    at SynchronousCursor._nextObject (packages/mongo/mongo_driver.js:1121:38)
    at SynchronousCursor.forEach (packages/mongo/mongo_driver.js:1135:22)
    at SynchronousCursor.map (packages/mongo/mongo_driver.js:1145:10)
    at SynchronousCursor.fetch (packages/mongo/mongo_driver.js:1169:17)
    at Cursor.<computed> [as fetch] (packages/mongo/mongo_driver.js:923:44)
    at MongoConnection.findOne (packages/mongo/mongo_driver.js:827:56)
    at Collection.findOne (packages/mongo/collection.js:385:29)
    at Module.getTopic (imports/api/admin.js:197:23)
    at Module.setNextSchedulerEvent (imports/api/settings.js:936:25)
    at evaluateSchedule (imports/api/scheduler.js:147:26)
    at Meteor.EnvironmentVariable.EVp.withValue (packages/meteor.js:1257:12)
    at packages/meteor.js:555:25
    at runWithEnvironment (packages/meteor.js:1320:24) ...
```


My interpretation of the problem was: The single threaded JavaScript process was so busy with doing a longrunning calculation without giving back control to the event loop scheduler that there was no space left to treat the intervall callback for the MongoDB driver, which raised the exception.

On my search for a solution I found [<cite>Node.js Event-Loop: How even quick Node.js async functions can block the Event-Loop, starve I/O</cite>](https://snyk.io/blog/nodejs-how-even-quick-async-functions-can-block-the-event-loop-starve-io/) by Michael Gokhman.

Michael is doing a lot of research and refers to the Node event loop documentation. The solution though, is to give back control to the event loop by interrupting longrunning tasks with the following function:

```js
export const unblockLongrunner = function () {
    //give the control from a longrunning calculation back to the event loop
    //see https://snyk.io/blog/nodejs-how-even-quick-async-functions-can-block-the-event-loop-starve-io/
    return new Promise(resolve => setImmediate(() => resolve()));
}
```

The function uses `setImmediate()` and not `setTimeout()` intentionally. While `setTimeout()` will unblock the longrunner, it has a huge performance impact, which `setImmediate()` doesn´t have to that extent.

The Node documentations says:

> `setImmediate()` is designed to execute a script once the current poll phase completes.
> `setTimeout()` schedules a script to be run after a minimum threshold in ms has elapsed.
> …
> The main advantage to using `setImmediate()` over `setTimeout()` is `setImmediate()` will always be executed before any timers if scheduled within an I/O cycle, independently of how many timers are present.
> …
> We recommend developers use `setImmediate()` in all cases because it's easier to reason about.
> <footer><a href="https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/">The Node.js Event Loop, Timers, and process.nextTick()</a></footer>


The `unblockLongrunner()` function has to be called from within longrunning actions. It´s a balancing act to not call it too often, because there is a computing overhead attached to it, and also calling it often enough, to avoid the blocking. The balancing requires to analyse the longrunning code and to play with certain calls of `unblockLongrunner()`. In my case it looks like:

```js
async function getInitialTransitionData() {
    for (let change of histories) {
        for (let item of change.items) {
            if (item.field == 'priority' && !transitionData.priority) {
                transitionData.priority = item.fromString;
                await UTILS.unblockLongrunner();
            }
            if (item.field == 'status' && !transitionData.status) {
                transitionData.status = item.fromString;
                await UTILS.unblockLongrunner();
            }
 
            if (transitionData.priority && transitionData.status) {
                return transitionData;
            }
        }
 
    }
    transitionData.status = transitionData.status || JIRA.getStatus(issue);
    transitionData.priority = transitionData.priority || JIRA.getPriority(issue);
    return transitionData;
}
```

The above code is one example of how I placed the `unblockLongrunner()`. You see the nested looping which makes the code a longrunner. In fact there are other locations in the code which also required unblocking. I can say in the end my problem was solved without an undesired performance impact.