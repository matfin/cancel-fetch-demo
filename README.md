# Cancel fetch demo

This is a small demo project in React that demonstrates the use of [Abortable fetch](https://developers.google.com/web/updates/2017/09/abortable-fetch).

## What's the use case for this?

If you have an app with several different sections of the UI, making use of abortable fetch will allow you to cancel any pending API calls made to fetch data when you land on a view.

In this case, we have a list of users, photos and posts. As we navigate between these sections and land on a new one, a call is made to fetch the relevant data.

If we quickly navigate away to another section and the call to fetch data is still pending, then that call will be cancelled before it's completed.

This is very useful to ensure good UI performance and prevent any unnecessary API calls from being made.

## How is this done?

We make use of [Redux-Saga](https://redux-saga.js.org/) and trigger a call to an action when the user lands on a view.

This action is picked up by Redux-Saga and an API call is made using a simple get utility function we created.

Inside this `get` call, we pass in an Abort Controller signal linked specifically to that call and if we call `signal.abort()`, it cancels the call and the subsequent processig if it has reached that stage.

Inside the root saga for each of the users, posts and photos sagas, we fork the task to fetch the data.

Meanwhile, inside the `useEffect` calls for each of the container components for users, posts, photos etc, we call to cancel any pending calls via another action we have created.

If the saga detects this cancellation, we cancel the fork and the generator function that calls to fetch the data receives the signal to cancel.

We can then call `signal.abort()` and cancel the api call made.